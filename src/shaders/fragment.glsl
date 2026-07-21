uniform float iTime;
uniform float opacity;
uniform float mouseX;
uniform float mouseY;
varying vec2 vUv;
uniform vec2 iResolution;
uniform float rhombusColorFlux;
uniform float rhombusBodyPulse;
uniform float rhombusOrbitIntensity;
uniform float circleColorChange;
uniform float circleBodyChange;
uniform float circleOrbitChange;

// Rotaciona uma cor RGB ao redor do eixo neutro (cinza), alterando sua matiz.
vec3 rotateHue(vec3 color, float angle) {
    vec3 axis = normalize(vec3(1.0));
    return color * cos(angle)
        + cross(axis, color) * sin(angle)
        + axis * dot(axis, color) * (1.0 - cos(angle));
}

// Paleta cíclica: mapeia um valor t para uma cor RGB suave.
// a = cor base/média; b = amplitude; c = frequência por canal; d = fase.
// Visualmente: define a "temperatura" das cores (azul→rosa→laranja) e como elas ciclam no tempo.
vec3 palette(in float t, in float change) {
    float hueAngle = change * 6.28318;
    vec3 a = rotateHue(vec3(0.358, 0.498, 0.650), hueAngle);
    vec3 b = rotateHue(vec3(0.828, 0.498, 0.350), -hueAngle * 0.75);
    vec3 c = mix(vec3(0.530, 0.998, 0.620), vec3(0.620, 0.530, 0.998), change);
    vec3 d = vec3(0.438, 0.012, 1.025)
        + vec3(0.220, -0.170, 0.310) * change;

    vec3 color = a + b * cos(6.28318 * (c * t + d));
    vec3 vividColor = clamp(color, 0.0, 1.0);
    float luminance = dot(vividColor, vec3(0.299, 0.587, 0.114));

    // Em zero mantém a paleta original; ao subir, revela a versão mais saturada.
    vividColor = max(mix(vec3(luminance), vividColor, 1.35), 0.0);
    return mix(color, vividColor, change);
}

// Produto escalar "negativo" (x*x - y*y). Usado na SDF do losango.
float ndot(vec2 a, vec2 b) {
    return a.x * b.x - a.y * b.y;
}

// Signed Distance Function de um losango (rhombus).
// Retorno < 0 = dentro da forma; > 0 = fora; = 0 = borda.
// Visualmente: define o contorno geométrico base das "joias"/diamantes.
float sdRhombus(in vec2 p, in vec2 b) {
    p = abs(p);
    float h = clamp(ndot(b - 2.0 * p, b) / dot(b, b), -1.0, 1.0);
    float d = length(p - 0.7 * b * vec2(1.0 - h, 1.0 + h));
    return d * sign(p.x * b.y + p.y * b.x - b.x * b.y);
}

void main() {
    // Converte UV [0,1] → [-1,1] (origem no centro da tela).
    // Sem isso, o padrão ficaria ancorado no canto inferior esquerdo.
    vec2 uv = vUv * 2.0 - 1.0;

    // Corrige aspect ratio: evita que círculos/losangos fiquem ovalados em telas largas.
    uv.x *= iResolution.x / iResolution.y;

    // Guarda o UV original (sem tiling) para amostrar a paleta de forma contínua no espaço.
    vec2 uv0 = uv;

    // Acumulador de cor: começa preto; cada camada soma brilho/cor (additive blending).
    vec3 finalColor = vec3(0.0);
    float rhombusColorCycleDivisor =
        90.0 / (1.0 + 89.0 * rhombusColorFlux);
    vec2 rhombusSize = mix(
        vec2(0.22, 0.11),
        vec2(0.58, 0.29),
        rhombusBodyPulse
    );

    // ── Camada 1: padrão de losangos (2 iterações) ──────────────────────────
    // Poucas iterações = menos densidade/brilho; cada i adiciona um nível de detalhe fractal.
    for(float i = 0.0; i < 2.0; i++) {
        // Escala o espaço: aproxima o zoom e cria repetição mais densa a cada iteração.
        uv *= 1.74;

        // Tile infinito: repete o domínio em células [0,1] → visual de mosaico/fractal.
        uv = fract(uv);

        // Recentraliza cada célula em [-0.5, 0.5] para a SDF ficar no meio do tile.
        uv -= 0.5;

        // Em 0.5 mantém o corpo original; afastar-se do centro inicia o crescimento.
        float rhombusPulseOffset = rhombusBodyPulse - 0.5;
        float rhombusGrowthFrequency = mix(0.35, 2.8, rhombusBodyPulse);
        float rhombusGrowthAmplitude = abs(rhombusPulseOffset) * 0.32;
        float rhombusGrowth = 1.0
            + sin(iTime * rhombusGrowthFrequency + i * 3.14159)
            * rhombusGrowthAmplitude;

        // Distância ao losango (b = semi-eixos). Menor b = losango menor dentro do tile.
        float rhombusDistance = sdRhombus(uv, rhombusSize * rhombusGrowth);

        // Cor baseada na distância no UV original + índice da camada + tempo lento.
        // iTime/90 → ciclo de cor bem suave; i/2 → cada camada tem hue ligeiramente diferente.
        vec3 rhombusColor = palette(
            sdRhombus(uv0, vec2(5.0))
                + i / 2.0
                + iTime / rhombusColorCycleDivisor,
            rhombusColorFlux
        );

        // Modula a distância com seno + tempo → anéis pulsantes / ondas na borda.
        // Dividir por (8+i) reduz a intensidade (camadas mais profundas ficam mais fracas).
        rhombusDistance =
            sin(rhombusDistance * 5.0 + iTime / 2.0) / (8.0 + i);

        // Espelha valores negativos → linhas brilhantes simétricas nas bordas (glow).
        rhombusDistance = abs(rhombusDistance);

        // Inversão + potência: transforma distância em halo/neon (quanto menor d, mais brilho).
        // Expoente oscilando com sin(iTime) → o glow "respira" (ora mais fino, ora mais espalhado).
        rhombusDistance = pow(
            0.01 / rhombusDistance,
            sin(iTime) + 3.5 + rhombusPulseOffset * 1.4
        );

        // Órbita hipnótica: anéis em losango, com bordas duras e cores alternadas.
        float rhombusRadius = abs(uv0.x) + 2.0 * abs(uv0.y);
        float rhombusOrbitWave = 0.5 + 0.5 * cos(
            rhombusRadius * 12.0
                - iTime * mix(0.4, 2.2, rhombusOrbitIntensity)
        );
        float rhombusHardRing = step(
            mix(0.92, 0.42, rhombusOrbitIntensity),
            rhombusOrbitWave
        );
        float rhombusOrbitGlow = mix(
            1.0,
            mix(0.28, 1.55, rhombusHardRing),
            rhombusOrbitIntensity
        );
        vec3 rhombusOrbitColor = mix(
            rhombusColor,
            vec3(1.0) - clamp(rhombusColor, 0.0, 1.0),
            rhombusHardRing * rhombusOrbitIntensity
        );

        // Soma aditiva: camadas sobrepostas aumentam saturação e brilho onde se cruzam.
        finalColor +=
            rhombusOrbitColor * rhombusDistance * rhombusOrbitGlow;
    }

    // Reinicia UV para a segunda família de formas (não herdar o tiling dos losangos).
    uv = uv0;
    float circleCycleDivisor = 90.0 / (1.0 + 89.0 * circleColorChange);
    float circleDelta = circleBodyChange - 0.5;
    float circleRadius = 0.5 + circleDelta * 0.3;

    // ── Camada 2: padrão de círculos (4 iterações) ──────────────────────────
    // Mais iterações que os losangos → círculos dominam densidade e brilho final.
    for(float i = 0.0; i < 4.0; i++) {
        // Mesmo pipeline fractal: zoom → tile → centro.
        uv *= 1.74;
        uv = fract(uv);
        uv -= 0.5;

        // O pulso altera tamanho, frequência e amplitude sem mudar o padrão em 0.5.
        float circleGrowthFrequency = mix(0.35, 2.8, circleBodyChange);
        float circleGrowthAmplitude = abs(circleDelta) * 0.32;
        float circleGrowth = 1.0
            + sin(iTime * circleGrowthFrequency + i * 1.5708)
            * circleGrowthAmplitude;
        float d = length(uv) - circleRadius * circleGrowth;

        // Paleta guiada pelo raio local + tempo: cores fluem radialmente para fora do centro do tile.
        vec3 col = palette(
            length(uv) + i / 2.0 + iTime / circleCycleDivisor,
            circleColorChange
        );

        // Pulsação senoidal das bordas (mesmo efeito neon dos losangos).
        d = sin(d * 5.0 + iTime / 2.) / (8. + i);
        d = abs(d);

        // Halo neon que respira com o tempo.
        d = pow(
            0.01 / d,
            sin(iTime) + 3.5 + circleDelta * 1.4
        );

        // Órbita circular: anéis concêntricos, edge duro e inversão alternada.
        float circleWave = 0.5 + 0.5 * cos(
            length(uv0) * 16.0 - iTime * mix(0.4, 2.2, circleOrbitChange)
        );
        float hardCircleRing = step(
            mix(0.92, 0.42, circleOrbitChange),
            circleWave
        );
        float circleOrbitGlow = mix(
            1.0,
            mix(0.28, 1.55, hardCircleRing),
            circleOrbitChange
        );
        vec3 circleOrbitColor = mix(
            col,
            vec3(1.0) - clamp(col, 0.0, 1.0),
            hardCircleRing * circleOrbitChange
        );

        // Mistura com a camada de losangos → interferência visual / overpaint colorido.
        finalColor += circleOrbitColor * d * circleOrbitGlow;
    }

    // O tone mapping entra junto com o controle de cor; em zero, o visual é original.
    float combinedColorChange = max(rhombusColorFlux, circleColorChange);
    vec3 positiveColor = max(finalColor, 0.0);
    vec3 mappedColor = positiveColor / (1.0 + positiveColor);
    float finalLuminance = dot(mappedColor, vec3(0.299, 0.587, 0.114));
    mappedColor = max(mix(vec3(finalLuminance), mappedColor, 1.2), 0.0);
    finalColor = mix(finalColor, mappedColor, combinedColorChange);

    // Saída final opaca. (opacity/mouseX/mouseY existem como uniforms mas não afetam o visual aqui.)
    gl_FragColor = vec4(finalColor, 1);
}

uniform float iTime;
uniform float opacity;
uniform float mouseX;
uniform float mouseY;
varying vec2 vUv;
uniform vec2 iResolution;

// Paleta cíclica: mapeia um valor t para uma cor RGB suave.
// a = cor base/média; b = amplitude; c = frequência por canal; d = fase.
// Visualmente: define a "temperatura" das cores (azul→rosa→laranja) e como elas ciclam no tempo.
vec3 palette(in float t) {
    vec3 a = vec3(0.358, 0.498, 0.650);
    vec3 b = vec3(0.828, 0.498, 0.350);
    vec3 c = vec3(0.530, 0.998, 0.620);
    vec3 d = vec3(0.438, 0.012, 1.025);

    return a + b * cos(6.28318 * (c * t + d));
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

    // ── Camada 1: padrão de losangos (2 iterações) ──────────────────────────
    // Poucas iterações = menos densidade/brilho; cada i adiciona um nível de detalhe fractal.
    for(float i = 0.0; i < 2.0; i++) {
        // Escala o espaço: aproxima o zoom e cria repetição mais densa a cada iteração.
        uv *= 1.74;

        // Tile infinito: repete o domínio em células [0,1] → visual de mosaico/fractal.
        uv = fract(uv);

        // Recentraliza cada célula em [-0.5, 0.5] para a SDF ficar no meio do tile.
        uv -= 0.5;

        // Distância ao losango (b = semi-eixos). Menor b = losango menor dentro do tile.
        float d = sdRhombus(uv, vec2(0.4, 0.2));

        // Cor baseada na distância no UV original + índice da camada + tempo lento.
        // iTime/90 → ciclo de cor bem suave; i/2 → cada camada tem hue ligeiramente diferente.
        vec3 col = palette(sdRhombus(uv0, vec2(5, 5)) + i/2. + iTime / 90.);

        // Modula a distância com seno + tempo → anéis pulsantes / ondas na borda.
        // Dividir por (8+i) reduz a intensidade (camadas mais profundas ficam mais fracas).
        d = sin(d * 5.0 + iTime / 2.) / (8. + i);

        // Espelha valores negativos → linhas brilhantes simétricas nas bordas (glow).
        d = abs(d);

        // Inversão + potência: transforma distância em halo/neon (quanto menor d, mais brilho).
        // Expoente oscilando com sin(iTime) → o glow "respira" (ora mais fino, ora mais espalhado).
        d = pow(
            0.01 / d,
            sin(iTime)+3.5 
        );

        // Soma aditiva: camadas sobrepostas aumentam saturação e brilho onde se cruzam.
        finalColor += col * d;
    }

    // Reinicia UV para a segunda família de formas (não herdar o tiling dos losangos).
    uv = uv0;

    // ── Camada 2: padrão de círculos (4 iterações) ──────────────────────────
    // Mais iterações que os losangos → círculos dominam densidade e brilho final.
    for(float i = 0.0; i < 4.0; i++) {
        // Mesmo pipeline fractal: zoom → tile → centro.
        uv *= 1.74;
        uv = fract(uv);
        uv -= 0.5;

        // SDF de círculo (raio 0.5): anéis circulares em vez de diamantes.
        float d = length(uv) - 0.5;

        // Paleta guiada pelo raio local + tempo: cores fluem radialmente para fora do centro do tile.
        vec3 col = palette(length(uv) + i/2. + iTime / 90.);

        // Pulsação senoidal das bordas (mesmo efeito neon dos losangos).
        d = sin(d * 5.0 + iTime / 2.) / (8. + i);
        d = abs(d);

        // Halo neon que respira com o tempo.
        d = pow(
            0.01 / d,
            sin(iTime)+3.5 
        );

        // Mistura com a camada de losangos → interferência visual / overpaint colorido.
        finalColor += col * d;

    }

    // Saída final opaca. (opacity/mouseX/mouseY existem como uniforms mas não afetam o visual aqui.)
    gl_FragColor = vec4(finalColor, 1);
}

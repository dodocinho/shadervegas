import { useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  circleBodyChangeAtom,
  circleColorChangeAtom,
  circleOrbitChangeAtom,
  circlesControlsOpenAtom,
  geometryModeAtom,
  motionEnabledAtom,
  rhombusBodyPulseAtom,
  rhombusColorFluxAtom,
  rhombusControlsOpenAtom,
  rhombusOrbitIntensityAtom,
  toggleMotionAtom,
} from '../../state/controls'
import {
  CirclesIcon,
  InfoIcon,
  MotionIcon,
  RhombusIcon,
  SliderIcon,
} from './icons'
import { GeometryToggle } from './GeometryToggle'
import { ToggleControl } from './ToggleControl'

export function UIControls() {
  const [infoOpen, setInfoOpen] = useState(false)
  const geometryMode = useAtomValue(geometryModeAtom)
  const motionEnabled = useAtomValue(motionEnabledAtom)
  const toggleMotion = useSetAtom(toggleMotionAtom)
  const [rhombusActive, setRhombusActive] = useAtom(rhombusControlsOpenAtom)
  const [circlesActive, setCirclesActive] = useAtom(circlesControlsOpenAtom)
  const [rhombusColorFlux, setRhombusColorFlux] = useAtom(rhombusColorFluxAtom)
  const [rhombusBodyPulse, setRhombusBodyPulse] = useAtom(rhombusBodyPulseAtom)
  const [rhombusOrbitIntensity, setRhombusOrbitIntensity] = useAtom(
    rhombusOrbitIntensityAtom,
  )
  const [circleColorChange, setCircleColorChange] = useAtom(circleColorChangeAtom)
  const [circleBodyChange, setCircleBodyChange] = useAtom(circleBodyChangeAtom)
  const [circleOrbitChange, setCircleOrbitChange] = useAtom(circleOrbitChangeAtom)

  const toggleRhombusControls = () => {
    const nextActive = !rhombusActive
    setRhombusActive(nextActive)
    if (nextActive) setCirclesActive(false)
  }

  const toggleCircleControls = () => {
    const nextActive = !circlesActive
    setCirclesActive(nextActive)
    if (nextActive) setRhombusActive(false)
  }

  return (
    <header className="ui-controls">
      <nav className="ui-controls__actions" aria-label="Controles do shader">
        <GeometryToggle />

        <ToggleControl
          active={motionEnabled}
          label={geometryMode === 'sphere' ? 'Rotação' : 'Pan e zoom'}
          onToggle={toggleMotion}
          className="motion-toggle"
        >
          <MotionIcon active={motionEnabled} />
        </ToggleControl>

        <ToggleControl
          active={rhombusActive}
          label="Controles dos losangos"
          onToggle={toggleRhombusControls}
          className="rhombus-toggle"
        >
          <RhombusIcon />
        </ToggleControl>

        <ToggleControl
          active={circlesActive}
          label="Controles dos círculos"
          onToggle={toggleCircleControls}
          className="circles-toggle"
        >
          <CirclesIcon />
        </ToggleControl>
      </nav>

      {rhombusActive && (
        <section className="rhombus-panel" aria-label="Ajustes dos losangos">
          <label
            className="shader-slider shader-slider--color"
            aria-label="Maré de matiz"
          >
            <span className="shader-slider__icon">
              <SliderIcon kind="color" />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rhombusColorFlux}
              onChange={(event) =>
                setRhombusColorFlux(Number(event.target.value))
              }
              title="Maré de matiz"
            />
            <output>{Math.round(rhombusColorFlux * 100)}</output>
          </label>

          <label
            className="shader-slider shader-slider--neon"
            aria-label="Corpo neon"
          >
            <span className="shader-slider__icon">
              <SliderIcon kind="neon" />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rhombusBodyPulse}
              onChange={(event) =>
                setRhombusBodyPulse(Number(event.target.value))
              }
              title="Corpo neon"
            />
            <output>{Math.round(rhombusBodyPulse * 100)}</output>
          </label>

          <label
            className="shader-slider shader-slider--orbit"
            aria-label="Órbita hipnótica"
          >
            <span className="shader-slider__icon">
              <SliderIcon kind="orbit" />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={rhombusOrbitIntensity}
              onChange={(event) =>
                setRhombusOrbitIntensity(Number(event.target.value))
              }
              title="Órbita hipnótica"
            />
            <output>{Math.round(rhombusOrbitIntensity * 100)}</output>
          </label>
        </section>
      )}

      {circlesActive && (
        <section className="circles-panel" aria-label="Ajustes dos círculos">
          <label
            className="shader-slider shader-slider--color"
            aria-label="Maré cromática circular"
          >
            <span className="shader-slider__icon">
              <SliderIcon kind="color" />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={circleColorChange}
              onChange={(event) =>
                setCircleColorChange(Number(event.target.value))
              }
              title="Maré cromática circular"
            />
            <output>{Math.round(circleColorChange * 100)}</output>
          </label>

          <label
            className="shader-slider shader-slider--neon"
            aria-label="Pulso neon circular"
          >
            <span className="shader-slider__icon">
              <SliderIcon kind="circle-neon" />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={circleBodyChange}
              onChange={(event) =>
                setCircleBodyChange(Number(event.target.value))
              }
              title="Pulso neon circular"
            />
            <output>{Math.round(circleBodyChange * 100)}</output>
          </label>

          <label
            className="shader-slider shader-slider--orbit"
            aria-label="Órbita circular"
          >
            <span className="shader-slider__icon">
              <SliderIcon kind="circle-orbit" />
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={circleOrbitChange}
              onChange={(event) =>
                setCircleOrbitChange(Number(event.target.value))
              }
              title="Órbita circular"
            />
            <output>{Math.round(circleOrbitChange * 100)}</output>
          </label>
        </section>
      )}

      <div className="ui-controls__info">
        <button
          type="button"
          className="ui-controls__brand"
          aria-label="Informações sobre o ShaderVegas"
          aria-expanded={infoOpen}
          aria-controls="project-info"
          onClick={() => setInfoOpen((open) => !open)}
        >
          <InfoIcon />
          <span>ShaderVegas</span>
        </button>

        {infoOpen && (
          <div id="project-info" className="project-info" role="status">
            Código feito para teste de interação entre shader e UI, com controles
            de Three.js. Para informações, código do projeto e shader com
            explicações, acesse o{' '}
            <a
              href="https://github.com/dodocinho/shadervegas"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            .
          </div>
        )}
      </div>
    </header>
  )
}

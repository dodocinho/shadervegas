import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  circlesControlsOpenAtom,
  geometryModeAtom,
  motionEnabledAtom,
  rhombusControlsOpenAtom,
  toggleMotionAtom,
} from '../../state/controls'
import { CirclesIcon, InfoIcon, MotionIcon, RhombusIcon } from './icons'
import { GeometryToggle } from './GeometryToggle'
import { ToggleControl } from './ToggleControl'

export function UIControls() {
  const geometryMode = useAtomValue(geometryModeAtom)
  const motionEnabled = useAtomValue(motionEnabledAtom)
  const toggleMotion = useSetAtom(toggleMotionAtom)
  const [rhombusActive, setRhombusActive] = useAtom(rhombusControlsOpenAtom)
  const [circlesActive, setCirclesActive] = useAtom(circlesControlsOpenAtom)

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
          onToggle={() => setRhombusActive((active) => !active)}
        >
          <RhombusIcon />
        </ToggleControl>

        <ToggleControl
          active={circlesActive}
          label="Controles dos círculos"
          onToggle={() => setCirclesActive((active) => !active)}
        >
          <CirclesIcon />
        </ToggleControl>
      </nav>

      <div className="ui-controls__brand" aria-label="Informações sobre o ShaderVegas">
        <InfoIcon />
        <span>ShaderVegas</span>
      </div>
    </header>
  )
}

import { useAtom } from 'jotai'
import { geometryModeAtom } from '../../state/controls'
import { GeometryIcon } from './icons'

export function GeometryToggle() {
  const [mode, setMode] = useAtom(geometryModeAtom)
  const isSphere = mode === 'sphere'

  return (
    <button
      type="button"
      className="ui-control geom-toggle"
      onClick={() => setMode(isSphere ? 'plane' : 'sphere')}
      aria-label={isSphere ? 'Trocar para plano' : 'Trocar para esfera'}
      title={isSphere ? 'Geometria: esfera' : 'Geometria: plano'}
    >
      <GeometryIcon isSphere={isSphere} />
      <span className="visually-hidden">Geometria</span>
    </button>
  )
}

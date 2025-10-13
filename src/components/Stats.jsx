import Card from "./Card"

export default function Stats ({ words, setPath }) {
  return (
    <div className="mt-4">
      <Card backPath='menu' setPath={setPath}>
        <h3 className="font-semibold mb-2">Estadísticas</h3>
        <div className="text-sm text-slate-700">
          <div>Palabras totales: <strong>{words.length}</strong></div>
          <div>Última sincronización: <strong>{new Date().toLocaleString()}</strong></div>
        </div>
      </Card>
    </div>
  )
}
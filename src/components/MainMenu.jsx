import Center from "./Center";
import MenuItem from "./MenuItem";

export default function MainMenu ({ setPath }) {
  return (
    <Center>
      <section className="grid grid-cols-2 gap-5">
        <MenuItem text="Estadísticas" setPath={setPath} path='stats' />
        <MenuItem text="Palabras" setPath={setPath} path='words' />
        <MenuItem text="Revisión" setPath={setPath} path='review' />
      </section>
    </Center>
  )
}
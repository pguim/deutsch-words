import Center from "./Center";
import IconChartPie from "./Icons/IconChartPie";
import IconClipboardList from "./Icons/IconClipboardList";
import IconSchool from "./Icons/IconSchool";
import MenuItem from "./MenuItem";


export default function MainMenu ({ setPath }) {
  return (
    <Center>
      <section className="grid grid-cols-2 gap-5">
        <MenuItem text="Estadísticas" setPath={setPath} icon={<IconChartPie className="stroke-blue-500 w-12 mt-6" />} path='stats' />
        <MenuItem text="Palabras" setPath={setPath} icon={<IconClipboardList className="stroke-blue-500 w-12 mt-6" />} path='words' />
        <MenuItem text="Revisión" setPath={setPath} icon={<IconSchool className="stroke-blue-500 w-12 mt-6" />} path='review' />
      </section>
    </Center>
  )
}
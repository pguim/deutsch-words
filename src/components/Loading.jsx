import Card from "./Card";
import Center from "./Center";
import IconLoader from "./Icons/IconLoader";

export function Loading () {
  return (
    <Center>
      <Card>
        <div className="flex flex-col w-full">
          <p className="font-semibold mt-2 text-slate-500">Cargando...</p>
          <IconLoader className="w-12 h-12 self-center mt-2" />
        </div>
      </Card>
    </Center>
  )
}
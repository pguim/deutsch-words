import Center from "./Center";

export default function Card ({ children, backPath, setPath }) {
  return (
    <Center>
      <div className="bg-white shadow rounded-lg pb-6 px-6 pt-2 w-auto ">
        {backPath && setPath ?
          (<div className="mb-3">
            <p className="cursor-pointer mb-1 text-2xl text-slate-500 hover:text-blue-500" onClick={() => setPath(backPath)}>{'<'}</p>

          </div>
          ) : ''}

        {children}
      </div>
    </Center>
  )
}
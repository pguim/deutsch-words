import Center from "./Center";

export default function Card ({ children, backPath, setPath, noCenter, inlineChildren, className }) {
  if (noCenter) return (
    <div className={`bg-white shadow rounded-lg w-auto ${inlineChildren ? 'flex flex-row' : 'pb-6 px-6 pt-2'} ${className}`}>
      {backPath && setPath ?
        (<div className="">
          <p className={`cursor-pointer mb-1 text-2xl text-slate-500 hover:text-blue-500  ${inlineChildren ? 'px-2' : ''}`} onClick={() => setPath(backPath)}>{'<'}</p>

        </div>
        ) : ''}

      {children}
    </div>
  )
  return (
    <Center>
      <div className={`bg-white shadow rounded-lg w-auto ${inlineChildren ? 'flex flex-row' : 'pb-6 px-6 pt-2'} ${className}`}>
        {backPath && setPath ?
          (<div className="">
            <p className={`cursor-pointer mb-1 text-2xl text-slate-500 hover:text-blue-500  ${inlineChildren ? 'px-2' : ''}`} onClick={() => setPath(backPath)}>{'<'}</p>

          </div>
          ) : ''}

        {children}
      </div>
    </Center>
  )
}
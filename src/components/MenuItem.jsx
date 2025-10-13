export default function MenuItem ({ text, setPath, path }) {
  return (
    <div className="cursor-pointer bg-white shadow rounded-lg pb-6 px-6 pt-3 w-40 h-40 max-w-3xl  flex items-center justify-center p-4 hover:scale-110" onClick={() => setPath(path)}>
      <p className="text-blue-500 text-xl">{text}</p>
    </div>
  )
}
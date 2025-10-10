

export default function Header (props) {
  return (
    <div className="fixed w-screen bg-blue-100 p-5 px-10 mx-auto">
      <header className="  flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deutsch Words</h1>
        <div className="flex items-center gap-3">
          <div className="text-m text-slate-500">{props.session.user.email.split('@')[0]}</div>
          <button onClick={props.handleSignOut} className="px-3 py-1 bg-red-500 text-white rounded">Sign out</button>
        </div>
      </header>
    </div>
  )
}
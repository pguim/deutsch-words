

export default function Header ({ session, handleSignOut }) {
  return (
    <div className="fixed w-screen bg-blue-500 p-2 mx-auto">
      <header className="  flex items-center justify-between">
        <img className="w-22" src="/logo.png" />
        <h1 className="text-2xl font-bold text-slate-50">Deutsch Words</h1>
        {session && (
          <div className="flex items-center gap-3">
            <div className="text-m text-slate-100">{session.user.email.split('@')[0]}</div>
            <button onClick={handleSignOut} className="px-5 py-1 bg-red-500 text-white rounded cursor-pointer">Salir</button>
          </div>
        )}
      </header>
    </div>
  )
}
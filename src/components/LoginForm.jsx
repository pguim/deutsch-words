import Center from "./Center";
import Card from './Card'

export default function LoginForm (props) {
  return (
    <Center>
      <Card>
        <h1 className="text-2xl font-semibold mb-4">Iniciar sessión</h1>
        <form onSubmit={props.handleSignIn} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Email" autoComplete="username" value={props.email} onChange={e => props.setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded" placeholder="Contraseña" type="password" autoComplete="current-password" value={props.password} onChange={e => props.setPassword(e.target.value)} />
          {props.sessionError ? <h2 className="text-ms font-semibold mb-2 text-red-400">¡Mail o usuario incorrectos! Revise la información y vuelva a intentarlo</h2> : ''}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Acceder</button>
            <button type="button" className="px-4 py-2 bg-slate-200 rounded" onClick={() => { props.setEmail(''); props.setPassword('') }}>Borrar</button>
          </div>
        </form>
      </Card>
    </Center>
  )
}
import { Link } from 'react-router-dom'
import '../styles/header.css'
import { useUser } from '../context/UserContext'
export const Header = () => {
  const {user,logout} = useUser()
  return (
    <div className="header-content">
      <h1>El Bingo Gran Buda</h1>
      <p>Bienvenido {user.username}</p>
      <Link to="/" onClick={()=>{
        logout()
      }}>Cerrar Sesión</Link>
    </div>
  )
}


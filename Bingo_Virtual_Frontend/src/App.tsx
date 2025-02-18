import './App.css'
import  Game  from './Pages/Game'
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Lobby } from './Pages/Lobby'
import { Register } from './Pages/Register'
import {BrowserRouter as Router,Route, Routes} from 'react-router-dom'
import {UserProvider} from './context/UserContext'
import {ProtectedRoute} from './Pages/ProtectedRoute'


function App() {
  return (
    <UserProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route element={<ProtectedRoute/>}>
          <Route path="/home" element={<Home/>} />
          <Route path="/lobby" element={<Lobby/>} />
          <Route path="/game" element={<Game/>} />
        </Route>
        </Routes>
     </Router>
    </UserProvider>
  )
}

export default App

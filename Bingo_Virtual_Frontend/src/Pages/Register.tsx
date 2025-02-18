import {useForm} from 'react-hook-form'
import '../styles/register.css'
import {useUser} from '../context/UserContext.js'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
  const {register, handleSubmit, formState:{errors}} = useForm()
  const { signup, isAuthenticated, errors: registerErrors} = useUser()
  const navigate = useNavigate()
  useEffect(() => {
    if(isAuthenticated){
      navigate('/home')
    }
  }, [isAuthenticated])

  const onSubmit = handleSubmit(async (values) =>{
    signup(values)
  });

  
  return (
    <div className='register-content'>
        <h1>Registro</h1>
        {
        registerErrors.map((error, i) =>(
          <div key={i} className='register-errors'>{error}</div>
        ))
        }
        <form className='register-form' onSubmit={onSubmit}>
            <input className="user" type='text' {...register('name',{required:true, minLength:3})} placeholder="Usuario"/>
            {
              errors.name && (
                <p>Usuario es Requerido o es menor a 3 caracteres</p>
              )
            }
            <input className="email" type='email' {...register("email",{required:true})} placeholder="Correo"/>
            {
              errors.email && (
                <p>Correo es Requerido</p>
              )
            }
            <input className="pass" type='password' {...register("password",{required:true})} placeholder="Contraseña"/>
            {
              errors.password && (
                <p>Contraseña es Requerido</p>
              )
            }
            <button className="buttom" type='submit'>Registrarse</button>
        </form>
        <div className="final">
            <p>¿Ya tienes cuenta?</p>
            <a href='/#/'>Inicia Sesión</a>
        </div>
    </div>
  )
}

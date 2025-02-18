import {useForm} from 'react-hook-form';
import '../styles/login.css';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const Login = () => {

  const {register, handleSubmit, formState: {errors}} = useForm();
  const {login, errors:loginErrors, isAuthenticated} = useUser();
 
  const navigate = useNavigate()
  useEffect(() => {
    if(isAuthenticated){
      navigate('/home')
    }
  }, [isAuthenticated])
 
  const onSubmit = handleSubmit((data) => {
    login(data);
  });
  return (
    <div className='login-content'>
      <div className="login-h1">
      <h1>Iniciar Sesión</h1>
      {
        loginErrors.map((error, i) =>(
          <div key={i} className='login-errors'>{error}</div>
        ))
        }
      </div>
        <div className="login-form">
        <form className='login-form' onSubmit={onSubmit}>
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
            <button className="buttom" type='submit'>Ingresar</button>
        </form>
        </div>
        <div className='final'>
            <p>¿No tienes cuenta?</p>
            <a href='/register'>Regístrate</a>
        </div>
    </div>
  )
}

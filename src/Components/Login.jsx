import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_URL } from '../helper/back'
import Swal from "sweetalert2";
import Loader from '../assets/Loader';
import "./styleLogin.css"

const Login = () => {
    const [loader, setLoader] = useState(false)

    const validationSchema = yup.object().shape({
        email: yup.string().email('Email invalido').max(255).required('Campo Obligatorio'),
        password: yup.string().required('Campo Obligatorio'),

    })

    const {
        getValues,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    async function Login() {
        setLoader(true)
        await fetch(`${API_URL}/User/getUser`, {
            crossdomain: true,
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                Email: getValues('email')
            }),
        }).then(async res => ({
            response: await res.json()
        })).then((data) => {
            if (data.response.esExitoso == true) {
                if (data.response.data.Password == getValues('password') && data.response.data.Role == 1) {
                    setLoader(false)
                    localStorage.setItem('auth', true)
                    Swal.fire({
                        title: "Logeado",
                        text: `Bienvenido ${getValues('email')}.`,
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#0F9D58'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/dashboard'
                        }
                    })
                } else if (data.response.data.Password == getValues('password') && data.response.data.Role == 2) {
                    setLoader(false)
                    Swal.fire({
                        title: "Error",
                        text: `Lo sentimos el usuario ${getValues('email')} no es un administrador.`,
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#0F9D58'
                    })
                } else if (data.response.data.Password != getValues('password')) {
                    setLoader(false)
                    Swal.fire({
                        title: "Error",
                        text: `Contraseña incorrecta`,
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#0F9D58'
                    })
                }
            }
        })
    }
    return (
        <>
            <div id="bg" />
            <center >
                {loader ?
                    <Loader />
                    :
                    <form onSubmit={handleSubmit(() => Login())} style={{ marginTop: '20%' }}>
                        <div className="form-field">
                            <input type="email" placeholder="Email / Username" {...register('email')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.email?.message}</p>
                        <div className="form-field">
                            <input type="password" placeholder="Password" {...register('password')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.password?.message}</p>
                        <div>
                            <button className="btn" type="submit">Log in</button>
                        </div>
                        <p className='etiqueta'>No estas registrado ?<a href='/register'><p className='etiqueta'>Hazlo Aqui</p></a></p>
                    </form>
                }
            </center>
        </>

    )
}

export default Login
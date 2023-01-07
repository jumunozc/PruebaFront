import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Loader from '../assets/Loader';
import { API_URL } from '../helper/back'
import Swal from "sweetalert2";
import "./style.css"
const Register = () => {

    const [loader, setLoader] = useState(false)

    const digitsOnly = (value) => /^\d+$/.test(value)
    const validationSchema = yup.object().shape({

        name: yup.string().required('Campo Obligatorio'),
        surname: yup.string().required('Campo Obligatorio'),
        phone: yup.string().test('Solo digitos', 'Número invalido', digitsOnly),
        email: yup.string().email('Email invalido').max(255).required('Campo Obligatorio'),
        password: yup.string().required('Campo Obligatorio'),
        valepass: yup.string()
            .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
    })

    const {
        getValues,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });

    async function CreateUser() {
        setLoader(true)
        await fetch(`${API_URL}/users`, {
            crossdomain: true,
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                Email: getValues('email'),
                Names: getValues('name'),
                Surnames: getValues('surname'),
                Password: getValues('password'),
                Phone: getValues('phone'),
                Role: 1
            }),
        }).then(response => {
            if (response.status == '201') {
                setLoader(false)
                Swal.fire({
                    title: "Cuenta creada",
                    text: `El usuario ${getValues('email')} a sido creado.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0F9D58'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/'
                    }
                })
            } else if (response.status == '400') {
                setLoader(false)
                Swal.fire({
                    title: "Error",
                    text: `El usuario ${getValues('email')} ya existe.`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0F9D58'
                })
            }
        })

    }

    return (
        <>


            <div id="bg" />
            <center>
                {loader ?
                    <Loader />
                    :
                    <form onSubmit={handleSubmit(() => CreateUser())} style={{ marginTop: '12%' }}>
                        <p className='titulo'>Registro de usuarios</p>
                        <div className="form-field">
                            <input type="text" placeholder="Nombres " {...register('name')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.name?.message}</p>
                        <div className="form-field">
                            <input type="text" placeholder="Apellidos" {...register('surname')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.surname?.message}</p>
                        <div className="form-field">
                            <input type="tel" placeholder="Telefono" {...register('phone')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.phone?.message}</p>
                        <div className="form-field">
                            <input type="email" placeholder="Email / Usuario " {...register('email')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.email?.message}</p>
                        <div className="form-field">
                            <input type="text" placeholder="Contraseña" {...register('password')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.password?.message}</p>
                        <div className="form-field">
                            <input type="password" placeholder="Verificar Contraseña" {...register('valepass')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: '#FFF' }}>{errors.valepass?.message}</p>

                        <div className="form-field">
                            <button className="btn" type="submit">Registrar</button>
                        </div>
                    </form>
                }

            </center>
        </>
    )
}

export default Register
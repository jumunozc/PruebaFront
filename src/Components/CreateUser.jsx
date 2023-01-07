import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_URL } from '../helper/back'
import Loader from '../assets/Loader';
import Swal from "sweetalert2";
import './swal.css'
import "./style.css"
const CreateUser = (props) => {

    const [loader, setLoader] = useState(false)
    function cerrar() {
        props.onClose()
    }
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

    async function Create() {
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
                Phone: getValues('phone')
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
                        window.location.reload()
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
        <Drawer
            variant="persistent"
            open={props.open}
            anchor="right"
            onClose={() => cerrar()}
            sx={{ zIndex: 100 }}
        >
            <Box pt={5} width={{ xs: '100vW', sm: 760 }} mt={{ xs: 2, sm: 1 }}>
                <Stack direction="row" p={2}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#0F9D58' }} flex="1">
                        Creación de usuarios
                    </Typography>
                    <IconButton onClick={() => cerrar()} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Box>
            <center>
                {loader ?
                    <Loader />
                    :
                    <form onSubmit={handleSubmit(() => Create())} style={{ marginTop: '12%' }}>
                        <p style={{ color: 'black' }}>Registro de usuarios</p>
                        <div className="form-field">
                            <input type="text" placeholder="Nombres " {...register('name')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: 'red' }}>{errors.name?.message}</p>
                        <div className="form-field">
                            <input type="text" placeholder="Apellidos" {...register('surname')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: 'red' }}>{errors.surname?.message}</p>
                        <div className="form-field">
                            <input type="tel" placeholder="Telefono" {...register('phone')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: 'red' }}>{errors.phone?.message}</p>
                        <div className="form-field">
                            <input type="email" placeholder="Email / Usuario " {...register('email')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: 'red' }}>{errors.email?.message}</p>
                        <div className="form-field">
                            <input type="text" placeholder="Contraseña" {...register('password')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: 'red' }}>{errors.password?.message}</p>
                        <div className="form-field">
                            <input type="password" placeholder="Verificar Contraseña" {...register('valepass')} />
                        </div>
                        <p style={{ marginLeft: '10px', color: 'red' }}>{errors.valepass?.message}</p>

                        <div className="form-field">
                            <button className="btn" type="submit">Crear</button>
                        </div>
                    </form>
                }
            </center>
        </Drawer>
    )
}

export default CreateUser
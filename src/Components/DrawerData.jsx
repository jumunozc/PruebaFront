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

const DrawerData = (props) => {

    const [loader, setLoader] = useState(false)
    function cerrar() {
        props.onClose()
    }
    let data = props.records
    async function modificar() {
        setLoader(true)
        await fetch(`${API_URL}/User/updateUser`, {
            crossdomain: true,
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({
                "email": data.Email,
                "name": getValues('names') == '' ? data.Names : getValues('names'),
                "surname": getValues('surnames') == '' ? data.Surnames : getValues('surnames'),
                "phone": getValues('phone') == '' ? data.Phone : getValues('phone')
            }),
        }).then(async res => ({
            response: await res.json()
        })).then((data) => {
            if (data.response.esExitoso == true) {
                setLoader(false)
                localStorage.setItem('auth', true)
                Swal.fire({
                    title: "Usuario Actualizado",
                    text: `El usuario a sido actualizado.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0F9D58'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload()
                    }
                })

            }
        })

    }

    const validationSchema = yup.object().shape({

    })

    const {
        getValues,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(validationSchema) });
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
                        Modificacion de usuarios
                    </Typography>
                    <IconButton onClick={() => cerrar()} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>

            </Box>
            {data != null ?
                <center>
                    {loader ?
                        <Loader />
                        :
                        <form style={{ marginTop: '20%' }} onSubmit={handleSubmit(() => modificar())}>

                            <input type="email" defaultValue={data.Email} disabled />
                            <input type="text" style={{ border: '1px solid', margin: '5px 0px' }} defaultValue={data.Names} {...register('names')} />
                            <input type="text" style={{ border: '1px solid', margin: '5px 0px' }} defaultValue={data.Surnames} {...register('surnames')} />
                            <input type="tel" style={{ border: '1px solid', margin: '5px 0px' }} defaultValue={data.Phone} {...register('phone')} />

                            <button className="btn" type="submit">Modificar</button>

                        </form>
                    }
                </center>
                :
                null}



        </Drawer>
    )
}

export default DrawerData
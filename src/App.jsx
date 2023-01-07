import React, { useEffect, useState } from 'react'
import { API_URL } from './helper/back'
import Swal from "sweetalert2";
import Loader from './assets/Loader';
import './index.css'
import DrawerData from './Components/DrawerData';
import { Box, Card, Typography } from '@mui/material';
import CreateUser from './Components/CreateUser';
const App = () => {

  let auth = localStorage.getItem('auth')
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(false)
  const [openAds, setOpenAds] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [email, setEmail] = useState('')
  async function getUsers() {
    await fetch(`${API_URL}/User/getnonAdmins`, {
      crossdomain: true,
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      method: 'GET',

    }).then(async res => ({
      response: await res.json()
    })).then((data) => {
      setData(data.response.data)
    })
  }

  useEffect(() => {

    if (auth == false || auth == null || auth == undefined) {
      window.location.href = '/'
    }
    getUsers()
  }, [])

  function SearchEmail() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  async function loadData(email) {

    await fetch(`${API_URL}/User/getUser`, {
      crossdomain: true,
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        Email: email
      }),
    }).then(async res => ({
      response: await res.json()
    })).then((data) => {
      setEmail(data.response.data)
    }).then(async () => {
      await setOpenAds(true)
    })

  }

  function Modificar(email) {
    return (
      <div className="tooltip">
        <span className="tooltiptext">Modificar Usuario</span>
        <button className="modify" onClick={() => loadData(email.email)}><i className="fa fa-cogs" aria-hidden="true"></i></button>
      </div>
    )
  }
  function Eliminar(email) {
    return (
      <div className="tooltip">
        <span className="tooltiptext">Eliminar Usuario</span>
        <button className="modify" onClick={() => deleteUser(email)}><i className="fa fa-times" aria-hidden="true"></i></button>
      </div>
    )
  }


  async function deleteUser(email) {
    Swal.fire({
      title: "Precaución",
      text: `Estas apunto de eliminar un usuario.Estas seguro ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Rechazar',
      cancelButtonColor: 'red',
      confirmButtonColor: '#0F9D58'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoader(true)
        await fetch(`${API_URL}/User/delUser`, {
          crossdomain: true,
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          method: 'POST',
          body: JSON.stringify({
            Email: email.email
          }),
        }).then(async res => ({
          response: await res.json()
        })).then((data) => {
          if (data.response.esExitoso == true) {
            setLoader(false)
            Swal.fire({
              title: "Eliminado",
              text: `El usuario ${email.email} a sido eliminado.`,
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0F9D58'
            }).then(async (result) => {
              if (result.isConfirmed) {
                window.location.reload()
              }
            })
          }
        })
      }
    })

  }

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  function logout() {
    localStorage.clear()
    window.location.href = '/'
  }
  return (
    <>

      {loader ?
        <Loader /> :
        <div >
          <div id="mySidenav" className="sidenav">
            <a href="javascript:void(0)" className="closebtn" onClick={() => closeNav()}>&times;</a>
            <a onClick={() => logout()}>Logout</a>
          </div>
          <div id="main">
            <Card>
              <header >
                <h1 style={{ color: '#FFF' }}>Gestion de usuarios</h1>
                <div style={{ float: 'left' }}>
                  <button className="modify" onClick={() => openNav()}><i className="fa fa-bars" aria-hidden="true"></i></button>
                </div>
              </header>
            </Card>
            <Card>
              <div className='bodyTabla'>
                <button className="button-37" type="button" onClick={() => setOpenCreate(true)}>Crear Usuario</button>
                <input type="text" id="myInput" onKeyUp={() => SearchEmail()} placeholder="Busqueda por Email"></input>
                <table cellPadding="5" cellSpacing="5" className="styled-table" id="myTable">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, key) => (
                      <tr key={key} className="active-row">

                        <td data-title="Email">
                          {item.Email}
                        </td>
                        <td data-title="Names">
                          {item.Names}
                        </td>
                        <td data-title="Surnames">
                          {item.Surnames}
                        </td>
                        <td data-title="Role">
                          {item.Role == 2 ? "Usuario" : null}
                        </td>
                        <td >
                          <Modificar email={item.Email} />
                          <Eliminar email={item.Email} />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </Card>
            <DrawerData open={openAds} onClose={() => setOpenAds(false)} records={email} />
            <CreateUser open={openCreate} onClose={() => setOpenCreate(false)} />
          </div>
          <Box
            component="nav"
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              mb: 3,
              backgroundColor: '#0F9D58',
              height: '50px'
            }}
          >

            <Typography variant="caption" sx={{ color: '#FFF', margin: 'auto' }}>
              <a >
                © 2023  Powered by Julian Muñoz.
              </a>
            </Typography>

          </Box>
        </div>
      }
    </>
  )
}

export default App
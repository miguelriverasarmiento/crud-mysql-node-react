import { useState } from 'react';
import Axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2'

function App() {

  const [nombre, setNombre] = useState("")
  const [edad, setEdad] = useState()
  const [pais, setPais] = useState("")
  const [cargo, setCargo] = useState("")
  const [años, setAños] = useState()
  const [id, setId] = useState()

  const [editar, setEditar] = useState(false)

  const [empleados, setEmpleados] = useState([]);

  const addEmplo = () => {
    Axios.post('http://localhost:3001/create', {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmployees();
      cancelar();
      Swal.fire({
        title: '<strong>Registro exitoso!</strong>',
        html: '<i>El empleado <strong>' + nombre + '</strong> fue registrado con exito!</i>',
        icon: 'success',
        timer: 3000
      })
    }).catch(function(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: JSON.parse(JSON.stringify(error)).message==='Network Error'? 'Intente mas tarde' : JSON.parse(JSON.stringify(error))
      });
    })
  }

  const updateEmplo = () => {
    Axios.put('http://localhost:3001/update', {
      id:id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años
    }).then(() => {
      getEmployees();
      cancelar();
      Swal.fire({
        title: '<strong>Actualizacion exitosa!</strong>',
        html: '<i>El empleado <strong>' + nombre + '</strong> fue actualizado con exito!</i>',
        icon: 'success',
        timer: 3000
      }).catch(function(error){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: JSON.parse(JSON.stringify(error)).message==='Network Error'? 'Intente mas tarde' : JSON.parse(JSON.stringify(error))
        });
      })
    });
  }

  const deleteEmplo = (val) => {

    Swal.fire({
      title: "Confirmar eliminado?",
      html: '<i>Realmente desea eliminar a <strong>' + val.nombre + '</strong></i>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmployees();
          cancelar();
          Swal.fire({
            icon: "success",
            title: val.nombre + " fue eliminado",
            showConfirmButton: false,
            timer: 2000
          })
        }).catch(function(error){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logro eliminar el empleado!",
            footer: JSON.parse(JSON.stringify(error)).message==='Network Error'? 'Intente mas tarde' : JSON.parse(JSON.stringify(error))
          });
        })
      }
    });
  }


  const cancelar = () => {
      setAños('');
      setNombre('');
      setPais('');
      setCargo('');
      setEdad('');
      setId('');
      setEditar(false)
  }

  const editEmplo = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
    setId(val.id);
  }

  const getEmployees = () => {
    Axios.get('http://localhost:3001/employees').then((res) => {
      setEmpleados(res.data);
      });
    }
    getEmployees();

  return (
    <div className="container">
      <div className="card text-center">
        <div className="card-header">
          GESTION DE EMPLEADOS
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input type="text" onChange={(event)=>{setNombre(event.target.value)}} className="form-control" value={nombre} placeholder="Ingrese un nombre" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input type="number" onChange={(event)=>{setEdad(event.target.value)}} className="form-control" value={edad} placeholder="Ingrese una edad" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Pais:</span>
            <input type="text" onChange={(event)=>{setPais(event.target.value)}} className="form-control" value={pais} placeholder="Ingrese el pais" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input type="text" onChange={(event)=>{setCargo(event.target.value)}} className="form-control" value={cargo} placeholder="Ingrese el cargo" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años de experiencia:</span>
            <input type="number" onChange={(event)=>{setAños(event.target.value)}} className="form-control" value={años} placeholder="Ingrese los años" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

        </div>
        <div className="card-footer text-muted">
          {
            editar? 
            <div>
              <button className='btn btn-warning m-2' onClick={updateEmplo}>Actualizar</button>
              <button className='btn btn-info m-2' onClick={cancelar}>Cancelar</button>
            </div>
            : <button className='btn btn-success' onClick={addEmplo}>Registrar</button>
          }
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            empleados.map((val, key) => {
              return <tr key={val.id}>
                      <th>{val.id}</th>
                      <td>{val.nombre}</td>
                      <td>{val.edad}</td>
                      <td>{val.pais}</td>
                      <td>{val.cargo}</td>
                      <td>{val.años}</td>
                      <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                          <button type="button" onClick={() => editEmplo(val)} className="btn btn-info">Editar</button>
                          <button type="button" onClick={() => deleteEmplo(val)} className="btn btn-danger">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                 })
              }
            </tbody>   
          </table>
      </div>
  );
}

export default App;

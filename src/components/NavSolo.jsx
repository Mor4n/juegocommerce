/* eslint-disable react/prop-types */
import { useEffect,useState } from "react";
import "./NavSolo.css"
import { useNavigate } from "react-router-dom"


function NavSolo() {

  const navigate = useNavigate();

 

  
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">
    <img src="\src\assets\Logo1.png" alt="Logo de JuegoCommerce" width="120" height="27"></img>
    </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Inicio</a>
        </li>
    </ul>
  


      </div>

     

  </div>
</nav>
    

    
  )
}

export default NavSolo

import React from 'react'
import './loader.css'
const Loader = () => {
    return (

        <center style={{paddingTop:'25%', width:'100%'}}>
            <div className="lds-hourglass">
                <div style={{ fontWeight: 'bold', color: 'red', width:'100%' }}>Espere un momento por favor...</div>
            </div>
        </center>

    )
}

export default Loader

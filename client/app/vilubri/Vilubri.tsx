import React, { useState } from 'react';

export const showConfirmWindow = () => {

    const result = prompt("Confirmar ação?");

    if(result == null) return false;
 
    return true;
}

function Vilubri() {

    return (
        <>
            <div className="container mt-4">
                <div className='mb-3'>
                    <a href="/vilubri/chamadas">Chamadas</a>
                </div>
                <div className='mb-3'>
                    <a href="/vilubri/compareTable">Comparar tabela</a>
                </div>
            </div>
        </>
    );
}

export default Vilubri;
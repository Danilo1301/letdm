import React, { useState } from 'react';
import { ChamadaJSON_HomeList } from '../../../../src/vilubri/requestTypes';

function ChamadaItem({chamada}: { chamada: ChamadaJSON_HomeList }) {
    const url = `/vilubri/chamadas/${chamada.id}`;

    const date = new Date(chamada.date);
    const dateStr = date.toLocaleDateString("pt-BR");

    return (
        <div className="container">
            <div className="row">
                <div className="col-auto">
                    {dateStr}
                </div>
                <div className="col-auto">
                <a href={url}>Chamada {chamada.id}</a>
                </div>
                {!chamada.completed ?
                <>
                    <div className="col-auto">
                        <span className="badge text-bg-warning">Incompleto</span>
                    </div>
                </> : <></>}
                
            </div>
        </div>
    )
}


function Chamadas() {

    const [chamadas, setChamadas] = React.useState<ChamadaJSON_HomeList[]>([]);

    React.useEffect(() => {
        fetch("/api/vilubri/chamadas")
        .then(response => response.json())
        .then(data => {
            console.log(data)

            setChamadas(data);
        })
    }, [])

    return (
        <div className='container'>
            <a href="/">Voltar</a>

            <div>{chamadas.length} chamadas</div>

            <a className='btn btn-primary mt-4 mb-4' href="/vilubri/chamadas/new">Criar chamada</a>

            { chamadas.sort((a, b) => b.date - a.date).map(chamada => <ChamadaItem key={chamada.id} chamada={chamada}></ChamadaItem>) }
        </div>
    );
}

export default Chamadas;
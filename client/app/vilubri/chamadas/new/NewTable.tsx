import React from 'react';
import { getLetDM_Key } from '../../../../components/cookies';

function NewTable() {
    
    const [id, setID] = React.useState("");

    const handleSubmit = () => {

        console.log("submit");

        const key = getLetDM_Key();

        const body: any = {
            id: id,
            key: key
        }

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };
        
        fetch('/api/vilubri/chamadas/newTable', requestOptions)
        .then(response => {
            response.json().then(data => {
                if(response.ok)
                {
                    console.log(data);
    
                    window.location.href = "/vilubri/chamadas"
                    return;
                }
                alert(data.error);
            })
        })
    }

    return (
        <div className='container'>
            <a href="/vilubri/chamadas">Voltar</a>

            <div className=''>
                <span>ID:</span>
                <input type="text" className="form-control" placeholder="ID da chamada" onChange={e => setID(e.target.value)} value={id}></input>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Criar</button>
        </div>
        
    );
}

export default NewTable;
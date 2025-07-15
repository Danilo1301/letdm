import React, { useContext, useState } from 'react';
import axios from 'axios';
import { getLetDM_Key } from '../../components/cookies';
import { useUser } from '../components/User';

function Data() {

    const { user } = useUser();

    const isAdmin = user?.isAdmin == true;
    
    const [file, setFile] = React.useState<any>()

    const key = getLetDM_Key();

    function handleChange(event: any) {
        setFile(event.target.files[0])

        console.log(file);
    }

    function handleSubmit(event: any) {
        event.preventDefault()
        const url = '/api/data/upload';
        const formData = new FormData();
        
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('key', key);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };

        axios.post(url, formData, config).then((response) => {
            console.log(response);
            alert(JSON.stringify(response.data))
        }).catch((err) => {
            console.log(err);
            alert(JSON.stringify(err.response.data))
        });
    }

    if(!isAdmin)
    {
        return <>Você precisa ser um admin do site</>
    }

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/">Back</a>
                </div>

                <h1>Data</h1>

                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <br></br>
                    <button type="submit">Upload .data</button>
                </form>

                <br></br>
                <br></br>

                <form action="/api/data/download" method="get">
                    <input type="hidden" name="key" value={key} /> 
                    <button type="submit">Download .data as .zip</button>
                </form>

            </div>
        </>
    );
}

export default Data;
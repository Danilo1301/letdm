import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

let requestedNote = false;

const getServerUrl = () => {
    if(window.location.href.includes("localhost")) return `http://localhost:3000`
    return ""
}

const getNote = (id: string) => {
    return new Promise<string>((resolve, reject) => {
        fetch(getServerUrl() + "/api/note/" + id, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            resolve(data.content)
        })
        .catch((err) => {
            reject("")
        })
    })
}

const NotePage: React.FC = () => {
    const params = useParams()
    const id = params.id

    const [note, setNote] = useState<string>("");

    if(!id) return <>Invalid ID</>;

    if(!requestedNote)
    {
        requestedNote = true;

        getNote(id).then(note => {
            setNote(note)
        })
    }

    return (
        <>
            <h2>Note ID: {id}</h2>
            <div>
                {note.split("\n").map((line, k) => <div key={k}>| {line}</div>)}
            </div>
        </>
    );
};


export default NotePage;
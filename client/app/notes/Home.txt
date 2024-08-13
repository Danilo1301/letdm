import React, { useState } from 'react';

let requestedNotes = false;

const getServerUrl = () => {
    if(window.location.href.includes("localhost")) return `http://localhost:3000`
    return ""
}

const getNotes = () => {
    return new Promise<string[]>((resolve, reject) => {
        fetch(getServerUrl() + "/api/notes", {method: 'GET'})
        .then(response => response.json())
        .then((notes: string[]) => {
            resolve(notes)
        })
        .catch((err) => {
            reject([])
        })
    })
}

const Home: React.FC = () => {
    const [notes, setNotes] = useState<string[]>([]);
    
    if(!requestedNotes)
    {
        requestedNotes = true;

        getNotes().then(notes => {
            setNotes(notes)
        })
    }

    return (
        <>
            <div>
                Notes:
            </div>

            { notes.map((note) =>
                <div key={note}>
                    <a href={"/notes/" + note}>{note}</a>
                </div>
            )}
        </>
    );
};

export default Home;
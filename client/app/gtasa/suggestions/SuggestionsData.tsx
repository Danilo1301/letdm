import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { defaultSuggestionInfo, EditSuggestionModel, SuggestionInfo, SuggestionInfoContext } from './editSuggestion/EditSuggestionModel';
import { useParams } from 'react-router-dom';
import { UserInfoContext } from '../../components/UserInfo';
import { NewSugestion_PostBody } from '../../../../src/interfaces';
import { Suggestion } from '../../../../src/suggestions/suggestion';
import { getLetDM_Key } from '../../../components/cookies';

const SuggestionsData: React.FC = () => {

    const [file, setFile] = React.useState<any>()

    function handleChange(event: any) {
        setFile(event.target.files[0])

        console.log(file);
    }
    
    function handleSubmit(event: any) {
        event.preventDefault()
        const url = '/api/uploadSuggestionsDataFile';
        const formData = new FormData();

        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('key', getLetDM_Key());

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

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/suggestions">Back</a>
                </div>

                <h1>Data</h1>

                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleChange} />
                    <button type="submit">Upload</button>
                </form>
                <form action="/api/downloadSuggestionsDataFile" method="get">
                    <button type="submit">Download Single File</button>
                </form>
            </div>
        </>
    );
}

export default SuggestionsData;
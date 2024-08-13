import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSuggestionInfo, EditSuggestionModel, SuggestionInfo, SuggestionInfoContext } from './editSuggestion/EditSuggestionModel';
import { useParams } from 'react-router-dom';
import { UserInfoContext } from '../../components/UserInfo';
import { Key_PostBody, NewSugestion_PostBody } from '../../../../src/interfaces';
import { Suggestion } from '../../../../src/suggestions/suggestion';
import { getLetDM_Key } from '../../../components/cookies';

const EditSuggestion: React.FC = () => {

    const params = useParams();
    const id = params.id!;
    
    const [suggestionInfo, setSuggestionInfo] = useState<SuggestionInfo>(defaultSuggestionInfo);
    
    const updateSuggestionInfo = (info: Partial<SuggestionInfo>) => {
        setSuggestionInfo((prevInfo) => {
            return { ...prevInfo, ...info };
        });
    };

    const { userInfo } = useContext(UserInfoContext);
    
    const editSuggestion = () => {
        console.log("edit")
    
        const body: NewSugestion_PostBody = {
            suggestion: {
                title: suggestionInfo.title,
                username: suggestionInfo.username,
                content: suggestionInfo.content,
                tags: suggestionInfo.tags,
                priorityTags: suggestionInfo.priorityTags
            },
            sub: userInfo.sub,
            key: getLetDM_Key()
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
    
        const url = `/api/suggestions/${id}/edit`;

        console.log(url, requestOptions)

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if(data.error)
            {
                alert(data.error);
                return;
            }

            window.location.href = "/suggestions";
        });
    };

    const deleteSuggestion = () => {
        console.log("delete")

        const promptResult = prompt("Delete?")
        
        if(promptResult == null) return;

        const body: Key_PostBody = {
            key: getLetDM_Key()
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
    
        fetch(`/api/suggestions/${id}/delete`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if(data.error)
            {
                alert(data.error);
                return;
            }

            window.location.href = "/suggestions";
        });
    }

    useEffect(() => {
        fetch("/api/suggestions/" + id, {method: 'GET'})
            .then(response => response.json())
            .then((suggestion: Suggestion) => {
                console.log("suggestion", suggestion);

                updateSuggestionInfo({
                    title: suggestion.title,
                    username: suggestion.username,
                    tags: suggestion.tags,
                    priorityTags: suggestion.priorityTags,
                    content: suggestion.content
                });
            })
            .catch((err) => {
            
            });
    }, []);

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/suggestions">Back</a>
                </div>

                <h1>Edit suggestion</h1>

                <SuggestionInfoContext.Provider value={{
                    suggestionInfo,
                    setSuggestionInfo(info) { updateSuggestionInfo(info) }
                }}>
                    <EditSuggestionModel onSave={editSuggestion} onDelete={deleteSuggestion}></EditSuggestionModel>
                </SuggestionInfoContext.Provider>
            </div>
        </>
    );
}

export default EditSuggestion;
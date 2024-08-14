import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSuggestionInfo, EditSuggestionModel, SuggestionInfo, SuggestionInfoContext } from './editSuggestion/EditSuggestionModel';
import { NewSugestion_PostBody } from '../../../../src/interfaces';
import { UserInfoContext } from '../../components/UserInfo';
import { getLetDM_Key } from '../../../components/cookies';

const NewSuggestion: React.FC = () => {

    const [suggestionInfo, setSuggestionInfo] = useState<SuggestionInfo>(defaultSuggestionInfo);

    const { userInfo } = useContext(UserInfoContext);

    const updateSuggestionInfo = (info: Partial<SuggestionInfo>) => {
        setSuggestionInfo((prevInfo) => {
            return { ...prevInfo, ...info };
        });
    };

    const sendSuggestion = () => {
        console.log("send")
    
        console.log(userInfo)

        const body: NewSugestion_PostBody = {
            suggestion: {
                id: suggestionInfo.id,
                title: suggestionInfo.title,
                username: suggestionInfo.username,
                content: suggestionInfo.content,
                tags: suggestionInfo.tags,
                priorityTags: suggestionInfo.priorityTags,
                dateAdded: suggestionInfo.dateAdded
            },
            sub: userInfo.sub,
            key: getLetDM_Key()
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
    
        console.log('/api/suggestions/new', requestOptions)

        fetch('/api/suggestions/new', requestOptions)
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

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/suggestions">Back</a>
                </div>

                <h1>New suggestion</h1>

                <SuggestionInfoContext.Provider value={{
                    suggestionInfo,
                    setSuggestionInfo(info) { updateSuggestionInfo(info) }
                }}>
                    <EditSuggestionModel onSave={sendSuggestion}></EditSuggestionModel>
                </SuggestionInfoContext.Provider>
            </div>
        </>
    );
}

export default NewSuggestion;
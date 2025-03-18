import React, { useState } from 'react';
import { ListItemGroup } from '../components/list/ListItemGroup';
import { ListItem } from '../components/list/ListItem';
import { getCookie, setCookie } from '../../components/cookies';

function Key() {

    const possibleKeyIds: string[] = ["letdm-key"];
    const keyId = possibleKeyIds[0];

    const [key, setKey] = useState("");
    const [currentKey, setCurrentKey] = useState(getCookie(keyId) || "");
    
    const updateKeyValue = () => {
        setCookie(keyId, key, 100);
    };

    return (
        <>
            <div className="container mt-4">
                
                <div className="back">
                    <a href="/">Back</a>
                </div>

                <ListItemGroup title="Keys">
                    <ListItem title={keyId} description="">
                        <input type="password" className="form-control" placeholder="Content" onChange={e => { setKey(e.target.value) }} value={key}></input>
                        <button onClick={updateKeyValue}>Set key</button>
                        <span>Key: {currentKey.length == 0 ? "NOT SET" : `${currentKey.slice(0, 4)}********`}</span>
                    </ListItem>
                </ListItemGroup>
            </div>
        </>
    );
}

export default Key;
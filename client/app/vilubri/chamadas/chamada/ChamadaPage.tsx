import React, { useState, createContext, useContext } from 'react';
import { ChamadaJSON, ChamadaPageJSON, ChamadaType } from '../../../../../src/vilubri/Chamada';
import { useParams } from 'react-router-dom';
import ChamadaTable from './ChamadaTable';
import { getLetDM_Key } from '../../../../components/cookies';
import ChamadaDefault from './ChamadaDefault';
import { defaultTheme, ThemeContext } from './ColorSettings';
import { Theme, ThemeJSON } from '../../../../../src/vilubri/Theme';
import { showConfirmWindow } from '../../Vilubri';

const getChamada = async (id: string) => {
    return new Promise<ChamadaPageJSON>((resolve, reject) =>
    {
        fetch("/api/vilubri/chamadas/" + id, {method: 'GET'})
        .then(response => response.json())
        .then((chamada: ChamadaPageJSON) => {
            resolve(chamada)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

function ChamadaPage()
{
    const params = useParams();
    const id = params.id!;
    
    const [chamada, setChamada] = useState<ChamadaJSON>();

    const [theme, setTheme] = useState<ThemeJSON>(defaultTheme);
        
    const updateTheme = (newTheme: Partial<ThemeJSON>) => {
        setTheme((prevTheme) => {
            return { ...prevTheme, ...newTheme };
        });
    };

    React.useEffect(() => {
        getChamada(id).then(data => {
            console.log(data);

            setChamada(data.chamada);
            setTheme(data.theme);
        })
    }, [id])

    if(!chamada) return <></>;

    return (
        <>
            <ThemeContext.Provider value={{ theme, setTheme(newTheme) {
                console.log("setting theme");
                updateTheme(newTheme);
            }}}>

            {chamada.type === ChamadaType.CHAMADA_DEFAULT ? (
                <ChamadaDefault chamada={chamada} />
            ) : chamada.type === ChamadaType.CHAMADA_TABLE ? (
                <ChamadaTable chamada={chamada} />
            ) : (
                <div>Tipo desconhecido</div>
            )}

            </ThemeContext.Provider>
        </>
    );
}

export const toggleCompleteStatus = (id: string) => {
    const key = getLetDM_Key();

    const body: any = {
        key: key
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    console.log('requestOptions:', requestOptions)

    fetch('/api/vilubri/chamadas/' + id + '/toggleCompleteStatus', requestOptions)
    .then(response => {
        response.json().then(data => {
            if(response.ok)
            {
                console.log(data);

                window.location.reload();
                return;
            }
            alert(data.error)
        })
    });
}

export const changeTheme = (id: string) => {
    
    var themeId = prompt("Insira o ID do tema:");

    if(typeof themeId != "string") return;

    fetch('/api/vilubri/themes')
    .then(response => {
        response.json().then(data => {

            console.log(data);

            if(response.ok)
            {
                const themes: Theme[] = data;

                let newTheme: Theme | undefined;

                for(const theme of themes)
                {
                    if(theme.id != themeId) continue;

                    newTheme = theme;
                    break;
                }

                if(newTheme == undefined)
                {
                    alert("Tema inválido!");
                    return;
                }

                sendChangeThemeRequest(id, newTheme.id);

                return;
            }
            alert(data.error);
        })
    });
}

export const sendChangeThemeRequest = (id: string, themeId: string) => {

    if(!showConfirmWindow()) return

    const key = getLetDM_Key();

    const body: any = {
        key: key,
        themeId: themeId
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    console.log('requestOptions:', requestOptions)

    fetch('/api/vilubri/chamadas/' + id + '/changeTheme', requestOptions)
    .then(response => {
        response.json().then(data => {
            if(response.ok)
            {
                console.log(data);

                window.location.reload();
                return;
            }
            alert(data.error)
        })
    });
}

export const changeDate = (id: string) => {
    if(!showConfirmWindow()) return

    const key = getLetDM_Key();

    const body: any = {
        key: key
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    console.log('requestOptions:', requestOptions)

    fetch('/api/vilubri/chamadas/' + id + '/changeDate', requestOptions)
    .then(response => {
        response.json().then(data => {
            if(response.ok)
            {
                window.location.reload();
                return;
            }
            alert(data.error);
        })
    });
}

export const deleteChamada = (id: string) => {
        
    if(!showConfirmWindow()) return;

    const key = getLetDM_Key();

    const body: any = {
        key: key
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    console.log('/delete', requestOptions)

    fetch('/api/vilubri/chamadas/' + id + "/delete", requestOptions)
    .then(response => {
        response.json().then(data => {
            if(response.ok)
            {
                console.log(data);

                window.location.href = "/vilubri/chamadas"
                return;
            }
            alert(data.error)
        })
    })
}

export const setChamadaCustomDate = (id: string) => {
    const date = prompt("Insira a data (formato 18/06/25 16:10)");

    if(date == null) return;

    console.log(date)

    const key = getLetDM_Key();

    const body: any = {
        key: key,
        date: date
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    console.log('/delete', requestOptions)

    fetch('/api/vilubri/chamadas/' + id + "/setDate", requestOptions)
    .then(response => {
        response.json().then(data => {
            if(response.ok)
            {
                location.reload();
                return;
            }
            alert(data.error)
        })
    })
}

export default ChamadaPage;
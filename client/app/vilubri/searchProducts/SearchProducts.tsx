import React, { useEffect, useState } from 'react';
import { ProductJSON_Search } from '../../../../src/vilubri/requestTypes';
import { ChamadaJSON } from '../../../../src/vilubri/Chamada';

function ChamadaItem({data}: { data: ChamadaJSON })
{
    const url = `/vilubri/chamadas/${data.id}`;

    return (
        <div>
            <a href={url}>Chamada {data.id}</a>
        </div>
    );
}

function ChamadasList({chamadas}: { chamadas: ChamadaJSON[] | undefined }) {

    if(!chamadas)
    {
        return (
            <div>
                No chamadas to show
            </div>
        );
    }

    return (
        <div>
            {chamadas.sort((a, b) => b.createdDate - a.createdDate).map((product, index) => <ChamadaItem key={index} data={product}></ChamadaItem>)}
        </div>
    );
}

function SearchProductsSection2() {
    const [chamadas, setChamadas] = React.useState<ChamadaJSON[]>();

    const [name, setName] = React.useState("");

    const onSubmit = (event: any) => {
        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        
        fetch(url, fetchOptions)
        .then(response => {
            response.json().then((data) => {
                if(response.ok)
                {
                    console.log(data);

                    setChamadas(data);
    
                    //window.location.href = `/chamadas/${id}`;
                    return;
                }
                alert(data.error)
            })
        });

        event.preventDefault();
    };

    return (
        <div className='mt-4'>
            <h1>Procurar produtos por nome / código</h1>

            <form action={'/api/vilubri/searchProductsByCode'} onSubmit={onSubmit} method="post" encType="multipart/form-data">
                <div className=''>
                    <span>Nome / Código:</span>
                    <input type="text" name="name" className="form-control" placeholder="" onChange={e => setName(e.target.value)} value={name}></input>
                </div>

                <input type="submit" value="Procurar" />
            </form>

            <ChamadasList chamadas={chamadas}></ChamadasList>
        </div>
    );
}

function SearchProducts() {
   
    return (
        <div className='container'>
            <a href="/vilubri/">Voltar</a>
            
            <SearchProductsSection2></SearchProductsSection2>
        </div>
    );
}

export default SearchProducts;
import React, { useContext, useState } from 'react';
import { UserInfoContext } from '../../components/UserInfo';
import { Product, ProductJSON_Changed } from '../../../../src/vilubri/Product';
import { ChamadaJSON, ChamadaPageJSON } from '../../../../src/vilubri/Chamada';

interface ChangedDetails
{
    chamadaData: ChamadaPageJSON
    products: ProductJSON_Changed[]
}

function CompareTable()
{
    const { userInfo } = useContext(UserInfoContext);

    const [descriptionId, setDescriptionId] = useState("A");
    const [codeId, setCodeId] = useState("B");
    const [priceId, setPriceId] = useState("F");
    const [minPrice, setMinPrice] = useState("1.99");

    const [products, setProducts] = useState<ProductJSON_Changed[]>([]);

    const [changes, setChanges] = useState<ChangedDetails[]>([]);

    const handleSubmit = (event: any) => {
        const button = document.getElementById("submit-table-button") as HTMLButtonElement;
        //button.disabled = true;

        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        //formData.append("key", requ());

        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        
        fetch(url, fetchOptions)
        .then(response => {
            response.json().then((data) => {
                if(response.ok)
                {
                    setProducts(data);
                    processChangedProducts(data);
                    return;
                }
                alert(data.error);

                button.disabled = false;
            })
        });

        event.preventDefault();
    }

    const processChangedProducts = (products: ProductJSON_Changed[]) =>{

        const results: ChangedDetails[] = [];

        const changedChamadas: string[] = [];

        for(const product of products)
        {
            if(product.chamadaData == undefined) continue;

            if(!changedChamadas.includes(product.chamadaData.chamada.id))
            {
                changedChamadas.push(product.chamadaData.chamada.id);

                results.push({
                    chamadaData: product.chamadaData,
                    products: []
                });
            }

            if(product.changedPrice)
            {
                for(const result of results)
                {
                    if(result.chamadaData.chamada.id != product.chamadaData.chamada.id) continue;

                    result.products.push(product);

                    break;
                }

            }
        }

        console.log(results);

        setChanges(results);
    }

    if(!userInfo.isAdmin) return <>Você precisa ser um admin do site</>;

    return (
        <>
            <a href="/">Voltar</a>

            <form action="/api/vilubri/uploadTable" method="post" onSubmit={handleSubmit} className='mb-3'>
                <span>Selecione a tabela de preços (.xlsx):</span>
                <br></br>
                <input type="file" name="file" />
                <br></br>
                <div>
                    <span>Descrição:</span>
                    <input type="text" name="description-id" value={descriptionId} onChange={(event) => { setDescriptionId(event.target.value); }}></input>
                </div>
                <div>
                    <span>Código:</span>
                    <input type="text" name="code-id" value={codeId} onChange={(event) => { setCodeId(event.target.value); }}></input>
                </div>
                <div>
                    <span>Preço:</span>
                    <input type="text" name="price-id" value={priceId} onChange={(event) => { setPriceId(event.target.value); }}></input>
                </div>
                <div>
                    <span>Preço mínimo de alteração:</span>
                    <input type="number" name="min-price-change" value={minPrice} onChange={(event) => { setMinPrice(event.target.value); }}></input>
                </div>
                <br></br>
                <button id="submit-table-button" type="submit">Enviar</button>
            </form>

            <DisplayChangedChamadas changes={changes}></DisplayChangedChamadas>
        </>
    );
}

function ChangedProduct({product}: { product: ProductJSON_Changed })
{
    const diff = Math.abs(product.product.price - product.newPrice);

    return (
        <>
            <div>
                <span>{product.product.code} - {product.product.name}</span>
                <span style={{marginLeft: "5px", color: "orange"}}>({Product.formatPriceWithIPI(diff, false)})</span>
            </div>
        </>
    );
}

function ChangedChamada({details}: { details: ChangedDetails })
{
    return (
        <>
            <div className='mb-3'>
                <span style={{backgroundColor: details.chamadaData.theme.navColor, paddingLeft: "20px", paddingRight: "20px"}}></span>
                <span>Chamada {details.chamadaData.chamada.id}</span>
                <br></br>
                <span>Produtos alterados:</span>
                <div>
                    {details.products.map((product, i) => <ChangedProduct key={i} product={product}></ChangedProduct>)}
                </div>
            </div>
        </>
    );
}

function DisplayChangedChamadas({changes}: { changes: ChangedDetails[] })
{
    return (
        <>
            <div>
                {changes.map((change, i) => <ChangedChamada key={i} details={change}></ChangedChamada>)}
            </div>
        </>
    );
}

export default CompareTable;
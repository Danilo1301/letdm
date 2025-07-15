import React, { useContext, useState } from 'react';
import { Product, ProductWEB, TableProductJSON } from '../../../../src/vilubri/Product';
import { ChamadaJSON, ChamadaWEB } from '../../../../src/vilubri/Chamada';
import { useUser } from '../../components/User';

interface ChangedDetails
{
    chamada: ChamadaWEB
    products: TableProductJSON[]
}

function CompareTable()
{
    const { user } = useUser();
    
    const isAdmin = user?.isAdmin == true;

    const [descriptionId, setDescriptionId] = useState("A");
    const [codeId, setCodeId] = useState("B");
    const [priceId, setPriceId] = useState("F");
    const [minPrice, setMinPrice] = useState("1.99");

    const [products, setProducts] = useState<TableProductJSON[]>([]);

    //const [changes, setChanges] = useState<ChangedDetails[]>([]);

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
            response.json().then((data: TableProductJSON[]) => {
                if(response.ok)
                {
                    console.log(data);

                    setProducts(data);
                    processChangedProducts(data);
                    return;
                }
                alert((data as any).error);

                button.disabled = false;
            })
        });

        event.preventDefault();
    }

    const processChangedProducts = (products: TableProductJSON[]) =>{

        const results: ChangedDetails[] = [];

        const changedChamadas: string[] = [];

        // for(const product of products)
        // {
        //     if(product.chamadaData == undefined) continue;

        //     if(!changedChamadas.includes(product.chamadaData.chamada.id))
        //     {
        //         changedChamadas.push(product.chamadaData.chamada.id);

        //         results.push({
        //             chamadaData: product.chamadaData,
        //             products: []
        //         });
        //     }

        //     if(product.changedPrice)
        //     {
        //         for(const result of results)
        //         {
        //             if(result.chamadaData.chamada.id != product.chamadaData.chamada.id) continue;

        //             result.products.push(product);

        //             break;
        //         }

        //     }
        // }

        // console.log(results);

        // setChanges(results);
    }

    if(!isAdmin) return <>Você precisa ser um admin do site</>;

    return (
        <>
            <a href="/vilubri/">Voltar</a>

            <div className='container'>
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

                <DisplayTable products={products}></DisplayTable>
            </div>
        </>
    );
}

function DisplayTable({products}: {products: TableProductJSON[]})
{
    return <>
        {products.map((product, i) => <TableProduct key={i} tableProduct={product}></TableProduct>)}
    </>
}

type TableProductProps = {
  tableProduct: TableProductJSON;
};

const TableProduct: React.FC<TableProductProps> = ({ tableProduct }) => {
    const { product, chamada, newPrice } = tableProduct;
    const code = product.productDefinition.code;
    const name = product.productDefinition.name;
    const price = product.price;
    const priceStr = price.toFixed(2);
    const colorHex = chamada?.themeData.navColor || "#000000";

    console.log(chamada);

    const priceDiff = newPrice - price;

    let priceColor = "#ffffff";
    if(Math.abs(priceDiff) > 0.02)
    {

        if(priceDiff > 0)
        {
            priceColor = "#118911"
        } else {
            priceColor = "#f19102"
        }
    }


    return (
        <div className="d-flex justify-content-between align-items-center border-bottom py-2">
            <div className="d-flex align-items-center gap-2">
                <div
                    className="rounded small me-2"
                    style={{
                        padding: "0px",
                        width: "60px",
                        height: "30px",
                        backgroundColor: colorHex,
                        border: '5px solid ' + colorHex,
                        color: 'black'
                    }}
                >{chamada?.id || "nenhum"}</div>
                <span className="small">{code}</span>
                <span className="fw-medium">{name}</span>
            </div>
            <div className="fw-semibold text-end" style={{color: priceColor}}>
                R$ {newPrice} <span className="small">({priceDiff.toFixed(2)})</span>
            </div>
        </div>
    );
};

export default CompareTable;
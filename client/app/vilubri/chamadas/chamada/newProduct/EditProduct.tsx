import React from 'react';
import { useParams } from 'react-router-dom';
import { Product, ProductJSON } from '../../../../../../src/vilubri/Product';
import { showConfirmWindow } from '../../../Vilubri';
import { getLetDM_Key } from '../../../../../components/cookies';

function EditProduct() {
    const params = useParams();
    const id = params.id!;
    const productIndex = params.productIndex!;

    const backUrl = `/vilubri/chamadas/${id}`;

    const [code, setCode] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("R$ 0,00");
    const [hasIPI, setHasIPI] = React.useState(false);

    React.useEffect(() => {
        fetch(`/api/vilubri/chamadas/${id}/products/${productIndex}`)
        .then(response => response.json())
        .then((data: ProductJSON) => {
            console.log(data)

            setCode(data.code);
            setName(data.name);
            setDescription(data.description);
            setPrice(Product.formatPriceWithIPI(data.price, data.hasIPI));
            setHasIPI(data.hasIPI);
        })
    }, [])

    const postUrl = `/api/vilubri/chamadas/${id}/products/edit`;

    const handleSubmit = (event: any) => {

        if(!showConfirmWindow()) return;

        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        formData.append("key", getLetDM_Key());
        formData.append("index", productIndex);

        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        
        console.log('fetchOptions:', fetchOptions);

        fetch(url, fetchOptions)
        .then(response => {
            response.json().then(data => {
                if(response.ok)
                {
                    console.log(data);
    
                    window.location.href = `/vilubri/chamadas/${id}`;
                    return;
                }
                alert(data.error)
            })
        });

        event.preventDefault();
    }

    return (
        <div className='container'>
            <a href={backUrl}>Voltar</a>

            <form action={postUrl} onSubmit={handleSubmit} method="post" encType="multipart/form-data">

                <div className=''>
                    <span>Código:</span>
                    <input type="number" disabled={true} name="code" className="form-control" placeholder="" onChange={e => setCode(e.target.value)} value={code}></input>
                </div>

                <div className=''>
                    <span>Nome:</span>
                    <input type="text" name="product_name" className="form-control" placeholder="" onChange={e => setName(e.target.value)} value={name}></input>
                </div>

                <div className=''>
                    <span>Descrição:</span>
                    <textarea name="description" className="form-control" cols={40} rows={10} onChange={e => setDescription(e.target.value)} value={description}></textarea>
                </div>

                <div className=''>
                    <span>Preço:</span>
                    <input type="text" name="price" className="form-control" placeholder="Preço" onChange={e => setPrice(e.target.value)} value={price}></input>
                    <span>Preço a ser guardado: { Product.parsePriceWithIPI(price)}</span>
                    <br></br>
                    <span>IPI: {price.includes("IPI") ? "Sim" : "Não"}</span>
                </div>

                <br></br>

                <input type="submit" value="Editar" />
            </form>
        </div>
        
    );
}

export default EditProduct;
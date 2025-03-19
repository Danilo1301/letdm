import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLetDM_Key } from '../../../../components/cookies';
import { Product } from '../../../../../src/vilubri/Product';
import { showConfirmWindow } from '../../Vilubri';

export const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState("")

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview("")
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    return (
        <div>
            <input type="file" name="file" className="form-control-file" onChange={onSelectFile}></input>
            <div>
            {selectedFile &&  <img className="item-image border" src={preview}/> }
            </div>
        </div>
    )
}

function NewProduct() {
    const params = useParams();
    const id = params.id!;

    const backUrl = `/vilubri/chamadas/${id}`;

    const [code, setCode] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("R$ 0,00");

    const postUrl = `/api/vilubri/chamadas/${id}/products/new`;

    const handleSubmit = (event: any) => {

        if(!showConfirmWindow()) return;
        
        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        formData.append("key", getLetDM_Key());

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
    
                    window.location.href = backUrl;
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
                    <input type="number" name="code" className="form-control" placeholder="" onChange={e => setCode(e.target.value)} value={code}></input>
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

                <div className="form-group">
                    <span>Imagem:</span>
                    <ImageUpload></ImageUpload>
                </div>

                <input type="submit" value="Enviar" />
            </form>
        </div>
        
    );
}

export default NewProduct;
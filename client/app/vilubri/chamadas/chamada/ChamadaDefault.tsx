import React, { useState, createContext, useContext } from 'react';
import { Chamada, ChamadaJSON, ChamadaPageJSON } from '../../../../../src/vilubri/Chamada';
import { useParams } from 'react-router-dom';
import { defaultSuggestionInfo } from '../../../gtasa/suggestions/editSuggestion/EditSuggestionModel';
import { getLetDM_Key } from '../../../../components/cookies';
import { changeDate, changeTheme, deleteChamada, toggleCompleteStatus } from './ChamadaPage';
import { defaultTheme, ThemeContext } from './ColorSettings';
import { Theme, ThemeJSON } from '../../../../../src/vilubri/Theme';
import { Product, ProductJSON } from '../../../../../src/vilubri/Product';
import { showConfirmWindow } from '../../Vilubri';

type ChamadaDefaultProps = {
  chamada: ChamadaJSON; // Substitua com o tipo correto
};

let THIS_CHAMADA_ID: string = "";

const ChamadaDefault: React.FC<ChamadaDefaultProps> = ({ chamada }) =>
{
    const id = chamada.id;
    THIS_CHAMADA_ID = id;

    const themeContext = useContext(ThemeContext);
    const { theme, setTheme } = themeContext;

    const date = new Date(chamada.date);
    const dateStr = date.toLocaleDateString("pt-BR");
    const timeStr = date.toLocaleTimeString();

    const createdDatte = new Date(chamada.createdDate);
    const createdDateStr = createdDatte.toLocaleDateString("pt-BR");
    const createdTimeStr = createdDatte.toLocaleTimeString();

    //

    
    
    //

    const dateTopOptions: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'numeric', day: 'numeric' };
    const dateTopStr = date.toLocaleDateString("pt-BR", dateTopOptions);

    const getProducts = () => {



        if(chamada.productTables[0] == undefined)
        {
            return [];
        }
        return chamada.productTables[0];
    }

    const newProductUrl = `/vilubri/chamadas/${id}/product/new`;

    //

    
    //

    return (
        <>
             <div className="container">
                <a href="/vilubri/chamadas">Voltar</a>
            
                <div>Chamada {id}</div>

                <div>
                    Data: {dateStr} | {timeStr}
                </div>

                <div>
                    Data de criação: {createdDateStr} | {createdTimeStr}
                </div>

                <div>
                    Tema: {chamada.theme}
                </div>

                <div className="row align-items-center">
                    <div className="col-auto">
                        {chamada.completed ?
                        <>
                            <span className="badge text-bg-success">Completo</span>
                        </> : <>
                            <span className="badge text-bg-warning">Incompleto</span>
                        </>}
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-sm btn-primary pl-2" onClick={() => toggleCompleteStatus(id)}>Mudar status para {chamada.completed ? "Incompleto" : "Completo"}</button>
                    </div>
                </div>

                <a className='btn btn-primary mt-4 mb-4' href={newProductUrl}>Adicionar produto</a>
                <a className='btn btn-secondary mt-4 mb-4' style={{marginLeft: "10px"}} onClick={() => changeTheme(id)}>Mudar tema</a>
                <a className='btn btn-secondary mt-4 mb-4' style={{marginLeft: "10px"}} onClick={() => changeDate(id)}>Mudar data de modificação</a>

                <div className='p-5' style={{backgroundColor: theme.backgroundColor}}>
                    <div className=''>
                        <div className="nav row" style={{backgroundColor: theme.navColor}}>
                            <div className='col'>
                                <img className="nav-image m-3" src="/logo-vilubri.png" alt="Vilubri"></img>
                            </div>
                            <div className='col-auto align-self-center'>
                                <div className='nav-alert p-2 text-center'>
                                    {'Alert'}
                                </div>
                            </div>
                            <div className='col-auto align-self-center'>
                                <div className='nav-date p-2 text-center' style={{backgroundColor: theme.dateColor}}>
                                    <i className="fa-regular fa-calendar" style={{marginRight: "10px"}}></i>
                                    <span>{dateTopStr}</span>
                                </div>
                            </div>
                            <div className='col-auto align-self-center'>
                                <div className='footer-number p-2 text-center' style={{backgroundColor: theme.dateColor}}>
                                    <i className="fa-regular fa-file" style={{marginRight: "10px"}}></i>
                                    <span>{id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                

                    <div className="" style={{backgroundColor: theme.backgroundColor}}>
                        {getProducts().map((product, i) => <ProductItem key={i} product={product}></ProductItem>)}
                    </div>

                </div>

                <button type="button" className="btn btn-danger mt-4" onClick={() => deleteChamada(id)}>Deletar chamada</button>
            </div>
        </>
    );
}

function ProductItem({product}: { product: ProductJSON })
{
    const themeContext = useContext(ThemeContext);
    const { theme, setTheme } = themeContext;

    const [newIndex, setNewIndex] = React.useState("0");

    const handleRemoveProduct = () => {

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
    
        console.log('/create', requestOptions)

        fetch('/api/vilubri/chamadas/' + THIS_CHAMADA_ID + '/products/' + product.index + '/remove', requestOptions)
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

    const handleChangeIndex = () => {
        
        if(!showConfirmWindow()) return;

        const key = getLetDM_Key();

        const body: any = {
            key: key,
            newIndex: parseInt(newIndex)
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };
    
        console.log('requestOptions:', requestOptions)

        fetch('/api/vilubri/chamadas/' + THIS_CHAMADA_ID + '/products/' + product.index + '/changeIndex', requestOptions)
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

    //lines description
    let lines: string[] = product.description.split("\n");
    lines = lines.map(line => {
        line = line.trim();
        if(line.length === 0) return "⠀";
        return line;
    })

    //image
    const productImage = `/api/vilubri/productimage/${product.code}.png`;

    //style
    //const useSmallProduct = useContext(CheckboxContext);
    const useSmallProduct = true;

    const style: React.CSSProperties = {};
    if(useSmallProduct) style.maxWidth = "450px";

    //edit url
    const editUrl = `/vilubri/chamadas/${THIS_CHAMADA_ID}/product/${product.index}/edit`;

    return (
        <div className="row pt-3 pb-3" style={style}>  
            <div className="col">
                <div className="col">
                    <div className="item-bg p-3" style={{backgroundColor: theme.itemColor}}>
                        <div className="item-title">{product.code} - {product.name}</div>
                        <div className="row">
                            <div className="col-auto">
                                <img className="item-image border" src={productImage} alt={product.name}/>
                                <div className="item-price">{Product.formatPriceWithIPI(product.price, product.hasIPI)}</div>
                            </div>
                            <div className="item-description col p-0">
                                {lines.map((line, i) => <div key={i}>{line}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className='mt-4' onClick={handleRemoveProduct}>[{product.index}] Remover produto</button>
            <div className='row'>
                <div className="col-auto">
                    <input type="number" name="index" className="form-control" placeholder="Novo index" onChange={e => setNewIndex(e.target.value)} value={newIndex}></input>
                </div>
                <div className="col-auto">
                    <button className='' onClick={handleChangeIndex}>Mudar index</button>
                </div>
                <div className="col-auto">
                    <a href={editUrl}>Editar</a>
                </div>
            </div>
        </div>
        
    );
}

export default ChamadaDefault;
import React, { useState, createContext, useContext } from 'react';
import { Chamada, ChamadaJSON, ChamadaPageJSON } from '../../../../../src/vilubri/Chamada';
import { useParams } from 'react-router-dom';
import { defaultSuggestionInfo } from '../../../gtasa/suggestions/editSuggestion/EditSuggestionModel';
import { getLetDM_Key } from '../../../../components/cookies';
import { changeDate, changeTheme, deleteChamada, setChamadaCustomDate, toggleCompleteStatus } from './ChamadaPage';
import { ThemeContext } from './ColorSettings';

type ChamadaTableProps = {
  chamada: ChamadaJSON; // Substitua com o tipo correto
};

export type Dado = {
    descricao: string;
    codigo: string;
    preco: number;
    temIPI: boolean;
    tabelaIndex: number;
};

const ChamadaTable: React.FC<ChamadaTableProps> = ({ chamada }) =>
{
    const id = chamada.id;

    const themeContext = useContext(ThemeContext);
    const { theme, setTheme } = themeContext;

    const date = new Date(chamada.date);
    const dateStr = date.toLocaleDateString("pt-BR");
    const timeStr = date.toLocaleTimeString();

    const createdDatte = new Date(chamada.createdDate);
    const createdDateStr = createdDatte.toLocaleDateString("pt-BR");
    const createdTimeStr = createdDatte.toLocaleTimeString();
    
    const [items, setItems] = useState("");

    const [dados, setDados] = useState<Dado[][]>([]);

    const handleSaveItems = () => {
        try {
            const dados = parseDados(items);
            
            const key = getLetDM_Key();
            
            const body: any = {
                id: chamada.id,
                key: key,
                data: dados
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };

            fetch('/api/vilubri/tableAddItems', requestOptions)
            .then(response => {
                response.json().then(data => {
                    if(response.ok)
                    {
                        console.log(data);
        
                        location.reload();
                        return;
                    }
                    alert(data.error);
                })
            });

        } catch (error) {
            alert(error);
        }
    }

    const parseDados = (text: string) => {
        const tabelasBrutas = text.split(/\n\s*\n/); // separa as tabelas por linhas vazias
        const tabelas = tabelasBrutas.map((tabelaTexto, tabelaIndex) => {
            const linhas = tabelaTexto.trim().split('\n');

            const dados = linhas.map(linha => {
                const [descricao, codigo, preco] = linha.split('\t');
                return {
                    descricao,
                    codigo,
                    preco: parsePreco(preco),
                    temIPI: preco.toLowerCase().includes("ipi"),
                    tabelaIndex
                } as Dado;
            });

            return dados;
        });

        // Junta todas as tabelas em um único array
        return tabelas;
    };

    const tryUpdateItems = (text: string) => {
    
        console.log(text);

        setItems(text);

        try {
            const dados = parseDados(text);
            
            console.log(dados);

            setDados(dados);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {

        let str = "";

        for (let tableIndex = 0; tableIndex < chamada.productTables.length; tableIndex++) {
            const table = chamada.productTables[tableIndex];

            for (let i = 0; i < table.length; i++) {
                const product = table[i];
                const preco = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
                const linha = `${product.name}\t${product.code}\t${preco}${product.hasIPI ? ' + IPI' : ''}`;
                str += linha + '\n';
            }

            // Linha vazia após cada tabela (menos após a última)
            if (tableIndex < chamada.productTables.length - 1) {
                str += '\n';
            }
        }

        tryUpdateItems(str);
    }, []);


    const dateTopOptions: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'numeric', day: 'numeric' };
    const dateTopStr = date.toLocaleDateString("pt-BR", dateTopOptions);

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

                <a className='btn btn-secondary mt-4 mb-4' style={{marginLeft: "10px"}} onClick={() => changeTheme(id)}>Mudar tema</a>
                <a className='btn btn-secondary mt-4 mb-4' style={{marginLeft: "10px"}} onClick={() => changeDate(id)}>Mudar data de modificação</a>                


                <div className='mt-4 mb-4'>
                    <div className=''>
                        <span>Lista de itens</span>
                        <textarea
                            className="form-control"
                            placeholder="Digite algo..."
                            rows={10} // número de linhas visíveis
                            onChange={e => tryUpdateItems(e.target.value)}
                            value={items}
                        />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleSaveItems}>Salvar</button>
                </div>

                <div className='mt-4 mb-4' style={{backgroundColor: theme.backgroundColor}}>
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

                {dados.map((tabela, index) => (
                    <div key={index} className="mb-4">
                    <h5>Tabela {index}</h5>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                        <tr>
                            <th>Descrição</th>
                            <th>Código</th>
                            <th>Preço</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tabela.map((dado, i) => (
                            <tr key={i}>
                            <td>{dado.descricao}</td>
                            <td>{dado.codigo}</td>
                            <td>R$ {dado.preco.toFixed(2)}{dado.temIPI ? ' + IPI' : ''}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                ))}

                <a className='btn btn-secondary' style={{marginLeft: "10px"}} onClick={() => setChamadaCustomDate(id)}>Define date</a>
                
                <button type="button" className="btn btn-danger" onClick={() => deleteChamada(id)}>Deletar chamada</button>
            </div>
        </>
    );
}

function parsePreco(str: string): number {
  if (!str) return 0;

  // Remove R$, IPI e espaços
  const cleaned = str
    .replace(/R\$\s?/g, '')
    .replace(/\+.*$/, '') // remove "+ IPI" ou similar
    .replace(/\s/g, '');

  // Detectar se tem ponto ou vírgula como separadores
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let decimalSeparator = '';
  let normalized = cleaned;

  // Detectar qual o último separador usado (decimal)
  if (lastComma > lastDot) decimalSeparator = ',';
  else if (lastDot > lastComma) decimalSeparator = '.';

  if (decimalSeparator) {
    // Remove todos os separadores antes do último
    const regex = new RegExp(`[.,](?=.*[${decimalSeparator}])`, 'g');
    normalized = normalized.replace(regex, '');
    // Troca o decimal para ponto
    normalized = normalized.replace(decimalSeparator, '.');
  }

  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}


export default ChamadaTable;
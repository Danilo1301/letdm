import { Chamada, ChamadaWEB } from "./Chamada";

export interface ProductDefinition
{
    code: string;
    name: string;
    description: string;
    hasIPI: boolean;
}

export interface ProductJSON {
    productCode: string;
    price: number;
}

export interface ProductWEB {
    productDefinition: ProductDefinition;
    price: number;
    index: number;
}

export interface TableProductJSON {
    product: ProductWEB;
    chamada: ChamadaWEB | undefined;
    newPrice: number;

    isNewProduct: boolean;
}

export class Product {
    public productDefinition: ProductDefinition;
    public price: number;

    public chamada?: Chamada;

    constructor(productDefinition: ProductDefinition, price: number)
    {
        this.productDefinition = productDefinition;
        this.price = price;
    }

    public toJSON()
    {
        const json: ProductJSON = {
            productCode: this.productDefinition.code,
            price: this.price
        }

        return json;
    }

    public toWEB()
    {
        const web: ProductWEB = {
            productDefinition: this.productDefinition,
            price: this.price,
            index: this.chamada ? this.chamada.findProductIndex(this) : -1
        }

        return web;
    }

    public static parsePriceWithIPI(input: string): [number, boolean] {
        // Verifica se a string contém "IPI"
        const hasIPI = input.includes("IPI");
    
        // Remove "R$", "IPI", espaços e formata para número
        const numericPart = input
            .replace(/R\$\s?/, "") // Remove "R$"
            .replace(/\.|,/g, (match) => (match === "." ? "" : ".")) // Troca "." por "" e "," por "."
            .replace(/[^\d.]/g, ""); // Remove qualquer outro caractere que não seja número ou ponto
        
        // Converte para número
        const price = parseFloat(numericPart) || 0;
    
        return [price, hasIPI];
    }

    public static formatPriceWithIPI(price: number, hasIPI: boolean): string {
        // Converte para string com duas casas decimais e substitui "." por ","
        const formattedPrice = price
            .toFixed(2) // Garante duas casas decimais
            .replace(".", ","); // Converte "." decimal para ","
    
        // Adiciona separadores de milhar
        const parts = formattedPrice.split(",");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
        // Retorna a string formatada com " + IP" se hasIPI for true
        return `R$ ${parts.join(",")}${hasIPI ? " + IPI" : ""}`;
    }
}
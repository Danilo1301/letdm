import { Chamada, ChamadaPageJSON } from "./Chamada";

export interface ProductJSON {
    name: string;
    code: string;
    description: string;
    price: number;
    hasIPI: boolean;
    index: number;
}

export interface ProductJSON_Changed {
    product: ProductJSON;
    chamadaData: ChamadaPageJSON | undefined;
    newPrice: number;
    newProduct: boolean;
    changedPrice: boolean;
}

export class Product {
    public name: string;
    public code: string;
    public description: string;
    public price: number;
    public hasIPI: boolean;

    public chamada?: Chamada;

    constructor(name: string, code: string, description: string, price: number, hasIPI: boolean)
    {
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.hasIPI = hasIPI;
    }

    public toJSON()
    {
        const json: ProductJSON = {
            name: this.name,
            code: this.code,
            description: this.description,
            price: this.price,
            hasIPI: this.hasIPI,
            index: this.chamada?.products.indexOf(this) || 0
        }

        return json;
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
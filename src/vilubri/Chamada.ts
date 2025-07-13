import { Product, ProductJSON } from "./Product";
import { ThemeJSON } from "./Theme";

export interface ChamadaJSON {
    id: string;
    type: ChamadaType,
    productTables: ProductJSON[][];
    date: number;
    createdDate: number;
    completed: boolean;
    theme: string;
}

export interface OldChamadaJSON {
    id: string;
    products: ProductJSON[];
    date: number;
    createdDate: number;
    completed: boolean;
    theme: string;
}

export interface ChamadaPageJSON {
    chamada: ChamadaJSON
    theme: ThemeJSON;
}

export enum ChamadaType {
    CHAMADA_DEFAULT,
    CHAMADA_TABLE
}

export class Chamada {
    public id: string;
    public type: ChamadaType;
    public productTables: Product[][] = [];
    public date: Date;
    public createdDate: Date;
    public isCompleted: boolean = false;
    public theme: string = "none";

    constructor(id: string, type: ChamadaType)
    {
        this.id = id;
        this.type = type;
        this.date = new Date();
        this.createdDate = new Date();
    }

    public toJSON()
    {
        const productTables: ProductJSON[][] = [];

        for (let tableIndex = 0; tableIndex < this.productTables.length; tableIndex++) {
            const table = this.productTables[tableIndex];

            const tableJson: ProductJSON[] = [];

            for (let i = 0; i < table.length; i++) {
                const product = table[i];
                const productJson = product.toJSON(); // assume que o produto tem um método toJSON()
                tableJson.push(productJson);
            }

            productTables.push(tableJson);
        }

        const json: ChamadaJSON = {
            id: this.id,
            type: this.type,
            productTables: productTables,
            date: this.date.getTime(),
            createdDate: this.createdDate.getTime(),
            completed: this.isCompleted,
            theme: this.theme
        }

        

        return json;
    }

    public loadFromJSON(data: ChamadaJSON)
    {
        if (data.theme === undefined) {
            data.theme = this.theme;
        }

        this.date = new Date(data.date);
        this.createdDate = new Date(data.createdDate);
        this.isCompleted = data.completed;
        this.theme = data.theme;

        this.productTables = []; // limpa qualquer dado anterior

        for (const table of data.productTables) {
            const productList: Product[] = [];

            for (const productJson of table) {
                let price = productJson.price;
                let hasIPI = false;

                if (typeof price === 'string') {
                    const result = Product.parsePriceWithIPI(price);
                    price = result[0];
                    hasIPI = result[1];
                }

                const product = new Product(
                    productJson.name,
                    productJson.code,
                    productJson.description,
                    price,
                    hasIPI
                );

                product.chamada = this;

                productList.push(product);
            }

            this.productTables.push(productList);
        }

        if (data.createdDate === 0) {
            this.createdDate = new Date();
        }
    }

    public addProduct(product: Product)
    {
        this.addProductToTable(0, product);
    }

    public addProductToTable(tableIndex: number, product: Product)
    {
        product.chamada = this;

        if(this.productTables[tableIndex] == undefined)
        {
            this.productTables[tableIndex] = [];
        }

        for(const p of this.productTables[tableIndex])
        {
            if(p.code == product.code)
            {
                p.name = product.name;
                p.price = product.price;
                p.hasIPI = product.hasIPI;

                return;
            }
        }

        this.productTables[tableIndex].push(product);
    }

    public findProductIndex(product: Product)
    {
        for (let tableIndex = 0; tableIndex < this.productTables.length; tableIndex++) {
            const table = this.productTables[tableIndex];

            for (let i = 0; i < table.length; i++) {
                const p = table[i];

                if(p.code == product.code) return i;
            }

        }
        return -1;
    }

    public hasProductCode(code: string)
    {
        for(const table of this.productTables)
        {
            for(const product of table)
            {
                if(product.code == code)
                {
                    return true;
                }
            }
        }
        return false;
    }

    public getProductByCode(code: string)
    {
        for(const table of this.productTables)
        {
            for(const product of table)
            {
                if(product.code == code)
                {
                    return product;
                }
            }
        }
        return undefined;
    }

    public getProductsList()
    {
        var products: Product[] = [];
        
        for(var i = 0; i < this.productTables.length; i++)
        {
            for(var j = 0; j < this.productTables[i].length; j++)
            {
                products.push(this.productTables[i][j]);
            }
        }

        return products;
    }
}
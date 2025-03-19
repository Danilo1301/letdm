import { Product, ProductJSON } from "./Product";
import { ThemeJSON } from "./Theme";

export interface ChamadaJSON {
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

export class Chamada {
    public id: string;
    public products: Product[] = [];
    public date: Date;
    public createdDate: Date;
    public isCompleted: boolean = false;
    public theme: string = "none";

    constructor(id: string)
    {
        this.id = id;
        this.date = new Date();
        this.createdDate = new Date();
    }

    public toJSON()
    {
        const json: ChamadaJSON = {
            id: this.id,
            products: [],
            date: this.date.getTime(),
            createdDate: this.createdDate.getTime(),
            completed: this.isCompleted,
            theme: this.theme
        }

        for(const product of this.products)
        {
            json.products.push(product.toJSON());
        }

        return json;
    }

    public loadFromJSON(data: ChamadaJSON)
    {
        if(data.theme == undefined)
        {
            data.theme = this.theme;
        }

        this.date = new Date(data.date);
        this.createdDate = new Date(data.createdDate);
        this.isCompleted = data.completed;
        this.theme = data.theme;
    
        for(const productJson of data.products)
        {
            if(typeof productJson.price == "string")
            {
                var result = Product.parsePriceWithIPI(productJson.price);

                //console.log("Converting...", productJson.price, result);

                productJson.price = result[0];
                productJson.hasIPI = result[1];
            }

          const product = new Product(productJson.name, productJson.code, productJson.description, productJson.price, productJson.hasIPI);
          this.addProduct(product);
        }

        if(data.createdDate == 0) this.createdDate = new Date();
    }

    public addProduct(product: Product)
    {
        product.chamada = this;

        this.products.push(product);
    }

    public hasProductCode(code: string)
    {
        for(const product of this.products)
        {
            if(product.code == code) return true;
        }
        return false;
    }
}
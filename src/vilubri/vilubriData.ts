import { Chamada } from "./Chamada";
import { Product, ProductDefinition } from "./Product";
import { Theme } from "./Theme";

export class VilubriData
{
    public static Products: Map<string, ProductDefinition> = new Map<string, ProductDefinition>();
    public static Chamadas: Map<string, Chamada> = new Map<string, Chamada>();
    public static Themes: Theme[] = [];

    public static getProductDefinitionByCode(code: string)
    {
        const def = this.Products.get(code);
        return def;
    }

    public static tryCreateProduct(code: string, name: string, description: string, hasIPI: boolean, price: number)
    {
        const productDefinition = this.tryCreateProductDefinition(code, name, description, hasIPI);

        const product = new Product(productDefinition, price);

        return product;
    }

    public static tryCreateProductDefinition(code: string, name: string, description: string, hasIPI: boolean)
    {
        if(typeof code != "string")
        {
            throw `Code '${code}' must be a string (is ${typeof code})`;
        }

        if(this.Products.has(code))
        {
            const currentDef = this.Products.get(code)!;

            if(name.length == 0)
                name = currentDef.name;

            if(description.length == 0)
                description = currentDef.description;
        }

        const productDefinition: ProductDefinition = {
            code: code,
            name: name,
            description: description,
            hasIPI: hasIPI
        }

        this.Products.set(code, productDefinition);

        return productDefinition;
    }

    public static getThemeById(id: string)
    {
        for(const theme of this.Themes)
        {
            if(theme.id != id) continue;

            return theme;
        }
    }
}
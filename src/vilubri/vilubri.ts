import { App } from "../app/app";
import { PATH_DATA, PATH_UPLOADS } from "../paths";
import { Chamada, ChamadaJSON, ChamadaType, ChamadaWEB } from "./Chamada";
import { ChamadaJSON_HomeList } from "./requestTypes";
import { Theme, ThemeJSON } from "./Theme";
import { Product, ProductDefinition, TableProductJSON } from "./Product";

import fs from 'fs'
import express from 'express';
import path from "path";
import xlsx from 'node-xlsx';
import { ProcessPricesTableOptions } from "./processPricesTableOptions";
import { Dado } from "../../client/app/vilubri/chamadas/chamada/ChamadaTable";
import { VilubriData } from "./vilubriData";

const PATH_CHAMADAS_FILE = path.join(PATH_DATA, "vilubri", "chamadas.json");
const PATH_PRODUCT_DEFINITIONS = path.join(PATH_DATA, "vilubri", "products.json");
const PATH_THEMES_FILE = path.join(PATH_DATA, "vilubri", "themes.json");
const PATH_PRODUCTIMAGES = path.join(PATH_DATA, "vilubri", "productImages");

export class Vilubri extends App
{
    private upload: any;

    constructor(id: string, app: express.Application, upload: any)
    {
        super(id);

        //Vilubri.Instance = this;
        this.upload = upload;

        this.setupRoutes(app);
    }

    public start()
    {
        super.start();

        console.log(`[Vilubri] start`);
    }

    public load()
    {
        super.load();    

        this.loadData();
    }

    public getMostRecentProduct(code: string)
    {
        let mostRecentChamada: Chamada | undefined = undefined;

        for (const chamada of VilubriData.Chamadas.values()) {

            if(!chamada.hasProductCode(code))
                continue;

            if (
                !mostRecentChamada ||
                new Date(chamada.date) > mostRecentChamada.date
            ) {
                mostRecentChamada = chamada;
            }
        }
        console.log(mostRecentChamada);

        if(mostRecentChamada == undefined)
        {
            return undefined;
        }

        return mostRecentChamada.getProductByCode(code);
    }

    public setupRoutes(app: express.Application)
    {
        app.get('/api/vilubri/test', async (req, res) => {
            res.json({test: 123});
        });

        app.get('/api/vilubri/themes', async (req, res) => {
            res.json(VilubriData.Themes);
        });

        app.get('/api/vilubri/chamadas', (req, res) => {
            res.json(this.getChamadaHomeList());
        })

        app.get('/api/vilubri/productimage/:image', (req, res) => {
            const image = req.params.image;
            const resPath = path.join(PATH_DATA, "vilubri", "productImages", image);
            res.sendFile(resPath);
        });

        app.post('/api/vilubri/chamadas/newTable', (req, res) => {
            const id: string = req.body.id;
            const key: string = req.body.key;
        
            console.log("body:", req.body);
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            if(VilubriData.Chamadas.has(id))
            {
                res.status(500).send({ error: "ID already exists" });
                return;
            }
        
            const chamada = this.createChamada(id, ChamadaType.CHAMADA_TABLE);
        
            this.saveData();

            res.json(chamada.toWEB());
        });

        app.post('/api/vilubri/chamadas/newDefault', (req, res) => {
            const id: string = req.body.id;
            const key: string = req.body.key;
            //const date: number = req.body.date;
            const otherChamadaId: string = req.body.otherChamadaId;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            if(VilubriData.Chamadas.has(id))
            {
                res.status(500).send({ error: "ID already exists" });
                return;
            }
        
            if(otherChamadaId.length > 0)
            {
                if(!VilubriData.Chamadas.has(otherChamadaId))
                {
                    res.status(500).send({ error: "Chamada ID " + otherChamadaId + " not found. Can not copy products" });
                    return;
                }
            }
        
            const chamada = this.createChamada(id, ChamadaType.CHAMADA_DEFAULT);
            
            // if(date != -1) chamada.date = new Date(date);
        
            if(otherChamadaId.length > 0)
            {
                const otherChamada = VilubriData.Chamadas.get(otherChamadaId)!;
        
                for(const product of otherChamada.getProductsList())
                {
                    const newProduct = new Product(product.productDefinition, product.price);
                    chamada.addProduct(newProduct);
                }
            }
        
            this.saveData();
        
            res.json(chamada.toWEB());
        });

        app.get('/api/vilubri/chamadas/:id', (req, res) => {
            const id = req.params.id;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada ID " + id });
                return;
            }
        
            const json: ChamadaWEB = chamada.toWEB();
            
            res.json(json);
        });

        app.post('/api/vilubri/tableAddItems', (req, res) => {
            const body = req.body;

            const key: string = body.key;
            const id: string = body.id;
            const data = (body.data as Dado[][]).flat();
        
            console.log(data);

            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada ID " + id });
                return;
            }

            // if(data.tabelaIndex > chamada.productTables.length)
            // {
            //     res.status(500).send({ error: "Invalid table index" });
            //     return;
            // }

            chamada.productTables = [];
            for(const dado of data)
            {
                const product = VilubriData.tryCreateProduct(dado.codigo, dado.descricao, "", dado.temIPI, dado.preco);

                chamada.addProductToTable(dado.tabelaIndex, product);
            }

            this.saveChamadas();

            res.json(chamada.toWEB());
        });

        app.post('/api/vilubri/chamadas/:id/changeTheme', (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
            const themeId: string = req.body.themeId;
            
            if(!this.authorizeKey(key))
            {
              res.status(500).send({ error: "Wrong authentication key" });
              return;
            }
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
              res.status(500).send({ error: "Could not find chamada ID " + id });
              return;
            }

            const theme = VilubriData.getThemeById(themeId);
            
            if(!theme)
            {
                res.status(500).send({ error: "Invalid theme ID " + themeId });
                return;
            }

            chamada.theme = theme.id;
        
            this.saveData();

            res.json(chamada.toWEB());
        });

        app.post('/api/vilubri/chamadas/:id/changeDate', (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
        
            if(!this.authorizeKey(key))
            {
              res.status(500).send({ error: "Wrong authentication key" });
              return;
            }
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
              res.status(500).send({ error: "Could not find chamada ID " + id });
              return;
            }
        
            chamada.date = new Date();
        
            this.saveData();
        
            res.json(chamada.toWEB());
        });

        app.post('/api/vilubri/chamadas/:id/toggleCompleteStatus', (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
        
            console.log(req.url)
            console.log("body:", req.body);
            
            if(!this.authorizeKey(key))
            {
              res.status(500).send({ error: "Wrong authentication key" });
              return;
            }
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
              res.status(500).send({ error: "Could not find chamada ID " + id });
              return;
            }
        
            chamada.isCompleted = !chamada.isCompleted;
        
            this.saveData();
        
            res.json(chamada.toWEB());
        });

        app.get('/api/vilubri/product/:code', (req, res) => {
            const code = req.params.code;
            
            let product: Product | undefined;

            for(const chamada of VilubriData.Chamadas.values())
            {
                for(const p of chamada.getProductsList())
                {
                    if(p.productDefinition.code == code)
                    {
                        product = p;
                        break;
                    }
                }
            }
        
            if(!product)
            {
                res.status(500).send({ error: "Could not find product" });
                return;
            }

            var json = product.toWEB();

            res.json(json);
        });

        app.get('/api/vilubri/chamadas/:id/products/:productIndex', (req, res) => {
            const id = req.params.id;
            const productIndex: number = parseInt(req.params.productIndex);
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(productIndex >= chamada.productTables[0].length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
        
            const product = chamada.productTables[0][productIndex];
        
            res.json(product.toWEB());
        });

        app.post('/api/vilubri/chamadas/:id/products/new', this.upload.single('file'), (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            const code: string = req.body.code;
            const name: string = req.body.product_name;
            const description: string = req.body.description;
            const priceStr: string = req.body.price;
        
            if(chamada.hasProductCode(code))
            {
                res.status(500).send({ error: "This code was already added" });
                return;
            }
        
            const priceFormat = Product.parsePriceWithIPI(priceStr)
            const price = priceFormat[0];
            const hasIPI = priceFormat[1];

            const product = VilubriData.tryCreateProduct(code, name, description, hasIPI, price);
        
            chamada.addProduct(product);
        
            this.saveData();
        
            console.log(req.body)

            const file = (req as any).file;
            
            if(file)
            {
                const imageName = `${code}.png`;
                const newImagePath = `${PATH_PRODUCTIMAGES}/${imageName}`;
                const oldFilePath = `./uploads/${file.filename}`
        
                if(fs.existsSync(newImagePath))
                {
                    console.log(`Image ${imageName} already exists! Deleting old image...`)
                    fs.unlinkSync(newImagePath);
                }
                
                console.log(`'${oldFilePath}' renaming to '${newImagePath}'`)
        
                fs.renameSync(oldFilePath, newImagePath);
            }
        
            res.json(product.toWEB());
        });

        app.post('/api/vilubri/chamadas/:id/delete', (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
            
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada ID " + id });
                return;
            }
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            VilubriData.Chamadas.delete(id);
        
            this.saveData();
        
            res.json({});
        });

        app.post('/api/vilubri/chamadas/:id/setDate', (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
            const dateStr: string = req.body.date;
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada ID " + id });
                return;
            }
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }

            const date = parseCustomDate(dateStr);

            if(date)
            {
                chamada.date = date;
                chamada.createdDate = date;
            }

            this.saveData();
        
            res.json({});
        });

        /*
        TODO: remove this upload.single part
        */
        app.post('/api/vilubri/chamadas/:id/products/edit', this.upload.single('file'), (req, res) => {
            const id = req.params.id;

            console.log(req.url)
            console.log("body:", req.body);

            const chamada = VilubriData.Chamadas.get(id);

            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }

            const productIndex = req.body.index;

            if(productIndex < 0 || productIndex >= chamada.productTables[0].length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
            
            const key: string = req.body.key;
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
            
            const product = chamada.productTables[0][productIndex];

            //const code: string = req.body.code;
            const name: string = req.body.product_name;
            const description: string = req.body.description;
            const price: string = req.body.price;

            const priceFormat = Product.parsePriceWithIPI(price);

            //product.code = code;
            product.productDefinition.name = name;
            product.productDefinition.description = name;
            product.productDefinition.hasIPI = priceFormat[1];
            product.price = priceFormat[0];

            this.saveData();

            res.json(req.body);
        });

        app.post('/api/vilubri/chamadas/:id/products/:productIndex/remove', (req, res) => {
            const id = req.params.id;
            const productIndex: number = parseInt(req.params.productIndex);
            const key: string = req.body.key;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(productIndex >= chamada.productTables[0].length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
        
            chamada.productTables[0].splice(productIndex, 1);
        
            this.saveData();
        
            res.json({});
        });

        app.post('/api/vilubri/chamadas/:id/products/:productIndex/changeIndex', (req, res) => {
            const id = req.params.id;
            const productIndex = parseInt(req.params.productIndex);
            const key: string = req.body.key;
            const newIndex: number = parseInt(req.body.newIndex);
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(productIndex < 0 || productIndex >= chamada.productTables[0].length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
            
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            const product = chamada.productTables[0][productIndex];
        
            chamada.productTables[0].splice(productIndex, 1);
            chamada.productTables[0].splice(newIndex, 0, product);
        
            res.json(req.body);
        });

        app.post('/api/vilubri/uploadTable', this.upload.single('file'), (req, res) => {
            //const id = req.params.id;
            
            const file = (req as any).file;
        
            console.log(file);

            const test = false;
            if(test)
            {
                const options: ProcessPricesTableOptions = {
                    description: req.body["description-id"],
                    code: req.body["code-id"],
                    price: req.body["price-id"],
                    minPriceChange: parseFloat(req.body["min-price-change"]) || 0
                }

                const testPath = path.join(PATH_DATA, "vilubri", "Vilubri.xlsx");

                const changedProducts = this.processPricesTable(testPath, options);

                res.json(changedProducts);

                return;
            }

            if(file == undefined)
            {
                res.status(500).send({ error: "You did not upload a table" });
                return;
            }

            const filePath = file.path;
            const newPath = `${PATH_UPLOADS}/table.xlsx`;
            
            fs.renameSync(filePath, newPath);

            const options: ProcessPricesTableOptions = {
                description: req.body["description-id"],
                code: req.body["code-id"],
                price: req.body["price-id"],
                minPriceChange: parseFloat(req.body["min-price-change"]) || 0
            }

            try {
                const changedProducts = this.processPricesTable(newPath, options);

                res.json(changedProducts);
            } catch (error) {

                res.status(500).send({ error: "Error processing the table" });
            }

            console.log(`Removing table...`);

            fs.rmSync(newPath);
        });

        app.post('/api/vilubri/searchProductsByCode', this.upload.single('file'), (req, res) => {
            const name: string = req.body.name;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const json: ChamadaWEB[] = [];
        
            for(const chamada of VilubriData.Chamadas.values())
            {
                console.log(`Loopíng products for chamada ${chamada.id}...`);
                for(const product of chamada.getProductsList())
                {
                    if(product.productDefinition.name.toLowerCase().includes(name.toLowerCase()) || product.productDefinition.code.includes(name))
                    {
                        console.log(`Found product ${product.productDefinition.name}`)
                        json.push(chamada.toWEB());
                        break;
                    }
                }
            }
        
            res.json(json);
        });

        app.post('/api/vilubri/updateChamada', (req, res) => {
            console.log("update chamada")

            const id: string = req.body.chamada;
            const key: string = req.body.key;
            const products: TableProductJSON[] = req.body.products;
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }

            const chamada = VilubriData.Chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }

            for(const tableProduct of products)
            {
                var product = chamada.getProductByCode(tableProduct.product.productDefinition.code);

                product!.price = tableProduct.newPrice;
            }

            chamada.date = new Date();

            this.saveChamadas();
            
            res.json(chamada.id);
        });
    }

    private processPricesTable(filePath: string, options: ProcessPricesTableOptions)
    {
        const workSheetsFromFile = xlsx.parse(filePath);

        const tableIds: {[key: string]: number} = {
          'A': 0,
          'B': 1,
          'C': 2,
          'D': 3,
          'E': 4,
          'F': 5
        };

        const nameTableId = tableIds[options.description];
        const codeTableId = tableIds[options.code];
        const priceTableId = tableIds[options.price];

        const products: TableProductJSON[] = [];
        
        const data = workSheetsFromFile[0].data;
        for(const a of data)
        {
            if(a.length == 0) continue;

            const name = a[nameTableId];
            const code = a[codeTableId];
            const price = parseFloat(parseFloat(a[priceTableId]).toFixed(2));

            // ignore first row
            if(a[0].toLowerCase().includes("descrição")) continue;
            if(a[0].toLowerCase().includes("descricao")) continue;

            const latestProduct = this.getMostRecentProduct(code);

            if(latestProduct != undefined)
            {
                const chamada = latestProduct.chamada!;

                products.push({
                    product: latestProduct.toWEB(),
                    chamada: chamada.toWEB(),
                    newPrice: price,

                    isNewProduct: false
                });
            } else {
                const product = VilubriData.tryCreateProduct(code, name, "", false, price);

                products.push({
                    product: product.toWEB(),
                    chamada: undefined,
                    newPrice: price,

                    isNewProduct: true
                });
            }

            this.saveProductDefinitions();

            // for(const chamada of VilubriData.Chamadas.values())
            // {
            //     const product = chamada.getProductByCode(code);

            //     if(product == undefined) continue;

            //     const oldPrice = product.price;
        
            //     const diff = Math.abs(oldPrice - price);
         
            //     const changedPrice = diff >= options.minPriceChange;

            //     if(changedPrice)
            //     {
            //         console.log(`Product: ${code}`);
            //         console.log(`Old price:`, oldPrice);
            //         console.log(`New price:`, price);
            //         console.log(`Diff: ${diff} >= ${options.minPriceChange}`);
            //     }

            //     const chamadaJson: ChamadaPageJSON = {
            //         chamada: chamada.toJSON(),
            //         theme: this.getThemeById(chamada.theme)!.data
            //     };

            //     products.push({
            //         product: product.toJSON(),
            //         chamadaPage: chamadaJson,
            //         newPrice: price,

            //         isNewProduct: false
            //     });

            //     if(changedPrice)
            //     {
            //         console.log(`Price changed!`);
            //     }
            // }
        }

        return products;
    }

    public authorizeKey(key: string)
    {
        return key === process.env["LETDM_KEY"];
    }

    public loadData()
    {
        this.loadThemes();
        this.loadProductDefinitions();
        this.loadChamadas();
        //this.convertOldChamadas();
    }

    public loadThemes()
    {
        if(!fs.existsSync(PATH_THEMES_FILE)) return;

        const data: {[key: string]: ThemeJSON} = JSON.parse(fs.readFileSync(PATH_THEMES_FILE, "utf-8"));

        for(const id in data)
        {
            let theme: Theme = {
                id: id,
                data: data[id]
            }

            VilubriData.Themes.push(theme);
        }
    }

    public loadProductDefinitions()
    {
        const PATH_TEST_DEF = path.join(PATH_DATA, "vilubri", "chamadas_def.json");

        // if(fs.existsSync(PATH_TEST_DEF))
        // {
        //     const data: {[key: string]: any} = JSON.parse(fs.readFileSync(PATH_CHAMADAS_FILE, "utf-8"));

        //     console.log(data);

        //     for(const id in data)
        //     {
        //         const json = data[id];

        //         //console.log(json);

        //         for(const table of json.productTables)
        //         {
        //             for(const product of table)
        //             {
        //                 console.log(product.code);

        //                 this.tryCreateProductDefinition(product.code, product.name, product.descricao, product.hasIPI);;
        //             }
        //         }
        //     }

        //     console.log(VilubriData.Products);

        //     this.saveProductDefinitions();
        // }

        if(fs.existsSync(PATH_PRODUCT_DEFINITIONS))
        {
            VilubriData.Products.clear();

            const data: {[key: string]: ProductDefinition} = JSON.parse(fs.readFileSync(PATH_PRODUCT_DEFINITIONS, "utf-8"));

            for(const id in data)
            {
                const def = data[id];

                VilubriData.Products.set(id, def);
            }
        }

        console.log(`${VilubriData.Products.size} products definitions`);
    }

    public loadChamadas()
    {
        if(fs.existsSync(PATH_CHAMADAS_FILE))
        {
            if(VilubriData.Products.size > 0)
            {
                const data: {[key: string]: ChamadaJSON} = JSON.parse(fs.readFileSync(PATH_CHAMADAS_FILE, "utf-8"));

                for(const id in data)
                {
                    const json = data[id];
                    const chamada = this.createChamada(id, json.type);

                    chamada.loadFromJSON(data[id]);
                }
            }
        }

        const PATH_CHAMADAS_OLD = path.join(PATH_DATA, "vilubri", "chamadas_old.json");

        if(fs.existsSync(PATH_CHAMADAS_OLD))
        {
            const data: {[key: string]: any} = JSON.parse(fs.readFileSync(PATH_CHAMADAS_OLD, "utf-8"));

            console.log(data);

            for(const id in data)
            {
                const json = data[id];
                
                if(VilubriData.Chamadas.has(id))
                {
                    console.log("Chamada antiga " + id + " ja criada!")
                    continue;
                }

                //console.log(json);
                const chamada = this.createChamada(id, json.type);
                chamada.date = new Date(json.date);
                chamada.createdDate = new Date(json.createdDate);
                chamada.isCompleted = json.completed;
                chamada.theme = json.theme;

                for (let tableIndex = 0; tableIndex < json.productTables.length; tableIndex++) {
                    const table = json.productTables[tableIndex];
  
                    for(const productJson of table)
                    {
                        //console.log(product.code);
                        //console.log(productJson);

                        //console.log(product);
                        const product = VilubriData.tryCreateProduct(productJson.code, productJson.name, productJson.description, productJson.hasIPI, productJson.price);

                        chamada.addProductToTable(tableIndex, product);
                    }
                    
                }
            }

            this.saveChamadas();
            this.saveProductDefinitions();
        }

        // converter chamadas.json antigas e criar definitions caso nao exista, salvar apenas definitions

        // depois carregar normalmente as chamadas












        
    }

    // public convertOldChamadas()
    // {
    //     if(!fs.existsSync(PATH_OLD_CHAMADAS_FILE)) return;

    //     const allJsons: {[key: string]: OldChamadaJSON} = JSON.parse(fs.readFileSync(PATH_OLD_CHAMADAS_FILE, "utf-8"));

    //     for(const id in allJsons)
    //     {
    //         const data = allJsons[id];

    //         const chamada = this.createChamada(id, ChamadaType.CHAMADA_DEFAULT);

    //         if (data.theme === undefined) {
    //             data.theme = chamada.theme;
    //         }

    //         chamada.date = new Date(data.date);
    //         chamada.createdDate = new Date(data.createdDate);
    //         chamada.isCompleted = data.completed;
    //         chamada.theme = data.theme;

    //         chamada.productTables = []; // limpa qualquer dado anterior
    //         chamada.productTables.push([]);

    //         for (const productJson of data.products) {
    //             let price = productJson.price;
    //             let hasIPI = false;

    //             if (typeof price === 'string') {
    //                 const result = Product.parsePriceWithIPI(price);
    //                 price = result[0];
    //                 hasIPI = result[1];
    //             }

    //             const product = new Product(
    //                 productJson.name,
    //                 productJson.code,
    //                 productJson.description,
    //                 price,
    //                 hasIPI
    //             );

    //             product.chamada = chamada;

    //             chamada.productTables[0].push(product);
    //         }

    //         if (data.createdDate === 0) {
    //             chamada.createdDate = new Date();
    //         }
    //     }

    //     this.saveChamadas();
    // }

    public saveData()
    {
        this.saveChamadas();
        this.saveProductDefinitions();
    }

    public saveChamadas()
    {
        const data: {[key: string]: ChamadaJSON} = {};

        for(const chamada of VilubriData.Chamadas.values())
        {
            const chamadaJson = chamada.toJSON();
            data[chamada.id] = chamadaJson;
        } 

        fs.writeFileSync(PATH_CHAMADAS_FILE, JSON.stringify(data));
    }

    public saveProductDefinitions()
    {
        const data: {[key: string]: ProductDefinition} = {};

        for(const def of VilubriData.Products.values())
        {
            data[def.code] = def;
        } 

        fs.writeFileSync(PATH_PRODUCT_DEFINITIONS, JSON.stringify(data));
    }

    public createChamada(id: string, type: ChamadaType)
    {
        const chamada = new Chamada(id, type);
        VilubriData.Chamadas.set(id, chamada);
        return chamada;
    }

    private getChamadaHomeList()
    {
        const items: ChamadaJSON_HomeList[] = [];

        VilubriData.Chamadas.forEach(chamada => {
            const item: ChamadaJSON_HomeList = {
                id: chamada.id,
                numProducts: chamada.getProductsList().length,
                date: chamada.date.getTime(),
                completed: chamada.isCompleted,
                theme: VilubriData.getThemeById(chamada.theme)!.data
            };
            
            items.push(item);
        });

        return items;
    }
}

function parseCustomDate(dateStr: string): Date | null {
    const match = dateStr.match(/\d+/g);
    if (!match || match.length < 5) return null;

    const [day, month, year, hour, minute] = match;

    // Garante formato correto com dois dígitos
    const dayStr = day.padStart(2, '0');
    const monthStr = month.padStart(2, '0');
    const yearStr = year.length === 2 ? `20${year}` : year;

    const isoString = `${yearStr}-${monthStr}-${dayStr}T${hour}:${minute}`;
    const date = new Date(isoString);

    // Verifica se o Date é válido
    return isNaN(date.getTime()) ? null : date;
}
import { App } from "../app/app";
import fs from 'fs'
import express, { NextFunction } from 'express';
import { PATH_DATA, PATH_UPLOADS } from "../paths";
import path from "path";
import { Chamada, ChamadaJSON, ChamadaPageJSON } from "./Chamada";
import { ChamadaJSON_HomeList } from "./requestTypes";
import { Theme, ThemeJSON } from "./Theme";
import { Product } from "./Product";

const PATH_CHAMADAS_FILE = path.join(PATH_DATA, "vilubri", "chamadas.json");
const PATH_THEMES_FILE = path.join(PATH_DATA, "vilubri", "themes.json");
const PATH_PRODUCTIMAGES = path.join(PATH_DATA, "vilubri", "productImages");

export class Vilubri extends App
{
    private upload: any;
    private chamadas: Map<string, Chamada> = new Map<string, Chamada>();
    private themes: Theme[] = [];

    constructor(id: string, app: express.Application, upload: any)
    {
        super(id);

        this.upload = upload;

        this.setupRoutes(app);
    }

    public start()
    {
        super.start();

        console.log(`\n\n[Vilubri] start`);

        this.loadData();
    }

    public setupRoutes(app: express.Application)
    {
        app.get('/api/vilubri/test', async (req, res) => {
            res.json({test: 123});
        });

        app.get('/api/vilubri/chamadas', (req, res) => {
            res.json(this.getChamadaHomeList());
        })

        app.get('/api/vilubri/chamadas/:id', (req, res) => {
            const id = req.params.id;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = this.chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada ID " + id });
                return;
            }
        
            const json: ChamadaPageJSON = {
                chamada: chamada.toJSON(),
                theme: this.getThemeById(chamada.theme)!.data
            };
            
            res.json(json);
        })

        app.get('/api/vilubri/productimage/:image', (req, res) => {
            const image = req.params.image;
            const resPath = path.join(PATH_DATA, "vilubri", "productImages", image);
            res.sendFile(resPath);
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
        
            const chamada = this.chamadas.get(id);
        
            if(!chamada)
            {
              res.status(500).send({ error: "Could not find chamada ID " + id });
              return;
            }
        
            chamada.isCompleted = !chamada.isCompleted;
        
            this.saveData();
        
            console.log(chamada.toJSON());
        
            res.json(chamada.toJSON());
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
        
            const chamada = this.chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(productIndex >= chamada.products.length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
        
            chamada.products.splice(productIndex, 1);
        
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
        
            const chamada = this.chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(productIndex < 0 || productIndex >= chamada.products.length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
            
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            const product = chamada.products[productIndex];
        
            chamada.products.splice(productIndex, 1);
            chamada.products.splice(newIndex, 0, product);
        
            res.json(req.body);
        });

        app.post('/api/vilubri/chamadas/:id/delete', (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
            
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = this.chamadas.get(id);
        
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
        
            this.chamadas.delete(id);
        
            this.saveData();
        
            res.json({});
        });

        app.post('/api/vilubri/chamadas/new', (req, res) => {
            const id: string = req.body.id;
            const key: string = req.body.key;
            const date: number = req.body.date;
            const otherChamadaId: string = req.body.otherChamadaId;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            if(!this.authorizeKey(key))
            {
                res.status(500).send({ error: "Wrong authentication key" });
                return;
            }
        
            if(this.chamadas.has(id))
            {
                res.status(500).send({ error: "ID already exists" });
                return;
            }
        
            if(otherChamadaId.length > 0)
            {
                if(!this.chamadas.has(otherChamadaId))
                {
                    res.status(500).send({ error: "Chamada ID " + otherChamadaId + " not found. Can not copy products" });
                    return;
                }
            }
        
            const chamada = this.createChamada(id);
            if(date != -1) chamada.date = new Date(date);
        
            if(otherChamadaId.length > 0)
            {
                const otherChamada = this.chamadas.get(otherChamadaId)!;
        
                for(const product of otherChamada.products)
                {
                    const newProduct = new Product(product.name, product.code, product.description, product.price, product.hasIPI);
                    chamada.addProduct(newProduct);
                }
            }
        
            this.saveData();
        
            console.log(chamada.toJSON());
        
            res.json(chamada.toJSON());
        });

        app.get('/api/vilubri/chamadas/:id/products/:productIndex', (req, res) => {
            const id = req.params.id;
            const productIndex: number = parseInt(req.params.productIndex);
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = this.chamadas.get(id);
        
            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }
        
            if(productIndex >= chamada.products.length)
            {
                res.status(500).send({ error: "Could not find product " + productIndex });
                return;
            }
        
            const product = chamada.products[productIndex];
        
            res.json(product.toJSON());
        });

        /*
        TODO: remove this upload.single part
        */
        app.post('/api/vilubri/chamadas/:id/products/edit', this.upload.single('file'), (req, res) => {
            const id = req.params.id;

            console.log(req.url)
            console.log("body:", req.body);

            const chamada = this.chamadas.get(id);

            if(!chamada)
            {
                res.status(500).send({ error: "Could not find chamada " + id });
                return;
            }

            const productIndex = req.body.index;

            if(productIndex < 0 || productIndex >= chamada.products.length)
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
            
            const product = chamada.products[productIndex];

            //const code: string = req.body.code;
            const name: string = req.body.product_name;
            const description: string = req.body.description;
            const price: string = req.body.price;

            const priceFormat = Product.parsePriceWithIPI(price);

            //product.code = code;
            product.name = name;
            product.description = description;
            product.price = priceFormat[0];
            product.hasIPI = priceFormat[1];

            this.saveData();

            res.json(req.body);
        });

        app.post('/api/vilubri/chamadas/:id/products/new', this.upload.single('file'), (req, res) => {
            const id = req.params.id;
            const key: string = req.body.key;
        
            console.log(req.url)
            console.log("body:", req.body);
        
            const chamada = this.chamadas.get(id);
        
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
            const price: string = req.body.price;
        
            if(chamada.hasProductCode(code))
            {
                res.status(500).send({ error: "This code was already added" });
                return;
            }
        
            const priceFormat = Product.parsePriceWithIPI(price);

            const product = new Product(name, code, description, priceFormat[0], priceFormat[1]);
        
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
        
            res.json(product.toJSON());
        });
    }

    public authorizeKey(key: string)
    {
        return key === process.env["LETDM_KEY"];
    }

    public loadData()
    {
        this.loadThemes();
        this.loadChamadas();
    }

    public loadThemes()
    {
        if(!fs.existsSync(PATH_THEMES_FILE)) return;

        const data: {[key: string]: ThemeJSON} = JSON.parse(fs.readFileSync(PATH_THEMES_FILE, "utf-8"));

        console.log(data);

        for(const id in data)
        {
            let theme: Theme = {
                id: id,
                data: data[id]
            }

            this.themes.push(theme);
        }
    }

    public loadChamadas()
    {
        console.log("Loading data");

        console.log(PATH_CHAMADAS_FILE);

        if(!fs.existsSync(PATH_CHAMADAS_FILE)) return;

        const data: {[key: string]: ChamadaJSON} = JSON.parse(fs.readFileSync(PATH_CHAMADAS_FILE, "utf-8"));

        for(const id in data)
        {
            const chamada = this.createChamada(id);

            chamada.loadFromJSON(data[id]);
        }
    }

    public saveData()
    {
        this.saveChamadas();
    }

    public saveChamadas()
    {
        const data: {[key: string]: ChamadaJSON} = {};

        for(const chamada of this.chamadas.values())
        {
            const chamadaJson = chamada.toJSON();
            data[chamada.id] = chamadaJson;
        } 

        fs.writeFileSync(PATH_CHAMADAS_FILE, JSON.stringify(data));
    }

    public createChamada(id: string)
    {
        const chamada = new Chamada(id);
        this.chamadas.set(id, chamada);
        return chamada;
    }

    private getChamadaHomeList()
    {
        const items: ChamadaJSON_HomeList[] = [];

        this.chamadas.forEach(chamada => {
            const item: ChamadaJSON_HomeList = {
                id: chamada.id,
                numProducts: chamada.products.length,
                date: chamada.date.getTime(),
                completed: chamada.isCompleted
            };
            
            items.push(item);
        });

        return items;
    }

    public getThemeById(id: string)
    {
        for(const theme of this.themes)
        {
            if(theme.id != id) continue;

            return theme;
        }
    }
}
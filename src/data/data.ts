import { App } from "../app/app";
import fs from 'fs'
import express, { NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Key_PostBody, NewSugestion_PostBody, RetrieveUserInfo_PostBody, RetrieveUserInfo_Response } from "../interfaces";
import { PATH_DATA, PATH_UPLOADS } from "../paths";
import path from "path";

const archiver = require("archiver");
const unzipper = require("unzipper");

export class Data extends App {

    public upload: any;

    constructor(id: string, app: express.Application, upload: any)
    {
        super(id);

        this.upload = upload;

        this.setupRoutes(app);
    }

    public start()
    {
        super.start();
    }

    public authorizeKey(key: string)
    {
        //return key === "555";
        return key === process.env["LETDM_KEY"];
    }

    public setupRoutes(app: express.Application)
    {
        app.get('/api/data/download', async (req, res) => {

            const key = req.query.key as string;

            if(!this.authorizeKey(key))
            {
                res.status(500).json({ error: "Invalid key" });
                return;
            }

            const outputZipFile = path.join(PATH_UPLOADS, "data.zip");

            await zipFolder(PATH_DATA, outputZipFile);

            res.download(outputZipFile, () => {
                console.log("file downloaded!");

                fs.unlinkSync(outputZipFile);
            });
        });


        app.post('/api/data/upload', this.upload.array("file"), (req: any, res) => {

            const key = req.body.key;

            if(!this.authorizeKey(key))
            {
                for (const file of req.files)
                {
                    fs.unlinkSync(file.path); // Deleta os arquivos enviados
                }

                res.status(500).json({ error: "Invalid key" });
                return;
            }

            const file = req.files[0];
  
            console.log(file);
  
            const zipPath = file.path;
            const outputDir = PATH_DATA;
  
            fs.rmSync(PATH_DATA, { recursive: true });
            fs.mkdirSync(PATH_DATA);
  
            fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: outputDir }))
            .on("close", () => {
                console.log("Arquivos extraídos para:", outputDir);
  
                fs.unlinkSync(zipPath);
  
                res.json({ message: "Arquivo enviado e extraído com sucesso!" });
            })
            .on("error", (err: any) => {
                console.error("Erro ao extrair:", err);
  
                fs.unlinkSync(zipPath);
  
                res.status(500).json({ error: "Erro ao extrair o arquivo ZIP" });
            });
        });
    }
}

function zipFolder(sourceFolder: string, outputFilePath: string)
{
    return new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(outputFilePath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Configura o nível de compressão
      });
  
      output.on("close", () => {
        console.log(`Arquivo .zip criado com sucesso! ${archive.pointer()} bytes escritos.`);
        resolve();
      });
  
      archive.on("error", (err: any) => reject());
  
      archive.pipe(output);
  
      // Adiciona a pasta ao arquivo .zip
      archive.directory(sourceFolder, false);
  
      // Finaliza o processo
      archive.finalize();
    });
  }
const node: string = process.versions.node;
console.log("node:", node);

//fix issue where ReadableStream is not available in node 16
import { ReadableStream } from "web-streams-polyfill";;
const _globalThis: any = globalThis;
_globalThis.ReadableStream = ReadableStream;
//

import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import fs from 'fs';

import { AppManager } from "./app/appManager";
import { DiscordBot } from "./discordBot";
import { PATH_CLIENT, PATH_DATA, PATH_PUBLIC } from "./paths";
import { Aternos } from './aternos';
import { Log } from './log';
import { SteamBot } from './steamBot';
import { Suggestions } from './suggestions/suggestions';

loadEnvs();

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;

console.log("[index] mode: " + (isDevelopment ? "DEV" : "PRODUCTION"));

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

const appManager: AppManager = new AppManager();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

function main()
{
    console.log("[index] main");

    if(!fs.existsSync(PATH_DATA)) fs.mkdirSync(PATH_DATA);
    
    setupExpressApp();

    const autoLoginDiscordBot = true;

    appManager.addApp(new Suggestions("Suggestions", app, upload));
    appManager.addApp(new DiscordBot("DiscordBot", autoLoginDiscordBot));
    appManager.addApp(new SteamBot("SteamBot"));
    appManager.addApp(new Log("Log", app, <DiscordBot>appManager.getApp("DiscordBot")));

    appManager.addApp(new Aternos("Aternos", app));

    appManager.load();

    setupExpressRoutes();

    appManager.start();
}

function loadEnvs()
{
    require("./env")(`${PATH_DATA}/env.json`)
}

function setupExpressApp()
{
    const bodyParser = require('body-parser');
    const cors = require('cors');

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(cors({
        origin: '*'
    }));

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    
    //socket

    io.attach(server, {
        path: '/socket',
        cors: { origin: '*' }
    });
    
    io.on('connection', function (socket) {
        console.log("[index] new socket connection")
    });

    //
    //

    server.listen(port, () => console.log(`[index] express web server started on port :${port}`));
}

function setupExpressRoutes()
{
    app.use(express.static(PATH_PUBLIC));
    app.use(express.static(PATH_CLIENT));

    app.get("/api", (req, res) => res.json({ message: "Hello from server! " + new Date().getTime() }) );

    app.get("*", (req, res, next) => {

        if(req.url.startsWith("/favicon.ico") || req.url.startsWith("/assets/")) {

        } else {
            console.log(`[index] Request: '${req.url}'`);
        }

        next();
    })

    app.get("/cafemania", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "cafemania", "index.html")) );
    app.get("/game", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "game", "index.html")) );
    app.get("/voicechat", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "voicechat", "index.html")) );
    app.get("/aternos", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "aternos", "index.html")) );

    app.get("/notapi", (req, res) => res.json({ message: "Hello from server! " + new Date().getTime() }) );

    app.get("*", (req, res) => res.sendFile(path.join(PATH_CLIENT, "index.html")));

}

main();

/*
import mouseGame from './mouseGame'
import Chat from "./chat";

const mouse_game = mouseGame(io.of('/api/mousegame'));
const chat = new Chat(io.of('/api/chat'));
*/
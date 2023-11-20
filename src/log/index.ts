import { DiscordBot } from "../discordBot";
import { App } from "../app/app";
import express from 'express';
import { LogTest } from "./test";

interface ILog {
    service: string
    address: string
    message: string
    isLocal: boolean
    sendDiscordMessage: boolean
    time: number
}

const serviceChannels = [
    ["crab-game-mod", "979150398558466058"],
    ["redactle-pt", "979150364169355346"]
]

export class Log extends App {
    private _logs: ILog[] = [];
    private _discordBot: DiscordBot;
    private _app: express.Application;

    constructor(id: string, app: express.Application, discordBot: DiscordBot)
    {
        super(id);

        this._app = app;
        this._discordBot = discordBot;
    }

    public load()
    {
        super.load();

        this.setupRoutes(this._app);
    }

    private setupRoutes(app: express.Application)
    {
        console.log(`[Log] setupRoutes`);

        app.get("/api/log", (req, res) => {
            console.log("at /api/log")

            let str = ""; 
            for (const log of this._logs) {
                str += `${this.formatLogMessage(log)}\n`
            }

            res.end(str);
        });

        app.get("/api/log/test", (req, res) => {

            LogTest.log("127.0.0.1", "message", true, true)

            res.end("sent");
        });

        app.post("/api/log/add", (req, res) => {
            console.log('got post request at /api/log/add')

            const body = req.body;

            console.log(req.body)

            const service: string | undefined = typeof body.service == "string" ? body.service : undefined;
            const address: string | undefined = typeof body.address == "string" ? body.address : undefined;
            const message: string | undefined = typeof body.message == "string" ? body.message : undefined;
            const sendPing: boolean = typeof body.sendPing == "boolean" ? body.sendPing : false;
            const isLocal: boolean = typeof body.isLocal == "boolean" ? body.isLocal : false;
            
            if(service && address)
            {
                const log = this.add(service, address, message ? message : "", sendPing, isLocal);
            }

            res.send(req.body);    // echo the result back
        });
    }

    public add(service: string, address: string, message: string, sendDiscordMessage: boolean, isLocal: boolean)
    {
        const log: ILog = {
            service: service,
            address: address,
            message: message,
            sendDiscordMessage: sendDiscordMessage,
            isLocal: isLocal,
            time: Date.now()
        }

        this._logs.push(log);

        if(sendDiscordMessage)
        {
            this.sendDiscordLogMessage(log);
        }
    }

    private sendDiscordLogMessage(log: ILog)
    {
        const discordBot = this._discordBot;
        const msg = this.formatLogMessage(log);

        for (const sc of serviceChannels) {
            if(sc[0] == log.service) {
                discordBot.sendChannelMessage(sc[1], msg);
                return;
            }
        }

        discordBot.sendOwnerMessage(msg);
    }
  
    private formatLogMessage(log: ILog) {
        return `[${this.formatTime(new Date(log.time))} - ${log.service}] (${log.address}) ${log.message}${log.isLocal ? ` (local)` : ""}`;
    }

    public formatTime(date: Date) {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset*60*1000))
        const s = date.toISOString().split('T');
        const timeStr = `${s[0]} ${s[1].split(".")[0]}`;
        return timeStr;
    }
}
import { App } from "../app/app";
import express from 'express';

enum STATUS {
    OFF,
    WAITING_FOR_START,
    STARTING,
    ON
}

enum SCRIPT_STATUS {
    OFF,
    STARTING,
    ON,
    STOPPING
}

export class Aternos extends App {
    public status: STATUS = STATUS.OFF;
    public needsToStart: boolean = true;
    public consoleMessage: string = "";
    public timeLeft: string = "";

    private _app: express.Application;

    constructor(id: string, app: express.Application)
    {
        super(id);

        this._app = app;
    }

    public load()
    {
        super.load();

        this.setupRoutes(this._app);
    }

    public setupRoutes(app: express.Application)
    {
        console.log("[Aternos] setupRoutes");

        app.post("/api/aternos/start", (req, res) => {
            console.log("[aternos] trying to start server");

            this.status = STATUS.WAITING_FOR_START;

            this.needsToStart = true;

            res.end();
        });

        app.post("/api/aternos/clientData", (req, res) => {
            //console.log("[aternos] client data", req.body)

            const data = req.body;

            this.consoleMessage = data.console;
            this.timeLeft = data.time;

            if(data.status == SCRIPT_STATUS.OFF)
            {
                this.status = STATUS.OFF;
            }

            if(data.status == SCRIPT_STATUS.STARTING)
            {
                this.status = STATUS.STARTING;
            }

            if(data.status == SCRIPT_STATUS.ON)
            {
                this.status = STATUS.ON;
            }

            res.json({start: this.needsToStart});

            if(this.needsToStart)
            {
                this.needsToStart = false;
                this.status = STATUS.STARTING;

                console.log("[aternos] starting server on client")
            }
        });

        app.get("/api/aternos/status", (req, res) => {
            res.json({
                status: this.status,
                consoleMessage: this.consoleMessage,
                timeLeft: this.timeLeft
            })
        });
    }
}
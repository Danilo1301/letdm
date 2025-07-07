import { App } from "../app/app";
import fs from 'fs'
import express from 'express';
import { PATH_DATA } from "../paths";

const PATH_VIDEOS_JSON = PATH_DATA + "/videos.json";

export interface Video
{
    id: string
    channel: string
    title: string
    progress: number
}

export class WatchedVideos extends App
{
    public Videos = new Map<string, Video>();

    constructor(id: string, app: express.Application,)
    {
        super(id);

        this.setupRoutes(app);
    }

    public start()
    {
        super.start();

        console.log("[WatchedVideos] start");

        this.loadVideos();
    }

    public loadVideos()
    {
        if(!fs.existsSync(PATH_VIDEOS_JSON)) return;

        const videos: Video[] = JSON.parse(fs.readFileSync(PATH_VIDEOS_JSON, "utf-8"));

        this.Videos.clear();

        for(const video of videos)
        {
            this.Videos.set(video.id, video);
        }
    }

    public saveVideos()
    {
        const videos = Array.from(this.Videos.values());

        fs.writeFileSync(PATH_VIDEOS_JSON, JSON.stringify(videos));
    }
    

    public authorizeKey(key: string)
    {
        return key === process.env["LETDM_KEY"];
    }

    public setupRoutes(app: express.Application)
    {
        app.get("/api/videos/all", (req, res) => {
            
            res.json(Array.from(this.Videos.values()));   
        });

        app.post("/api/videos/process", (req, res) => {

            const body = req.body;
            
            console.log(`Recebido '/api/videos/process'`);

            if(!Array.isArray(body))
            {
                console.log(`Body invalido`);
                console.log(body);

                res.status(400).send({
                    error: "Invalid body"
                });
                return;
            }

            const response: string[] = [];

            for(const json of body)
            {
                const id = json.id as string | undefined;
                const title = json.title as string | undefined;
                const progress = json.progress as number | undefined;
                const channel = json.channel as string | undefined;

                if(id == undefined || title == undefined || progress == undefined || channel == undefined)
                {
                    console.log(`Missing information`);
                    console.log(body);

                    res.status(400).send({
                        error: "Missing information"
                    });
                    return;
                }

                let video: Video = {
                    id: id,
                    channel : channel,
                    title: title,
                    progress: progress
                }
                
                if(!this.Videos.has(id))
                {
                    this.Videos.set(id, video);

                    console.log(`[WatchedVideos] Novo video adicionado ${video.title}`);
                }

                video = this.Videos.get(id)!;
                video.progress = progress;

                if(video.progress > 0)
                {
                    response.push(id);
                }
            }
            
            this.saveVideos();

            res.json(response);

        });
    }
}
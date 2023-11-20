import express from 'express';
import { DiscordBot } from '../discordBot';
import GameLog from 'src/log';
import { PATH_DATA } from 'src/paths';
import path from 'path';
import fs from 'fs';

const PATH_NOTES = path.join(PATH_DATA, "notes")

class Notes {
    private _notes: Map<string, string> = new Map<string, string>();
    private _log: GameLog;

    constructor(app: express.Application, log: GameLog) {
        console.log(`[notes] constructor`);

        this._log = log;

        this.loadNotes();
        this.setupRoutes(app);
    }

    public setupRoutes(app: express.Application)
    {
        app.get("/api/notes", (req, res) => {
            this.loadNotes();

            res.send(Array.from(this._notes.keys()));   
        });

        app.get("/api/note/:note", (req, res) => {
            const noteId = req.params.note;

            if(!this._notes.has(noteId))
            {
                res.send({content: null})
                return;
            }

            this._log.add("notes", "", `Open note '${noteId}'`, true, false);

            res.send({content: this._notes.get(noteId)});   
        });
    }

    public loadNotes()
    {
        console.log(`[notes] loadNotes`);

        this._notes.clear();

        if(!fs.existsSync(PATH_NOTES)) fs.mkdirSync(PATH_NOTES);

        const noteFiles = fs.readdirSync(PATH_NOTES);

        for(const file of noteFiles)
        {
            const key = file.replace(".txt", "")
            const data = fs.readFileSync(path.join(PATH_NOTES, file), 'utf-8');

            console.log(`[notes] loading note '${key}'`);

            this._notes.set(key, data)
        }
    }
}

export default Notes;
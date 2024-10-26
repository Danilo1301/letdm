import { App } from "../app/app";
import fs from 'fs'
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Key_PostBody, NewSugestion_PostBody, RetrieveUserInfo_PostBody, RetrieveUserInfo_Response } from "../interfaces";
import { PATH_DATA } from "../paths";
import { Suggestion } from "./suggestion";

const PATH_SUGGESTIONS_JSON = PATH_DATA + "/suggestions.json";

export class Suggestions extends App {

    public upload: any;

    private _suggestions = new Map<string, Suggestion>();

    constructor(id: string, app: express.Application, upload: any)
    {
        super(id);

        this.upload = upload;

        this.setupRoutes(app);
        this.loadSuggestions();
    }

    public start()
    {
        super.start();

        console.log("[Suggestions] start");

        /*
        const suggestion = this.createNewSuggestion();
        suggestion.title = "Giroflex, muito importante"
        suggestion.tags.push("Mod Giroflex");
        suggestion.priorityTags.push("Prioridade alta");

        const suggestion2 = this.createNewSuggestion();
        suggestion2.title = "Nao mt importante"
        suggestion2.priorityTags.push("Prioridade baixa");

        const suggestion3 = this.createNewSuggestion();
        suggestion3.title = "Nao mt importante"
        suggestion3.priorityTags.push("Prioridade baixa");
        */
    }

    public saveSuggestions()
    {
        const suggestions = Array.from(this._suggestions.values());

        fs.writeFileSync(PATH_SUGGESTIONS_JSON, JSON.stringify(suggestions));
    }

    public loadSuggestions()
    {
        if(!fs.existsSync(PATH_SUGGESTIONS_JSON)) return;

        const suggestions: Suggestion[] = JSON.parse(fs.readFileSync(PATH_SUGGESTIONS_JSON, "utf-8"));

        this._suggestions.clear();

        for(const suggestion of suggestions)
        {
            this._suggestions.set(suggestion.id, suggestion);
        }
    }

    public isSubAdmin(sub: string)
    {
        if(sub == process.env["ADMIN_GOOGLE_SUB"])
        {
            return true;
        }
        return false;
    }

    public authorizeKey(key: string)
    {
        return key === process.env["LETDM_KEY"];
    }

    public hasSuggestion(id: string)
    {
        return this._suggestions.has(id);
    }

    public setupRoutes(app: express.Application)
    {
        app.get("/api/suggestions", (req, res) => {
            console.log("get suggestions");

            res.send(Array.from(this._suggestions.values()));   
        });

        app.get("/api/suggestions/:id", (req, res) => {
            const id = req.params.id;

            if(!this.hasSuggestion(id))
            {
                res.status(400).send({
                    error: "Suggestion ID not found"
                });
                return
            }

            res.send(this._suggestions.get(id));   
        });

        app.post("/api/suggestions/userInfo", (req, res) => {
            console.log("userInfo post");

            const body: RetrieveUserInfo_PostBody = req.body;

            if(!body.sub)
            {
                res.status(400).send({
                    error: "'sub' is not defined"
                });
                return;
            }

            const response: RetrieveUserInfo_Response = {
                isAdmin: false
            }

            if(this.isSubAdmin(body.sub))
            {
                response.isAdmin = true;
            }

            res.send(response);   
        });
        
        app.post("/api/suggestions/new", (req, res) => {
            const body: NewSugestion_PostBody = req.body;
            
            console.log(body);

            if(!this.authorizeKey(body.key))
            {
                res.status(400).send({
                    error: "Invalid KEY"
                });
                return;
            }
            
            if(!body.sub)
            {
                res.status(400).send({
                    error: "'sub' is not defined"
                });
                return;
            }

            if(!this.isSubAdmin(body.sub))
            {
                res.status(400).send({
                    error: "No permission"
                });
                return;
            }
            
            const suggestion = this.createNewSuggestion();
            suggestion.title = body.suggestion.title;
            suggestion.username = body.suggestion.username;
            suggestion.content = body.suggestion.content;
            suggestion.tags = body.suggestion.tags;
            suggestion.priorityTags = body.suggestion.priorityTags;
            suggestion.dateAdded = body.suggestion.dateAdded;

            this.saveSuggestions();

            res.send({id: suggestion.id});   
        });

        app.post("/api/suggestions/:id/edit", (req, res) => {
            const body: NewSugestion_PostBody = req.body;
            const id = req.params.id;

            const suggestion = this._suggestions.get(id);

            if(!suggestion)
            {
                res.status(400).send({
                    error: "Sugestion ID not found"
                });
                return;
            }

            if(!this.authorizeKey(body.key))
            {
                res.status(400).send({
                    error: "Invalid KEY"
                });
                return;
            }

            if(!body.sub)
            {
                res.status(400).send({
                    error: "'sub' is not defined"
                });
                return;
            }

            if(!this.isSubAdmin(body.sub))
            {
                res.status(400).send({
                    error: "No permission"
                });
                return;
            }

            suggestion.title = body.suggestion.title;
            suggestion.username = body.suggestion.username;
            suggestion.content = body.suggestion.content;
            suggestion.tags = body.suggestion.tags;
            suggestion.priorityTags = body.suggestion.priorityTags;
            suggestion.dateAdded = body.suggestion.dateAdded;
            
            this.saveSuggestions();

            res.send({id: id});   
        });

        app.post('/api/suggestions/:id/delete', (req, res) => {
            const id = req.params.id;
            const body: Key_PostBody = req.body;

            if(!this.hasSuggestion(id))
            {
                res.status(400).send({
                    error: "Sugestion ID not found"
                });
                return;
            }

            if(!this.authorizeKey(body.key))
            {
                res.status(400).send({
                    error: "Invalid KEY"
                });
                return;
            }
        
            this._suggestions.delete(id);

            this.saveSuggestions();
        
            res.json({ message: "Deleted!" });
        });

        app.get('/api/downloadSuggestionsDataFile', (req, res) => {
            const file = PATH_SUGGESTIONS_JSON;
            res.download(file);
        });

        app.post('/api/uploadSuggestionsDataFile', this.upload.array("file"), (req: any, res) => {
            console.log(req.body);
            console.log(req.files);
            
            const key = req.body.key;
            
            const file = req.files[0];

            if(!this.authorizeKey(key))
            {
                fs.rmSync(file.path);

                res.status(400).send({
                    error: "Invalid KEY"
                });
                return;
            }
        
            if(fs.existsSync(PATH_SUGGESTIONS_JSON)) fs.rmSync(PATH_SUGGESTIONS_JSON);
            fs.renameSync(file.path, PATH_SUGGESTIONS_JSON);
        
            this.loadSuggestions();
        
            res.json({ message: "Successfully uploaded file" });
        });
    }

    public createNewSuggestion()
    {
        const suggestion: Suggestion = {
            id: uuidv4(),
            title: "Sugestion title",
            username: "By user",
            content: "Content here",
            tags: [],
            priorityTags: [],
            dateAdded: new Date().getTime()
        };
        
        this._suggestions.set(suggestion.id, suggestion);

        return suggestion;
    }
}
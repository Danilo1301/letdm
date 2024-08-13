import { App } from "../app/app";
import fs from 'fs'
import express from 'express';
import { Key_PostBody, NewSugestion_PostBody, RetrieveUserInfo_PostBody, RetrieveUserInfo_Response } from "../interfaces";
import { PATH_DATA } from "../paths";
import { Suggestion } from "./suggestion";

const PATH_SUGGESTIONS_JSON = PATH_DATA + "/suggestions.json";

export class Suggestions extends App {

    public upload: any;

    private _suggestions: Suggestion[] = [];

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
        const suggestions = this._suggestions;

        fs.writeFileSync(PATH_SUGGESTIONS_JSON, JSON.stringify(suggestions));
    }

    public loadSuggestions()
    {
        const suggestions: Suggestion[] = JSON.parse(fs.readFileSync(PATH_SUGGESTIONS_JSON, "utf-8"));

        this._suggestions = suggestions;
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

    public hasSuggestion(index: number)
    {
        if(index >= 0 && index < this._suggestions.length)
        {
            return true;
        }
        return false;
    }

    public setupRoutes(app: express.Application)
    {
        app.get("/api/suggestions", (req, res) => {
            console.log("get suggestions");

            res.send(Array.from(this._suggestions));   
        });

        app.get("/api/suggestions/:id", (req, res) => {
            const id = parseInt(req.params.id);

            if(!this.hasSuggestion(id))
            {
                res.status(400).send({
                    error: "Suggestion ID not found"
                });
                return
            }

            res.send(this._suggestions[id]);   
        });

        app.post("/api/suggestions/userInfo", (req, res) => {
            console.log("userInfo post");

            const body: RetrieveUserInfo_PostBody = req.body;

            if(!body.sub)
            {
                return res.status(400).send({
                    error: "'sub' is not defined"
                });
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
                return res.status(400).send({
                    error: "Invalid KEY"
                });
            }
            
            if(!body.sub)
            {
                return res.status(400).send({
                    error: "'sub' is not defined"
                });
            }

            if(!this.isSubAdmin(body.sub))
            {
                return res.status(400).send({
                    error: "No permission"
                });
            }
            
            const suggestion = this.createNewSuggestion();
            suggestion.title = body.suggestion.title;
            suggestion.username = body.suggestion.username;
            suggestion.content = body.suggestion.content;
            suggestion.tags = body.suggestion.tags;
            suggestion.priorityTags = body.suggestion.priorityTags;

            this.saveSuggestions();

            const index = this._suggestions.indexOf(suggestion);

            res.send({id: index});   
        });

        app.post("/api/suggestions/:id/edit", (req, res) => {
            const body: NewSugestion_PostBody = req.body;
            const id = parseInt(req.params.id);

            if(!this.hasSuggestion(id))
            {
                return res.status(400).send({
                    error: "Sugestion ID not found"
                });
            }

            if(!this.authorizeKey(body.key))
            {
                return res.status(400).send({
                    error: "Invalid KEY"
                });
            }

            if(!body.sub)
            {
                return res.status(400).send({
                    error: "'sub' is not defined"
                });
            }

            if(!this.isSubAdmin(body.sub))
            {
                return res.status(400).send({
                    error: "No permission"
                });
            }

            const suggestion = this._suggestions[id];
            suggestion.title = body.suggestion.title;
            suggestion.username = body.suggestion.username;
            suggestion.content = body.suggestion.content;
            suggestion.tags = body.suggestion.tags;
            suggestion.priorityTags = body.suggestion.priorityTags;

            this.saveSuggestions();

            res.send({id: id});   
        });

        app.post('/api/suggestions/:id/delete', (req, res) => {
            const id = parseInt(req.params.id);
            const body: Key_PostBody = req.body;

            if(!this.hasSuggestion(id))
            {
                return res.status(400).send({
                    error: "Sugestion ID not found"
                });
            }

            if(!this.authorizeKey(body.key))
            {
                return res.status(400).send({
                    error: "Invalid KEY"
                });
            }
        
            this._suggestions.splice(id, 1);

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

                return res.status(400).send({
                    error: "Invalid KEY"
                });
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
            title: "Sugestion title",
            username: "By user",
            content: "Content here",
            tags: [],
            priorityTags: []
        };
        

        this._suggestions.push(suggestion);

        return suggestion;
    }
}
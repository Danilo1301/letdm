export class App {
    private _id: string;

    public get id() { return this._id; }

    constructor(id: string) {
        this._id = id;
    }

    public preload()
    {
        //console.log("[App : " + this.id + "] preload")
    }

    public load()
    {
        //console.log("[App : " + this.id + "] load")
    }

    public start()
    {
        //console.log("[App : " + this.id + "] start")
    }
}


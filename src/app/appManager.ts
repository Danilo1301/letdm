import { App } from "./app";

export class AppManager {
    private _apps: Map<string, App> = new Map<string, App>();

    public addApp(app: App)
    {
        this._apps.set(app.id, app);
    }

    public load()
    {
        console.log(`[AppManager] load`);

        const apps = Array.from(this._apps.values());

        for(const app of apps) app.load();
    }

    public start()
    {
        console.log(`[AppManager] start`);

        const apps = Array.from(this._apps.values());

        for(const app of apps) app.start();
    }

    public getApp(id: string): App | undefined
    {
        return this._apps.get(id);
    }
}
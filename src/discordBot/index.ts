import { App } from "../app/app";
import { Client, ClientOptions } from 'discord.js';

export class DiscordBot extends App {
    public static DEFAULT_CHANNEL = "663429290846847007";
    public static UPTIME_CHANNEL = "1272947207959744654";

    private _client: Client;
    private _autoLogin: boolean = false;
    private _loggedIn: boolean = false;

    public get client() { return this._client; }

    constructor(id: string, autoLogin: boolean)
    {
        super(id);

        this._autoLogin = autoLogin;
        
        const options: any = {intents: 0};
        //intents: BitFieldResolvable<GatewayIntentsString, number>;
        
        this._client = new Client(options);

        this.setupListeners();
        
    }

    public start()
    {
        super.start();

        console.log("[DiscordBot] start");
        
        if(this._autoLogin) this.login();
    }

    private setupListeners()
    {
        const client = this._client;
        const self = this;

        client.on('message', (msg: any) => {
            console.log(`[DiscordBot] Message: ${msg.content}`);
            
            //msg.reply(msg.content);
        });

        client.on('ready', () => {
            const user = client.user!;

            self._loggedIn = true;

            console.log(`[DiscordBot] Logged in as ${user.tag}!`);

            //user.setStatus('invisible');

            this.sendUptimeMessage("Bot is up");
        });
    }

    public sendOwnerMessage(message: string)
    {
        this.sendChannelMessage(DiscordBot.DEFAULT_CHANNEL, message);
    }

    public sendUptimeMessage(message: string)
    {
        this.sendChannelMessage(DiscordBot.UPTIME_CHANNEL, message);
    }

    public sendChannelMessage(channelId: string, message: string)
    {
        console.log(`[DiscordBot] Sending '${message}' to channel ${channelId}`);

        if(!this._loggedIn)
        {
            console.log(`[DiscordBot] Error: not logged in`)
            return;
        }

        this.client.channels.fetch(channelId).then((channel: any) => {
            channel!['send'](message);
        })
    }

    public login()
    {
        const token = process.env["DISCORD_TOKEN"];
        this.client.login(token).then(() => {
            console.log("[DiscordBot] login")
        }).catch(console.error);
    }
}
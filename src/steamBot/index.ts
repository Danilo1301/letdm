import { App } from "../app/app";

const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');

export class SteamBot extends App {
    public get client() { return this._client; }

    private _client;

    constructor(id: string)
    {
        super(id);

        const client = this._client = new SteamUser();

        client.on('loggedOn', () => {
            console.log("[steamBot] Logged in");
            
            client.setPersona(SteamUser.EPersonaState.Online);
            client.gamesPlayed(730);

            this.sendOwnerChatMessage("Bot is up");
        });

        client.on('error', function (err: any) {
            console.log(`[steamBot] Error: ${err}`);
        });

        client.on("friendMessage", function(steamID: string, message: string) {
            console.log("[steamBot] Friend message from " + steamID + ": " + message);
            
            client.chatMessage(steamID, message)
        });
    }

    public start()
    {
        super.start();

        console.log("[SteamBot] start");

        this.login();
    }

    public login()
    {
        const code = SteamTotp.generateAuthCode(process.env.STEAM_SHARED_SECRET);

        console.log(`[SteamBot] login cancelled, code: ${code}`);

        return;

        //console.log(process.env.STEAM_SHARED_SECRET)
        //console.log(code)

        const logOnOptions = {
            accountName: process.env.STEAM_USERNAME,
            password: process.env.STEAM_PASSWORD,
            twoFactorCode: code
        };

        this.client.logOn(logOnOptions);
    }

    public sendOwnerChatMessage(message: string) {
        const ownerId = process.env['STEAM_OWNER_ID'];
        this.sendChatMessage(ownerId!, message);
    }

    public sendChatMessage(steamId: string, message: string) {
        this.client.chatMessage(steamId, message)
    }
}
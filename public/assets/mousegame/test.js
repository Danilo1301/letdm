class WorldText {
    text = '';
    position = {x: 0, y: 0}

    constructor(text, x, y) {
        this.text = text;
        this.position.x = x;
        this.position.y = y;
    }

    render() {
        var ctx = Render.ctx;

        ctx.fillStyle = "#000000"
        ctx.fillText(this.text, 0, 0)
    }
}

class App {
    static players = [];
    static player;
    static worldTexts = [];

    static main() {
        Network.onConnect = function() {
            document.body.style.margin = "0px"

            App.playerId = Network.socket.id;

            Input.main();
            Render.main();

            //App.addWorldText("[ Spawn ]", 0, 0);
            App.addWorldText("Mouse to move", 0, -20);
            App.addWorldText("I'll fix this later (probably..)", 0, -40);


            App.player = App.addPlayer(App.playerId);

            App.createBot('Bot 1', 300, -300);
            App.createBot('Bot 2', 300, -300);

            setInterval(App.loop.bind(App), 1);
        }

        Network.init();
    }

    static loop() {
        this.update();
        Network.update();

        Render.render();
    }

    static update() {
        App.player.keys['left'] = Input.isKeyDown('a');
        App.player.keys['right'] = Input.isKeyDown('d');
        App.player.keys['up'] = Input.isKeyDown('w');
        App.player.keys['down'] = Input.isKeyDown('s');

        App.player.position.x = Input.mousePosition.x;
        App.player.position.y = -Input.mousePosition.y;

        for (const player of this.players) {
            player.update();
        }
    }

    static addPlayer(id) {
        var player = new Player();
        player.id = id;
        player.worldText = this.addWorldText(id, 0, 0);
        this.players.push(player);
        return player;
    }

    static createBot(id, x, y) {
        var bot = App.addPlayer(id);

        bot.position.x = x;
        bot.position.y = y;

        setInterval(() => {
            bot.keys.left = Math.random() > 0.5;
            bot.keys.right = Math.random() > 0.5;
            bot.keys.up = Math.random() > 0.5;
            bot.keys.down = Math.random() > 0.5;
        }, 200)
    }

    static addWorldText(text, x, y) {
        var worldText = new WorldText(text, x, y);
        this.worldTexts.push(worldText);
        return worldText;
    }
}

class Network {
    static onConnect;
    static serverUrl = "https://dmdassc.glitch.me";
    //static serverUrl = "http://localhost:3000";
    static socket;
    static lastSent = 0;

    static init() {
        this.socket = io(this.serverUrl + '/api/mousegame', {path: '/socket'});

        this.socket.on("connect", function() {
            if(Network.onConnect) Network.onConnect();
        });

        this.socket.on("on_player_position", data => {
            //console.log('received on_player_position')
            //console.log(data)

            if(data.id == App.playerId) return;

            var player;

            for (const p of App.players) {
                if(p.id == data.id) { 
                    player = p;
                    break;
                }
            }

            if(!player) {
                player = App.addPlayer(data.id);
            }

            player.position.x = data.position.x
            player.position.y = data.position.y
        });
    }

    static update() {
        var now = new Date().getTime();

        if(now - this.lastSent >= 50) {
            this.lastSent = now;
            
            this.socket.emit('player_position', {position: App.player.position});

            //console.log("sent player_position")
        }
    }
}

class Render {
    static canvas = document.createElement("canvas");
    static ctx;

    static main() {
        var canvas = this.canvas;
        this.ctx = canvas.getContext('2d');

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'fixed'
        canvas.style.top = '0'
        canvas.style.pointerEvents = 'none'
        canvas.style.left = '0'
        canvas.style.zIndex = '-1'
        document.body.appendChild(canvas);
    }

    static render() {
        var canvas = this.canvas;
        var ctx = this.ctx;
        
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var pos = this.getCenterScreen();

        //ctx.translate(300, 300);


        //ctx.translate(pos.x, pos.y);
        //ctx.translate(-App.player.position.x, App.player.position.y);

   
        for (const player of App.players) {
            ctx.translate(player.position.x, -player.position.y);
            player.render();
            ctx.translate(-player.position.x, player.position.y);
        }

        for (const worldText of App.worldTexts) {
            ctx.translate(worldText.position.x, -worldText.position.y);
            worldText.render();
            ctx.translate(-worldText.position.x, worldText.position.y);
        }

        //ctx.translate(-pos.x, -pos.y);
    }

    static getCenterScreen() {
        return {x: this.canvas.width/2, y: this.canvas.height/2}
    }
}

class Input {
    static keys = {};
    static mousePosition = {};

    static main() {
        document.addEventListener('keydown', function(e) {
            if(document.activeElement.name == "input") return;

            console.log(e.key)

            Input.keys[e.key] = true;
        });

        document.addEventListener('keyup', function(e) {

            delete Input.keys[e.key];
        });

        document.addEventListener('mousemove', function(e) {
            Input.mousePosition.x = e.pageX;
            Input.mousePosition.y = e.pageY;
        });
    }

    static isKeyDown(key) {
        return this.keys[key] != undefined;
    }
}

class Player {
    id = "";
    image = new Image();
    position = {x: 0, y: 0}
    size = 30;
    keys = {
        up: false,
        down: false,
        left: false,
        right: false
    }
    speed = 1;
    worldText;

    constructor() {
        this.image.src = Network.serverUrl + '/assets/mousegame/player.png';
    }

    update() {
        if(this.keys.left) this.position.x -= 1 * this.speed;
        if(this.keys.right) this.position.x += 1 * this.speed;
        if(this.keys.up) this.position.y += 1 * this.speed;
        if(this.keys.down) this.position.y -= 1 * this.speed;

        this.worldText.position.x = this.position.x;
        this.worldText.position.y = this.position.y;
    }

    render() {
        var ctx = Render.ctx;

        ctx.fillStyle = "#ffff00"
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size)
        ctx.drawImage(this.image, -this.size/2, -this.size/2, this.size, this.size)
    }
}

App.main();




//App.canvas.requestPointerLock = App.canvas.requestPointerLock || App.canvas.mozRequestPointerLock;
//document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;


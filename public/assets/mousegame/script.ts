const phaser = document.createElement("script");
phaser.src = "https://cdn.jsdelivr.net/npm/phaser@3.54.0/dist/phaser.min.js";
document.body.appendChild(phaser);

phaser.onload = function() {
    console.log(window['dmdasscserverurl'])
    main();
}

function main() {
    let Phaser: any = window['Phaser'];

    //---------------------------------------------------------------




    
    var test;

    

    class MainScene extends Phaser.Scene {
        constructor (config) {
            super(config);
        }
    
        preload() {
            this.load.image('pic', 'someimagepath');
        }
    
        create() {
            console.log(this)
    
            test = this.add.image(this.game.canvas.width/2, this.game.canvas.height/2, 'pic');
            


            this.input.on('pointerdown', () => {
    
                this.scene.bringToTop();

                test.x -= 100;
    
            }, this);
        }
    
        update(time, delta) {
            test.x += 0.1 * delta;

            test.x = game.input.mousePointer.x;
            test.y = game.input.mousePointer.y;
        }
    }





    //---------------------------------------------------------------

    var config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
	    height: window.innerHeight,
        transparent: true,
        pixelArt: true,
        parent: 'phaser-example',
        scene: [ MainScene ]
    };
    
    var game = new Phaser.Game(config);

    var canvas = game.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '-1'

    document.addEventListener('mousemove', (e) => { game.input.onMouseMove(e) })
    document.body.style.margin = "0px"
}
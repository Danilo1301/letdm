var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var phaser = document.createElement("script");
phaser.src = "https://cdn.jsdelivr.net/npm/phaser@3.54.0/dist/phaser.min.js";
document.body.appendChild(phaser);
phaser.onload = function () {
    console.log(window['dmdasscserverurl']);
    main();
};
function main() {
    var Phaser = window['Phaser'];
    //---------------------------------------------------------------
    var test;
    var MainScene = /** @class */ (function (_super) {
        __extends(MainScene, _super);
        function MainScene(config) {
            return _super.call(this, config) || this;
        }
        MainScene.prototype.preload = function () {
            this.load.image('pic', 'someimagepath');
        };
        MainScene.prototype.create = function () {
            var _this = this;
            console.log(this);
            test = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, 'pic');
            this.input.on('pointerdown', function () {
                _this.scene.bringToTop();
                test.x -= 100;
            }, this);
        };
        MainScene.prototype.update = function (time, delta) {
            test.x += 0.1 * delta;
            test.x = game.input.mousePointer.x;
            test.y = game.input.mousePointer.y;
        };
        return MainScene;
    }(Phaser.Scene));
    //---------------------------------------------------------------
    var config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        transparent: true,
        pixelArt: true,
        parent: 'phaser-example',
        scene: [MainScene]
    };
    var game = new Phaser.Game(config);
    var canvas = game.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1'
    document.addEventListener('mousemove', function (e) { game.input.onMouseMove(e); });
    document.body.style.margin = "0px";
}

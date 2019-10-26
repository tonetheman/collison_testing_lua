
let game = null;
let dt = 1/60;

class Player {
    constructor(x,y,graphics) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.graphics = graphics;
        this.graphics.x = x;
        this.graphics.y = y;
        this.radius = 3;
        this.dying = false;
        this.mut = 0.1;
    }
    update() {
        this.x = this.x + (this.dx * dt);
        this.y = this.y + (this.dy * dt);

        if (this.x<0) {
            this.x = 0;
            this.dx *= -1
        }
        if (this.x>800) {
            this.x = 800;
            this.dx *= -1;
        }
        if (this.y<0) {
            this.y = 0;
            this.dy *= -1;
        }
        if (this.y>600) {
            this.y = 600;
            this.dy *= -1;
        }

        this.radius += this.mut;
        if (this.radius>25) {
            this.mut = -1;
        }
        if (this.radius<3) {
            this.mut = 1;
        }

        // erase the graphics
        this.graphics.fillStyle(0x000000,1);
        this.graphics.fillCircle(0,0,this.radius);

        // change the graphics
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.radius = this.radius;

        // redraw the graphics
        this.graphics.fillStyle(0xff0000,1);
        this.graphics.fillCircle(0,0,this.radius);


    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("game");
    }
    preload() {
        console.log("preload");
    }
    create() {
        this.players = [];
        for(let i=0;i<2;i++) {
            let p = new Player(800/2,600/2,this.add.graphics());
            p.dx = Phaser.Math.Between(-100,100);
            p.dy = Phaser.Math.Between(-100,100);
            this.players.push(p);
        }
        this.input.on("pointerup", (ptr) => {
            console.log(ptr);
            let p = new Player(ptr.x,ptr.y,this.add.graphics());
            p.dying = true;
        });
    }
    update() {
        //console.log("update")
        for(let i=0;i<this.players.length;i++) {
            let p = this.players[i];
            p.update();
        }
    }
}

function mainline() {
    let gameOpts = {
        width : 800,
        height : 600,
        scene : [GameScene]
    };
    game = new Phaser.Game(gameOpts);
}

window.onload = mainline;
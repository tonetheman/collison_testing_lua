let { init, Sprite, GameLoop, initPointer, initKeys, keyPressed, track, onPointerUp } = kontra;

let W = 600;
let H = 400;
let DEFAULT_DOTCOUNT = 30;
let DOTCOUNT = DEFAULT_DOTCOUNT;
let dt = 1/60.0;
let DEFAULT_RADIUS = 5;
let STATE_GAME_PRE_CLICK = 0;
let STATE_CLICKED = 1;
let GROW_RADIUS=40;
let DEFAULT_MUT = 0.8;

let state = STATE_GAME_PRE_CLICK; // we start out waiting on the click

let sound0 = [2,0.0096,0.27,0.1763,0.33,0.57,,,-0.0002,,,0.4152,0.6401,,0.2559,0.2165,-0.52,0.36,0.44,-0.0421,0.3,0.37,-0.4599,0.5];
let sound1 = [2,0.0096,0.27,0.1763,0.33,0.4,,,-0.0002,,,0.4152,0.6401,,0.2559,0.2165,-0.52,0.36,0.44,-0.0421,0.3,0.37,-0.4599,0.5];
let sound2 = [2,0.0096,0.27,0.1763,0.33,0.84,,,-0.0002,,,0.4152,0.6401,,0.2559,0.2165,-0.52,0.36,0.44,-0.0421,0.3,0.37,-0.4599,0.5];
//let sound1 = [2,0.1835,0.01,0.2173,0.4978,0.6106,,0.0038,-0.842,0.4824,,-0.9872,-0.0367,0.273,-0.2252,-0.8684,,-0.4874,0.947,0.8019,0.0755,0.0187,,0.5];
//let sound1 = [3,0.0656,0.0789,0.1388,0.437,0.1593,,0.0893,0.3823,,,-0.9409,,0.8039,0.0878,0.3856,-0.2214,0.7559,0.8714,-0.3454,-0.6375,,-0.0024,0.5];
let currentScene = null;
let gameScene = null;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getDxDy(n) {
  if (getRandomInt(10)<5) {
    return -1 * getRandomInt(n);
  }
  let res = getRandomInt(n);
  if (res>=0 && res<20) {
    res += 20;
  }
  if (res<0 && res<-20) {
    res -= 20;
  }
  return res;
}

class Text {
  constructor(x,y,msg) {
    this.sprite = Sprite({
      x : x,
      y : y,
      msg : msg,
      render : function() {
        this.context.fillStyle = "white";
        this.context.fillText(this.msg,this.x,this.y);
      }
    })
  }
  set(v) {
    this.sprite.msg=v;
  }
  render() {
    this.sprite.render();
  }
}

class Dot {
  constructor(x,y) {
    this.sprite = Sprite({
      x : x,
      y : y,
      dx : getDxDy(90),
      dy : getDxDy(90),
      radius : DEFAULT_RADIUS,
      color : "red",
      mut : DEFAULT_MUT,
      exploding : false,
      render : function() {
        if (this.radius<0) return;

        this.context.fillStyle = this.color;      
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
        this.context.fill();
      }
    })
  }
  pickColor() {
    let r = getRandomInt(10);
    if (r<2) {
      this.sprite.color = "blue";
    } else if (r<4) {
      this.sprite.color = "green";
    } else if (r<6) {
      this.sprite.color = "yellow";
    } else if (r<8) {
      this.sprite.color = "red";
    } else {
      this.sprite.color = "white";
    }
  }
  getExploding() {
    return this.sprite.exploding;
  }
  setExploding(v) {
    this.sprite.exploding = v;
  }
  setDxDy(dx,dy) {
    this.sprite.dx = dx;
    this.sprite.dy = dy;
  }
  setXYColor(x,y,color) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.color = color;
    this.sprite.color = color;
  }
  distTo(other) {
    let dx = this.sprite.x - other.sprite.x;
    let dy = this.sprite.y - other.sprite.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  hit(other) {
    if (this.distTo(other) <= this.sprite.radius + other.sprite.radius) {
      return true;
    }
    return false;
  }
  update() {
    this.sprite.x = this.sprite.x + (this.sprite.dx * dt);
    this.sprite.y = this.sprite.y + (this.sprite.dy * dt);

    if (this.sprite.x<0) {
        this.sprite.x = 0;
        this.sprite.dx *= -1
    }
    if (this.sprite.x>W) {
        this.sprite.x = W;
        this.sprite.dx *= -1;
    }
    if (this.sprite.y<0) {
        this.sprite.y = 0;
        this.sprite.dy *= -1;
    }
    if (this.sprite.y>H) {
        this.sprite.y = H;
        this.sprite.dy *= -1;
    }
    if (this.sprite.exploding) {
      this.sprite.radius += this.sprite.mut;
      if (this.sprite.radius>GROW_RADIUS) {
        this.sprite.mut = -1;
      }
      if (this.sprite.radius<=0) {
        this.sprite.x = -100;
        this.sprite.y = -100;
        this.sprite.exploding = false;
        this.radius = 1;
        // TODO: need to remove
      }
    }
  }
  render() {
    this.sprite.render();
  }
}

class LoadingScene {
  constructor() {

  }
  init() {

  }
  update() {

  }
  render() {

  }
  onPointerUp(e,obj) {

  }
}

class GameScene {
  constructor() {
  }
  
  init() {
    this.playSounds = false;
    this.score = 0;
    this.scoreGui = new Text(10,10,this.score);
    this.placeDots();
  }

  onPointerUp(e,obj) {
    if (state==STATE_GAME_PRE_CLICK) {
      let player = new Dot();
      player.setXYColor(e.x,e.y,"green")
      player.setDxDy(0,0);
      player.setExploding(true);
      this.dots.push(player);
      DOTCOUNT++;
      //this.score--;
    }  
  }
  
  play1() {

    // gross
    if (this.playSounds) {
      let r = getRandomInt(10)
      if (r<3) {
        let a = new Audio();
        a.src = jsfxr(sound1);
        a.play();
      } else if (r<6) {
        let a = new Audio();
        a.src = jsfxr(sound0);
        a.play();      
      } else {
        let a = new Audio();
        a.src = jsfxr(sound2);
        a.play();      
      }
  
    }

  }

  placeDots() {
    // resetting dot count
    DOTCOUNT = DEFAULT_DOTCOUNT;
    this.dots = [];
    for(let i=0;i<DOTCOUNT;i++) {
      //this.dots.push(new Dot(W/2,H/2));
      this.dots.push(new Dot(getRandomInt(W),getRandomInt(H)))
    }
  }

  resetGame() {
    this.score = 0;
    this.scoreGui = new Text(10,10,this.score);
    this.placeDots();
  }

  toggleSound() {
    if (this.playSounds) {
      this.playSounds = false;
    } else {
      this.playSounds = true;
    }
  }

  update() {
    if (keyPressed("r")) {
      // need to reset everything!
      this.resetGame();
    }
    if (keyPressed("s")) {
      this.toggleSound();
    }

    for(let i=0;i<DOTCOUNT;i++) {
      this.dots[i].update();
    }

    // now check if exploding needs to spread
    let exploding_count = 0;
    for (let i=0;i<DOTCOUNT;i++) {
      for (let j=0;j<DOTCOUNT;j++) {
        if (i!=j && this.dots[i].getExploding() && !this.dots[j].getExploding()) {
          // if this guy is exploding check
          if (this.dots[i].hit(this.dots[j])) {
            // they hit j should explode too
            this.dots[j].setExploding(true);
            this.dots[j].setDxDy(0,0); // stop forward movement
            this.dots[j].pickColor();
            exploding_count++;
            this.play1();
          }
        }
      }
    }
  
    this.score += exploding_count;
    this.scoreGui.set(this.score);
  
  }
  render() {
    for(let i=0;i<DOTCOUNT;i++) {
      this.dots[i].render();
    } 
    this.scoreGui.render();
  }
}

// global game routines
// calls down to scene
function initGame() {
  // setup all game scenes
  gameScene = new GameScene();

  // call init on all game scenes
  gameScene.init();

  // set current scene
  currentScene = gameScene;

}

function gameUpdate() {
  if (currentScene!=null) {
    currentScene.update();
  }
}

function gameRender() {
  if (currentScene!=null) {
    currentScene.render();
  }
}

function gameOnPointerUp(e,obj) {
  if (currentScene!=null) {
    currentScene.onPointerUp(e,obj);
  }
}
// end of globl game routines

function mainline() {

  let { canvas } = init();

  initKeys();

  initPointer();

  onPointerUp(function(e,obj) {
    gameOnPointerUp(e,obj);
  });

  initGame();

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
      gameUpdate();
    },
    render: function() { // render the game state
      gameRender();
    }
  });      

  loop.start();    // start the game
}

window.onload = mainline;
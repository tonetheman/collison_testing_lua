let { init, Sprite, GameLoop, initPointer, track, onPointerUp } = kontra;

let W = 600;
let H = 400;
let DOTCOUNT = 100;
let dt = 1/60.0;
let DEFAULT_RADIUS = 5;
let STATE_GAME_PRE_CLICK = 0;
let STATE_CLICKED = 1;
let GROW_RADIUS=40;

let state = STATE_GAME_PRE_CLICK; // we start out waiting on the click

let sound1 = [3,0.0656,0.0789,0.1388,0.437,0.1593,,0.0893,0.3823,,,-0.9409,,0.8039,0.0878,0.3856,-0.2214,0.7559,0.8714,-0.3454,-0.6375,,-0.0024,0.5];
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
      mut : 1,
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
        this.sprite.x = -10;
        this.sprite.y = -10;
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

/*
let PLAYERCOUNT = 3;
class SoundPlayer {
  constructor() {
    this.avail = [];
    this.players = [];
    for (let i=0;i<PLAYERCOUNT;i++) {
      let a = new Audio();
      a.src = jsfxr(sound1);
      this.players.push(a);
      this.avail.push(true);
    }
  }
  play() {
    // try one of the available players
    // if it does not work just forget it
    for (let i=0;i<PLAYERCOUNT;i++) {
      if (this.avail[i]) {
        this.avail[i] = false;
        let p = this.players[i].play();
        p.catch(e=>{
          console.log(e);
        });
        this.avail[i] = true;
      }
    }
  }
}
*/

class GameScene {
  constructor() {
  }
  init() {
    this.score = 0;
    this.scoreGui = new Text(10,10,this.score);

    //this.sp = new SoundPlayer();
    this.dots = [];
    for(let i=0;i<DOTCOUNT;i++) {
      this.dots.push(new Dot(W/2,H/2));
    }
    //this.a = new Audio();
    //this.a.src = jsfxr(sound1);
  }
  onPointerUp(e,obj) {
    if (state==STATE_GAME_PRE_CLICK) {
      let player = new Dot();
      player.setXYColor(e.x,e.y,"green")
      player.setDxDy(0,0);
      player.setExploding(true);
      this.dots.push(player);
      DOTCOUNT++;
    }  
  }
  play1() {
    // not working
    //this.sp.play();

    // working not doing what i want
    //this.a.play().catch(e=>{
    //  console.log(e);
    //})

    // better but messes up
    //this.a.src = jsfxr(sound1);
    //this.a.play();

    //this.a.src = jsfxr(sound1);
    //this.a.play().catch(e=>{
    //  console.log(e);
    //});

    // gross
    let a = new Audio();
    a.src = jsfxr(sound1);
    a.play();

  }
  update() {
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
let { init, Sprite, GameLoop, initPointer, track, onPointerUp } = kontra;

let W = 800;
let H = 600;
let DOTCOUNT = 50;
let dt = 1/60.0;
let DEFAULT_RADIUS = 5;
let STATE_GAME_PRE_CLICK = 0;
let STATE_CLICKED = 1;

let state = STATE_GAME_PRE_CLICK; // we start out waiting on the click

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getDxDy(n) {
  if (getRandomInt(10)<5) {
    return -1 * getRandomInt(n);
  }
  return getRandomInt(n);
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
        this.context.fillStyle = this.color;      
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
        this.context.fill();
      }
    })
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
    if (this.sprite.x>800) {
        this.sprite.x = 800;
        this.sprite.dx *= -1;
    }
    if (this.sprite.y<0) {
        this.sprite.y = 0;
        this.sprite.dy *= -1;
    }
    if (this.sprite.y>600) {
        this.sprite.y = 600;
        this.sprite.dy *= -1;
    }
    if (this.sprite.exploding) {
      this.sprite.radius += this.sprite.mut;
      if (this.sprite.radius>20) {
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


function mainline() {

  let dots = [];

  let { canvas } = init();

  initPointer();

  onPointerUp(function(e,obj) {
    if (state==STATE_GAME_PRE_CLICK) {

      let player = new Dot();
      player.setXYColor(e.x,e.y,"green")
      player.setDxDy(0,0);
      player.setExploding(true);
      dots.push(player);
      DOTCOUNT++;
    }
  });

  for(let i=0;i<DOTCOUNT;i++) {
    dots.push(new Dot(W/2,H/2));
  }
  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
      for(let i=0;i<DOTCOUNT;i++) {
        dots[i].update();
      }  
    },
    render: function() { // render the game state
      for(let i=0;i<DOTCOUNT;i++) {
        dots[i].render();
      }
    }
  });      

  loop.start();    // start the game
}

window.onload = mainline;
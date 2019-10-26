



function mainline() {
    console.log("mainline started...");

    let { init, Sprite, GameLoop } = kontra;
    let { canvas } = init();
    let sprite = Sprite({
        x: 100,        // starting x,y position of the sprite
        y: 80,
        radius : 5,
        color: 'red',  // fill color of the sprite rectangle
        dx: 2,          // move the sprite 2px to the right every frame
        render: function() {
            
            this.context.fillStyle = this.color;      
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
            this.context.fill();
            
          }
      });
      let loop = GameLoop({  // create the main game loop
        update: function() { // update the game state
          sprite.update();
      
          // wrap the sprites position when it reaches
          // the edge of the screen
          if (sprite.x > canvas.width) {
            sprite.x = -sprite.width;
          }
        },
        render: function() { // render the game state
          sprite.render();
        }
      });
      
      console.log("before game loop start...");
      loop.start();    // start the game
}

window.onload = mainline;
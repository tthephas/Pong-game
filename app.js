// Start of PONG game. First version

//////////   RULES FOR THE GAME /////////

// There will be two entities to start. A paddle(block, rectangle) for the player and a ball (square to start, circle later). Bonus feature later would be an actual computer player, which would be another paddle. 
// The player paddle will only move horizontally. At first it will be X size length, which will start off as very fair and easy. Later it will get shorter, to make the game tougher.
// The ball will be in constant motion. It will bounce off the walls, and most importantly the ceiiling/top of the game. If it gets to the bottom of the page it will disappear and player will lose (game over, BUT hoping to add 3 lives later). If the player gets their paddle under the ball, it will bounce off the paddle just like it does the wall. 
// The paddle will obviously need to be able to collide with the ball. The ball SHOULD bounce realistically off the paddle in the direction a ball normally would.
// The start screen shoudl resemble the game board and have a starting welcome message and also an instruction button/popup. The game will have an end screen after the player loses and a restart button. Bonus feature will be to keep their score , especially if it is thier high score, or the game high score. 
// Some bonus features. 1) Player has multiple lives. 2) High scores are stored and maybe listed. 3) Computer has a moving paddle. 4) After many levels beat, another ball or two appear to increase difficulty. 
/////////////////  END RULES //////////////

//////////// SETUP COMPONENTS ///////////////

// Grab some HTML elements for reference. Name them properly!!

const gameBoard = document.getElementById('canvas')
/// This will go away or disappear. Only here now to help track movement during game build. See the X Y coordinates in real time.
const movement = document.getElementById('movement')
// Create a status box. This will be a box to show messages. Example, you win, you lose, good luck. 
const message = document.getElementById('message')

//Testing a message in message box works. Can use innerText
//message.innerText ="hi is this working"

// Set the game context to 2D
// Save it to a variable to reference later. Using CTX
// Tells code to work within the context of the canvas
const ctx = gameBoard.getContext('2d')


// Reminders about coordinates. Top left x,y coordinates, are 0,0. Bottom right will flex with the window, but are found thru ctx.w for width and ctx.h for height.
// Will need the computed size of the canvas. Will refer to that later.
// Once we get size of canvas, we can use those to simulate moves differently


////////////    SETUP  ////////////////

gameBoard.setAttribute('width', getComputedStyle(gameBoard)['width'])
gameBoard.setAttribute('height', getComputedStyle(gameBoard)['height'])
// not sure what this was for from canvas crawler
gameBoard.height = 360


///////////    PADDLE AND BALL  //////////////

// These are slightly the same type objects so i'm going to use a class. The ball is square (circle later) and the paddle is rectangle. But both have movement needed, height , width, color , and coordinates.

class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        // Property to help with moving
        this.speed = 15
        // Add directions. The paddle can only move left and right. Leaving all four for now
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        //Movement handler. 
        // Gives the paddle direction properties. Can probably drop up and down later on. Only need left and right.
        this.movePlayer = function () {
            //send guy moving in dirx that is true
            if (this.direction.up) {
                this.y -= this.speed
                // Wall off the sides of the canvas
                if (this.y <= 0) {
                    this.y = 0
                }
            }
            if (this.direction.left) {
                this.x -= this.speed
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            //Account for the size of the paddle on left and right side
            if (this.direction.down) {
                this.y += this.speed
                if (this.y + this.height >= game.height) {
                    this.y = game.height - this.height
                }
            }
            if (this.direction.right) {
                this.x += this.speed
                if (this.x + this.width >= game.width) {
                    this.x = game.width - this.width
                }
            }
        }
        // This puts a player on board to start
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class Ball {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        // Property to help with moving
        this.speed = 15
        // Add directions. The ball can move all directions.
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        // Movement handler for ball
        // Will move in all directions
        this.movePlayer = function () {
            //Can maybe drop this later. A start button will send the ball moving
            if (this.direction.up) {
                this.y -= this.speed
                // Wall off sides of canvas
                if (this.y <= 0) {
                    this.y = 0
                }
            }
            if (this.direction.left) {
                this.x -= this.speed
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            //Size of ball/square should be small but might need to adjust later
            if (this.direction.down) {
                this.y += this.speed
                if (this.y + this.height >= game.height) {
                    this.y = game.height - this.height
                }
            }
            if (this.direction.right) {
                this.x += this.speed
                if (this.x + this.width >= game.width) {
                    this.x = game.width - this.width
                }
            }
        }
        // This puts a player on board to start
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

/////////     PLACE BALL AND PADDLE TO START  /////////

// Ball should start at same spot each game. Probably top middle is good. But can be left or right too.
// Paddle should start bottom middle, need to find those pixels 

const player = new Paddle(350, 350, 75, 25, white)
const ballOne = new Ball(350, 50, 25, 25, white)

player.render()
ballOne.render()


/////    COLLISION  DETECTION ///////////


// Detect a hit. In pong, the ball can hit any side. if it hits the bottom, the player loses. if it hits the paddle or any other side, the ball bounces
// To do this we need to account for the entire space that the ball takes up AND the paddle takes up. The sides should be similar but easier its its not a moving object
// Use the ball AND paddle x, y, width, height

const detectHit = (thing) => {
    //Use a big if statement to see if any side of the ball hits any side of the paddle or walls.
    if (ballOne.x < thing.x + thing.width
        && ballOne.x + ballOne.width > thing.x
        && ballOne.y < thing.y + thing.height
        && ballOne.y + ballOne.height > thing.y) {
        //use for testing only
        // console.log('hit!')

        //////// dont need this for now. no one is dying. but will need something later if ball hits bottom of screen to trigger game end
        //ogre disappears b/c of the render function in game loop
        //thing.alive = false
        //change the status box
        message.textContent = 'Ball hit paddle/wall'
    } 
}



///////   GAME LOOP   //////////////

// Player and paddle will start in static spot. When hit START button, player starts moving. For testing, will either manually move or have moving from start.
// Setup game loop function, attached to an interval. will use same interval as canvas crawler to begin. Will simulate animation on screen

const gameLoop = () => {
    //no console logs here if you can avoid it
    //for testing ok, but not in final
    console.log('its working')
    
    // To resemble real movement, clear board every loop so that it doesnt look like a snake and keep showing previous move. Simulates moving with no tracks
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height)


    ////  LEAVE FOR NOW FOR TESTING PURPOSES ////
    
    // Will need a hit detector later only for bottom of screen. When ball passes paddle, player loses. When ball hits paddle, it bounces off it.

    // Hit detector at top so it takes precedence
    if (ogre.alive) {
        ogre.render()
        detectHit(ogre)
    } else if (ogre2.alive) {
        message.textContent = "Now kill shrek 2"
        ogre2.render()
        detectHit(ogre2)
    } else { 
        message.textContent = "you win!"
        stopGameLoop
    }


    player.render()
    player.movePlayer()
    movement.textContent = `${player.x}, ${player.y}`
}


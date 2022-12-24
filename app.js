// Start of PONG game. First version. 

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

//// TEST ONLY ////
//Testing a message in message box works. Can use innerText
//message.innerText ="hi is this working"
//// TEST ONLY ////


// Set the game context to 2D
// Save it to a variable to reference later. Using CTX
// Tells code to work within the context of the canvas
const ctx = gameBoard.getContext('2d')

// Reminders about coordinates. Top left x,y coordinates, are 0,0. Bottom right will flex with the window, but are found thru ctx.w for width and ctx.h for height.
// Will need the computed size of the canvas. Will refer to that later.
// Once we get size of canvas, we can use those to simulate moves differently


////////////    SETUP  ////////////////

// maybe this was for screen sizing changes? 
gameBoard.setAttribute('width', getComputedStyle(gameBoard)['width'])
gameBoard.setAttribute('height', getComputedStyle(gameBoard)['height'])
// Sizes the board somehow
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
        // Property to help with moving. Changing this will make faster, moving more pixels per move. Make variable later to make difficulty higher.
        // 15 too slow. 35 is good for now.
        this.speed = 35
        // Add directions. The paddle can only move left and right. Leaving all four for now
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        ///////// SETTING DIRECTION HANDLER //////

        // Need this for paddle only i think, due to pressing button

        // Methods tied to key events
        // This sets direction for paddle to go that way
        // All four for now, but up down dropped later
        this.setDirection = function (key) {
            console.log('this is the key in setDirection', key)
            if (key == 'ArrowLeft') { this.direction.left = true}
            if (key == 'ArrowRight') { this.direction.right = true}
        }
        //This unsets the direction and stops the paddle from moving that way
        this.unsetDirection = function (key) {
            console.log('this is the key in UNsetDirection', key)
            if (key == 'ArrowLeft') { this.direction.left = false}
            if (key == 'ArrowRight') { this.direction.right = false}
        }        

        //Movement handler. 
        // Gives the paddle direction properties. Only need left and right.
        this.movePlayer = function () {
            //send guy moving in dirx that is true
            if (this.direction.left) {
                this.x -= this.speed
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            //Account for the size of the paddle on left and right side
            if (this.direction.right) {
                this.x += this.speed
                if (this.x + this.width >= gameBoard.width) {
                    this.x = gameBoard.width - this.width
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
        // Property to help with moving. Reminder that paddle is 35 now. Trying 5 for testing to see ball moving easier. 
        this.speed = 5
        // Add directions. The ball can move all directions. 
        // Update. The ball can only move in some diagonal motion. Not straight up , down, left or right. taking out those elements.
        this.direction = {
            // up: false,
            // down: false,
            // left: false,
            // right: false,
            ///add in a diagonal. down/right to start
            diagDownRight: false,
            diagUpRight: false,
            diagDownLeft: false,
            diagUpLeft: false
        }

// Methods tied to key events
 
        /// Lets give the ball a new function. This will listen for the arrow up (try to change later to space bar or any key) and just send the ball going down and to the right. 
        this.startDirection = function (key) {
            console.log('BALL IS MOVING BABY!!', key)
            if (key == "ArrowUp") { this.direction.diagDownRight = true}
        }

        // Build a new function called bounce with the reverse directions that can happen. start with going up left and bouncing from there. 
        this.bounceDirectionDownLeft = function () {
            console.log('i am bouncing down left')
            this.direction.diagUpLeft = false
            this.direction.diagDownLeft = true         
        }

        this.setDirection = function (key) {
            console.log('this is the key in setDirection', key)
            // if (key.toLowerCase() == 'w') { this.direction.up = true}
            // if (key.toLowerCase() == 'a') { this.direction.left = true}
            // if (key.toLowerCase() == 's') { this.direction.down = true}
            // if (key.toLowerCase() == 'd') { this.direction.right = true}
            /// give diagonal a key, start with Y (using y, g, j, h for up/dn/lt/rt)
            if (key.toLowerCase() == 'y') { this.direction.diagDownRight = true}
            if (key.toLowerCase() == 'g') { this.direction.diagUpRight = true}
            if (key.toLowerCase() == 'h') { this.direction.diagDownLeft = true}
            if (key.toLowerCase() == 'j') { this.direction.diagUpLeft = true}
        }
        //This unsets the direction and stops the paddle from moving that way
        //Dont think i need an unSEt direction for the ball. constantly moving. 
        this.unsetDirection = function (key) {
            console.log('this is the key in UNsetDirection', key)
            // if (key.toLowerCase() == 'w') { this.direction.up = false}
            // if (key.toLowerCase() == 'a') { this.direction.left = false}
            // if (key.toLowerCase() == 's') { this.direction.down = false}
            // if (key.toLowerCase() == 'd') { this.direction.right = false}
            /// stop diagonal for now if i let go, for testing only
            if (key.toLowerCase() == 'y') { this.direction.diagDownRight = false}
            if (key.toLowerCase() == 'g') { this.direction.diagUpRight = false}
            if (key.toLowerCase() == 'h') { this.direction.diagDownLeft = false}
            if (key.toLowerCase() == 'j') { this.direction.diagUpLeft = false}
        }        

        // Movement handler for ball
        // Will move in all directions.
        this.movePlayer = function () {

            /// build a diagonal. to start, go down right. both are positive x,y
            if (this.direction.diagDownRight) {
                // got one ball to move diagonal!!! later can mess with more x or y to make not diagonal. can mess with the speed variable
                this.y += this.speed
                this.x += this.speed
                /// this stopped it
                /// instead of stopping it. lets bounce it back. 
                if (this.x + this.width >= gameBoard.width) {
                    this.x = gameBoard.width - this.width
                }
                if (this.y + this.height >= gameBoard.height) {
                    this.y = gameBoard.height - this.height
                }
            }
            /// going down and left
            if (this.direction.diagDownLeft) {
                this.y += this.speed
                this.x -= this.speed
                /// this stopped it
                if (this.x <= 0) {
                    this.x = 0
                }
                if (this.y + this.height >= gameBoard.height) {
                    this.y = gameBoard.height - this.height
                }
            }
            /// going up and right
            if (this.direction.diagUpRight) {
                this.y -= this.speed
                this.x += this.speed
                /// this stopped it
                if (this.x + this.width >= gameBoard.width) {
                    this.x = gameBoard.width - this.width
                }
                if (this.y <= 0) {
                    this.y = 0
                }
            }
            /// going up and left
            if (this.direction.diagUpLeft) {
                this.y -= this.speed
                this.x -= this.speed
                /// this stopped it
                if (this.x <= 0) {
                    /// try to bounce it back instead of stop
                    this.x = 0
                    // this didnt work. tyring a bounce insteaed
                    //this.direction.diagUpRight
                }
                if (this.y <= 0) {
                    // try to bounce instead
                    this.y = 0
                    // didnt work, trying a bounce func instead
                    //this.direction.diagDownLeft
                    // THIS WORKED!!!! 
                    ballOne.bounceDirectionDownLeft()
                }
            }
        }
        // This puts a ball on board to start
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        /// this worked! but it just bounced once. i cannot right for every scenario. now need something to figure out how to flip the direction, no matter what it is.
        this.reverseDirection = function () {
            console.log('should be going up left now')
            this.direction.diagDownRight = false
            this.direction.diagUpLeft = true
            
        }
    }
}

/////////     PLACE BALL AND PADDLE TO START  /////////

// Ball should start at same spot each game. Probably top middle is good. But can be left or right too.
// Paddle should start bottom middle, need to find those pixels 

/// Player and ball are good size now. Will need to give player size a variable for later, to make the paddle shorter or longer based on level.
// Paddle at 360x is about middle. Y 335 is just barely off bottom so that ball can visually pass the paddle if it gets by.
const player = new Paddle(360, 335, 165, 8, 'black')
const ballOne = new Ball(400, 50, 25, 15, 'black')

// this was for testing only
// player.render()
// ballOne.render()


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
        // has a new direction on a hit
        // this worked. need to reverse for any direction
        ballOne.reverseDirection()
        // should move the player now
        //ballOne.movePlayer()
    } 
}



///////   GAME LOOP   //////////////

// Player and paddle will start in static spot. When hit START button, player starts moving. For testing, will either manually move or have moving from start.
// Setup game loop function, attached to an interval. will use same interval as canvas crawler to begin. Will simulate animation on screen

const gameLoop = () => {
    //////////TEST ONLY/////////
    //no console logs here if you can avoid it
    //console.log('its working')
    ////////// TEST ONLY ////////////
    
    // To resemble real movement, clear board every loop so that it doesnt look like a snake and keep showing previous move. Simulates moving with no tracks
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height)


    ////  LEAVE FOR NOW FOR TESTING PURPOSES ////
    
    // Will need a hit detector later only for bottom of screen. When ball passes paddle, player loses. When ball hits paddle, it bounces off it.    
    // Hit detector at top so it takes precedence
    // This works at least now for messaging. need to stop it at paddle. message if hit bottom. more things if hit bottom. also bounce it. 
    detectHit(player)

    ////////   ALOT MORE TO DO HERE  ////////

    player.render()
    player.movePlayer()
    movement.textContent = `${player.x}, ${player.y}`
    ballOne.render()
    ballOne.movePlayer()
    //NEED TO BUILD OUT A ballOne.moveBall()

}

///////////    EVENT LISTENERS   //////////////

/// One event for key DOWN. For paddle only
// Key DOWN will set the paddle direction
document.addEventListener('keydown', (e) => {
    // when a key is pressed, set the direction
    player.setDirection(e.key)

    /// try to add ball here for testing
    ballOne.setDirection(e.key)
    // get the ball started , no keyup function b/c it jsut goes
    ballOne.startDirection(e.key)
})

/// One key event for a key UP. For paddle only
// This will stop the paddle from moving, or the wall does. 
document.addEventListener('keyup', (e) => {
    // when a key is pressed, unset the direction
    /// handled slightly different
    if(['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        player.unsetDirection(e.key)
    }

    /// try to add ball here for testing
    /// adding diagonals for now
    /// can take out w,a,s,d anytime now
    /// add spacebar key
    if(['w', 'a', 's', 'd', 'y', 'g', 'j', 'h'].includes(e.key)) {
        ballOne.unsetDirection(e.key)
    }


})
//// probably need a listener for START , slight delay, ball starts moving. or just after start button is hit, so player is ready.


//// Save our game interval to a variable so we can stop it when we want to
// This interval runs the game loop every 60 ms till we tell it to stop. Going to 30 seems faster visually.
const gameInterval = setInterval(gameLoop, 60)
// Function to stop game loop
const stopGameLoop = () => {clearInterval(gameInterval)}


// Add an event listener, when DOM loads, run the game on an interval

document.addEventListener('DOMContentLoaded', function () {
    // here is our game loop interval
    gameInterval
})


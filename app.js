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

//  Ball should start at same spot each game. Probably top middle is good. But can be left or right too.


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



////////////////////    BUILD OUT SCOREBOARD (BONUS, LEVELS AND LIVES) ///////////////////

///  Setup variables for Score. Start at zero. Goes up one with each hit to the paddle, not hit to walls. Big difference. Will start a counter and see if i can insert that counter into the text for the scoreboard. ID is "scorecount".

// Now shows zero and is a number. Going to add to it thru the hit detector on the paddle.
// Added a counter near the hit detector. Goes up 1 by 1 when hit paddle. Shows in scoreboard and message board when game ends.
const scoreCount = document.getElementById('scorecount')
scoreCount.innerHTML = 0

/// Setup variable for level. Start at zero. Go up every 15 points. Then we'll increase difficulty as well.
const levelCount = document.getElementById('levelcount')
levelCount.innerHTML = 1

/// FOR END GAME. just need to use this code to send to the end game screen after all lives are lost or when they lose regardless
/// setup a life counter
// need more work here. need function to start game over when player loses. then can count it. 
// const livesCount = document.getElementById('livescount')
// livesCount.innerHTML = 3
//window.location.replace("endPage.html")



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
        this.speed = 15
        // Add directions. The ball can move all directions. 
        // Update. The ball can only move in some diagonal motion. Not straight up , down, left or right. taking out those elements.
        this.direction = {

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
        /// these are bounces from the walls only. not the direct hit. so those might be different and built different. 
        // these will only go in the part where the balls hit the walls
        // i will skip the one where it hits the bottom b/c the ball doesnt bounce from the bottom
        this.bounceDirectionDownLeft = function () {
            console.log('i am bouncing down left')
            this.direction.diagUpLeft = false
            this.direction.diagDownLeft = true         
        }
        this.bounceDirectionDownRight = function () {
            console.log('i am bouncing down Right')
            this.direction.diagUpRight = false
            this.direction.diagDownRight = true         
        }
        /// had to account for bouncing from down left from left wall and not just from ceiling
        this.bounceDirectionDownRightFromLeftWall = function () {
            console.log('i am bouncing down Right')
            this.direction.diagDownLeft = false
            this.direction.diagDownRight = true         
        }
        /// SAME FOR RIGHT WALL had to account for bouncing from down right from right wall and not just from ceiling
        this.bounceDirectionDownLeftFromRightWall = function () {
            console.log('i am bouncing down Right')
            this.direction.diagDownRight = false
            this.direction.diagDownLeft = true         
        }        
        this.bounceDirectionUpLeft = function () {
            console.log('i am bouncing up left')
            this.direction.diagUpRight = false
            this.direction.diagUpLeft = true         
        }
        this.bounceDirectionUpRight = function () {
            console.log('i am bouncing up right')
            this.direction.diagUpLeft = false
            this.direction.diagUpRight = true         
        }
        /// need to rebuild the up right and  up left ones for IF  they come off the paddle and not the wall
        this.bounceDirectionUpLeftFromPaddle = function () {
            console.log('i am bouncing up left')
            this.direction.diagDownLeft = false
            this.direction.diagUpLeft = true         
        }
        this.bounceDirectionUpRightFromPaddle = function () {
            console.log('i am bouncing up right')
            this.direction.diagDownRight = false
            this.direction.diagUpRight = true         
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
                    ballOne.bounceDirectionDownLeftFromRightWall()
                }
                //// no bounce, this means got past player. end game or lose life later
                /// Game over message works
                //// need to stop the ball right when bottom is hit, for visual reality look
                if (this.y + this.height >= gameBoard.height) {
                    this.y = gameBoard.height - this.height
                    message.textContent = 'GAME OVER. You scored ' + counterForScore + ' points'
                    //try giving x a zero immediately. zero lets it show bottom right. negative 50 makes it disappear
                    this.x = -50
                    
                    
                    /// not working. maybe place outside loop
                    /// need restart function first. when player loses, goes again, loses a life
                    //livesCount = livesCount - 1
                    //console.log(livesCount)
                    /// send page to end page when player has zero lives. Need to setup a life counter. then go down to zero. then this fires. 
                    window.location.replace("endPage.html")
                }
            }
            /// going down and left
            if (this.direction.diagDownLeft) {
                this.y += this.speed
                this.x -= this.speed
                /// this stopped it
                if (this.x <= 0) {
                    this.x = 0
                    ballOne.bounceDirectionDownRightFromLeftWall()
                }
                /// dont bounce from the bottom here!!! figure this out later. means game over or player loses life
                /// Game over message works
                //// need to stop the ball right when bottom is hit, for visual reality look
                if (this.y + this.height >= gameBoard.height) {
                    this.y = gameBoard.height - this.height
                    message.textContent = 'GAME OVER. You scored ' + counterForScore + ' points'
                    //try giving x a zero immediately. zero lets it show bottom right. negative 50 makes it disappear
                    this.x = -50
                    
                    /// not working yet
                    //livesCount = livesCount - 1
                    //console.log(livesCount)
                    window.location.replace("endPage.html")
                }
            }
        

            /// going up and right
            if (this.direction.diagUpRight) {
                this.y -= this.speed
                this.x += this.speed
                /// this stopped it
                if (this.x + this.width >= gameBoard.width) {
                    this.x = gameBoard.width - this.width
                    ballOne.bounceDirectionUpLeft()
                }
                if (this.y <= 0) {
                    this.y = 0
                    ballOne.bounceDirectionDownRight()
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
                    ballOne.bounceDirectionUpRight()
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
            console.log('should bounce either way')
            if (this.direction.diagDownRight) {
                ballOne.bounceDirectionUpRightFromPaddle()
            } else {
                ballOne.bounceDirectionUpLeftFromPaddle()
            }
        }
    }
}

/////////     PLACE BALL AND PADDLE TO START  /////////

// Ball should start at same spot each game. Probably top middle is good. But can be left or right too.
// Paddle should start bottom middle, need to find those pixels 

/// Player and ball are good size now. Will need to give player size a variable for later, to make the paddle shorter or longer based on level.
// Paddle at 360x is about middle. Y 335 is just barely off bottom so that ball can visually pass the paddle if it gets by.
const player = new Paddle(360, 335, 145, 8, 'black')
const ballOne = new Ball(400, 50, 15, 12, 'black')




/////    COLLISION  DETECTION ///////////


// Detect a hit. In pong, the ball can hit any side. if it hits the bottom, the player loses. if it hits the paddle or any other side, the ball bounces
// To do this we need to account for the entire space that the ball takes up AND the paddle takes up. The sides should be similar but easier its its not a moving object
// Use the ball AND paddle x, y, width, height
// Ball seems to go thru paddle by a pixel, can account for this later
// Counter to keep track of score
counterForScore = 0
counterForLevel = 1
// wait on this, need another function to start game over if life left
///counterForLives = 3 
const detectHit = (thing) => {
    //Use a big if statement to see if any side of the ball hits any side of the paddle or walls.
    if (ballOne.x < thing.x + thing.width
        && ballOne.x + ballOne.width > thing.x
        && ballOne.y < thing.y + thing.height
        && ballOne.y + ballOne.height > thing.y) {

        // has a new direction on a hit
        // this worked. need to reverse for any direction
        ballOne.reverseDirection()

        //change the status box
        message.textContent = 'Ball hit paddle/wall'

        // Add to score counter
        // Counter starts at zero. Adds 1 here each time hits paddle. Only Goes up locally. Start at zero when reset/save. Posts in the inner HTML of that box. And also posts in message board when game ends. 
        scoreCount.innerHTML = counterForScore + 1
        counterForScore = counterForScore + 1

        /// Place a level function here. Once score reaches a certain amount, the level increases, the level counter shows it.
        if ((counterForScore >= 3) && (counterForScore < 6)) {
            levelCount.innerHTML = counterForLevel + 1
            
        } else if ((counterForScore >= 7) && (counterForScore < 10)) {
            levelCount.innerHTML = counterForLevel + 2
            
        }
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
        
    // Hit detector at top so it takes precedence
    // This is working. Bouncing off walls and paddle. Message if hit paddle or bottom.
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
})

//// Save our game interval to a variable so we can stop it when we want to
// This interval runs the game loop every 60 ms till we tell it to stop. Going to 30 seems faster visually.
const gameInterval = setInterval(gameLoop, 50)
// Function to stop game loop
const stopGameLoop = () => {clearInterval(gameInterval)}


// Add an event listener, when DOM loads, run the game on an interval
document.addEventListener('DOMContentLoaded', function () {
    // here is our game loop interval
    gameInterval
    message.textContent = 'PRESS UP ARROW TO START'
})


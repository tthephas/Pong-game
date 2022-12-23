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

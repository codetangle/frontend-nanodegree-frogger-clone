// Super class for all game sprites
var GameSprite  = function() {
    //Variables common to all sprites
    this.spriteWidth = 101;
    this.spriteWidth = 83;
    this.initialX = -200;
    this.initialY = 0;
    this.x = this.initialX;
    this.y = this.initialY;
    this.sprite;
}

//Common methods
//Render the sprite to the canavs at give (x,y) coordinates
GameSprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Reset the sprite to it's original location
GameSprite.prototype.reset = function() {
    this.x = this.initialX;
    this.y = this.initialY;
};

//Check to see if the sprite is colliding with another sprite, obj
GameSprite.prototype.collision = function(obj) {
    var hadCollision = false;
    //object x boundries (front and back)
    var ox = Number(obj.x);
    var oxw = ox + Number(obj.spriteWidth);

    //object y boundries (top and bottom)
    var oy = Number(obj.y);
    var oyh = oy + Number(obj.spriteHeight);

    //Player x boundries
    var px = Number(this.x);
    var pxw = px + Number(this.spriteWidth);

    //Player y boundries
    var py = Number(this.y);
    var pyh = py + Number(this.spriteHeight);

    var yCollision = false;
    var xCollision = false;

    //Is object is within players Y boundaries
    // pyh = Player Y-direction Height
    // oxw = Object X-direction Width
    if(oy > py && oy < pyh ) {
        yCollision = true;
    } else if(oyh > py && oyh < pyh) {
        yCollision = true;
    } else if(oy >= py && oyh <= pyh) {
        yCollision = true;
    } else if(oy < py && oyh > pyh)  {
        yCollision = true;
    }

    //Is object within players X boundaries
    if(ox > px && ox < pxw ) {
        xCollision = true;
    } else if(oxw > px && oxw < pxw) {
        xCollision = true;
    } else if(ox >= px && oxw <= pxw) {
        xCollision = true;
    } else if(ox < px && oxw > pxw)  {
        xCollision = true;
    }

    if(yCollision === true && xCollision === true) {
        hadCollision = true;
    }
    return hadCollision;
};

//Move the sprite off screen
GameSprite.prototype.setOffScreen = function() {
    this.x = -1 * Number(this.spriteWidth);
};

// returns a Y coordinate for a random stone row.
GameSprite.prototype.setRandomRow = function() {
    return (Math.floor((Math.random() * 3) + 1) * 83);
};

// Returns a X coordinate for a random column
GameSprite.prototype.setRandomCol = function() {
    return Math.floor(Math.random() * 5) * 101;
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    var baseSpeed = 5;
    this.spriteWidth = 100;
    this.spriteHeight = 82;
    this.initialX = this.setRandomCol();
    this.initialY = this.setRandomRow() - 20;
    this.speedX = baseSpeed * ((Math.random() * 3) + 1);
    this.x = this.initialX;
    this.y = this.initialY;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(GameSprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += dt * this.speedX;

    if(this.x > 505) {
        this.setOffScreen();
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(initX, initY) {
    this.spriteWidth = 100;
    this.spriteHeight = 70;
    this.initialX = initX;
    this.initialY = initY;
    this.health = 1;
    this.sprite = 'images/char-boy.png';
    this.x = this.initialX;
    this.y = this.initialY;
};
Player.prototype = Object.create(GameSprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    var l = allEnemies.length;
    var i;
    for(i = 0; i < l; i++) {
        if(this.collision(allEnemies[i])) {
            this.reset();
        }
    }
};

Player.prototype.handleInput = function(input) {
    if(input === 'left') {
        if(this.x > 0) {
            this.x -= 101;
        }
    } else if (input === 'right') {
        if(this.x < 404) {
            this.x += 101;
        }
    } else if (input === 'up') {
        if(this.y > 73) {
            this.y -= 83;
        } else {
            this.reset();
        }
    } else if (input === 'down') {
        if(this.y < 405) {
            this.y += 83;
        }
    }
};

var Gem = function() {
    this.spriteWidth = 70;
    this.spriteHeight = 70;
    this.initialX = this.setRandomCol() + 10;
    this.initialY = this.setRandomRow() - 5;
    this.health = 1;
    this.sprite = 'images/Gem-Blue-sm.png';
    this.x = this.initialX;
    this.y = this.initialY;
    this.gemSprites = [
        'images/Gem-Blue-sm.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png'
    ];
};
Gem.prototype = Object.create(GameSprite.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function() {
    if(this.collision(player)) {
        console.log("Gem Collision");
        this.respawnGem();
    }
};
Gem.prototype.respawnGem = function() {
    //An index number for the gemSprites array
    var gemIndex = Math.floor(Math.random() * this.gemSprites.length);
    this.sprite = this.gemSprites[gemIndex];

    this.x = this.setRandomCol() + 10;
    this.y = this.setRandomRow() - 5;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(202, 322);
var allEnemies = [];
var i = 0;
var l = 4;
for(i = 0; i < l; i++) {
    allEnemies.push(new Enemy);
}

//Instaniate Gem sprite
var gem = new Gem();
for(i in gem.gemSprites) {
    Resources.load(gem.gemSprites[i]);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

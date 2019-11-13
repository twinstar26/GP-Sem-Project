//  This is configuration dictionary which is fed to game declaration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//  Game initialization
var game = new Phaser.Game(config);
//  Some variables created which are used throughout game
var laser_strike;
var bullet;
var player;
var baddie;
var cursors;
var score = 0;
var timer = true;
var scoreText;
var platform;
var gameOver = false;
var lastFired = 0;

//  Preload function is Phaser function which is responsible for loading stuff into RAM
function preload()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('laser_strike', 'assets/laser_strike.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('player', 'assets/thrust_ship.png');
    this.load.image('baddie', 'assets/baddie.png');
}

//  Create function is Phaser function which is responsible for loading characters on screen
function create()
{
    //  Background sky image is created
    this.add.image(400, 300, 'sky');

    //  Player is created
    player = this.physics.add.image(50,300,'player');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //Baddie
    baddie = this.physics.add.image(500,300,'baddie');
    baddie.setVelocityX(-100);
    //baddie.position.Y = -(float)Math.Cos(baddie.position.X / 200) * 5;
    //baddie.setBounce(0);
    //baddie.setCollideWorldBounds(true);

    //  Accept input formm keyboard
    cursors = this.input.keyboard.createCursorKeys();player
    cursors.addCapture;

    // Bullets construction
    var Bullet = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
            this.speed = Phaser.Math.GetSpeed(400, 1);
        },
        fire: function (x, y)
        {
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.x += this.speed * delta;

            if (this.x > 800)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 100,
        runChildUpdate: true
    });

    this.physics.add.collider(baddie, bullets, hitBaddie, null, this);

    //  Text in game is added
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });    
}

//  Update function is Phaser function which is responsible for upadating screen. It's like while(true).
function update(time, delta)
{
    if (gameOver)
    {
        return;
    }
    if (cursors.down.isDown)
    {
        player.setVelocityY(330);
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-330);
    }
    else 
    {
        player.setVelocityY(0);
    }

    if(cursors.space.isDown && time > lastFired)
    {
        var bullet = bullets.get();
        if (bullet)
        {
            bullet.fire(player.x, player.y);
            lastFired = time + 100;
        }
    }
}

//  Responsible for actions after star collision
function hitBaddie (baddie, bullet)
{
    //this.physics.pause();
    baddie.setTint(0xff0000);
    baddie.setVisible(false);
    updateScore();
    //player.anims.play('turn');
    //gameOver = true;
    //scoreText.setVisible(false);
    //scoreText1 = this.add.text(200, 300, 'nOOb! Your score is: ' + score, { fontSize: '32px', fill: '#000' });
    //timer = false;
}

//  Responsible for updating score
function updateScore()
{
    score += 10;
    scoreText.setText('Score: ' + score);

    if(score >= 100)
    {
        this.physics.pause();
        scoreText.setVisible(false);
        scoreText1 = this.add.text(100, 300, 'You got lucky! Your score is: ' + score, { fontSize: '32px', fill: '#000' });
    }
}

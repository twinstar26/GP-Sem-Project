//  This is configuration dictionary which is fed to game declaration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0 },
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
var baddiebullet;
var bblastfired = 0;
var bullet;
var player;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var lastFired = 0;
var i = 0;
var x = 10;
var baddie = [20];
var baddie2IsSpawned = false;
var baddie2 = [5];
var bossbaddie;
var bossbaddieLife = 100;
var bossbaddieIsSpawned = false;
var startText;
var start = true;


//  Preload function is Phaser function which is responsible for loading stuff into RAM
function preload()
{
    this.load.image('nebula', 'assets/nebula.jpg');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('player', 'assets/thrust_ship.png');
    this.load.image('baddie', 'assets/baddie.png');
    this.load.image('baddie2', 'assets/space-baddie.png');
    this.load.image('bossbaddie', 'assets/baddie2.png');
    this.load.image('baddiebullet', 'assets/bbullet.png');
}

//  Create function is Phaser function which is responsible for loading characters on screen
function create()
{
    //  Background nebula image is created
    this.add.image(400, 300, 'nebula');

    //  Player is created
    player = this.physics.add.image(50,300,'player');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //Baddie
    for(var i = 0;i<20;i++)
    {
        baddie[i] = this.physics.add.image(700, 100 + 20*i, 'baddie');
        baddie[i].setVelocityX(-100);
    }

    //  Accept input form keyboard
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
        maxSize: 1000,
        runChildUpdate: true
    });
/*
    var Baddiebullet = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize: function Baddiebullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'baddiebullet');
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

    baddiebullets = this.physics.add.group({
        classType: Baddiebullet,
        maxSize: 100,
        runChildUpdate: true
    });
*/
    for(var i = 0;i<20;i++)
    {
        this.physics.add.collider(baddie[i], bullets, hitBaddie, null, this);
        this.physics.add.collider(baddie[i], player, playerhit, null, this);
    }
    //  Text in game is added
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff ' });   

    startText = this.add.text(400, 16, 'SPACE IMPACT', { fontSize: '40px', fill: '#ffffff ' });    


}

//  Update function is Phaser function which is responsible for upadating screen. It's like while(true).
function update(time, delta)
{


    for(var i = 0;i<20;i++)
    {
        if(baddie[i].x < 0)
        this.physics.pause();
    }

    if(score>=200 && !baddie2IsSpawned)
    {
        for(var i = 0;i<5;i++)
        {
    
            baddie2[i] = this.physics.add.image(700, 150 + 100*i, 'baddie');
            baddie2[i].setVelocityX(-100);
            this.physics.add.collider(baddie2[i], bullets, hitBaddie, null, this);
            this.physics.add.collider(baddie2[i], player, playerhit, null, this);
        }
        baddie2IsSpawned = true;
    }
    if(score>=250 && !bossbaddieIsSpawned)
    {    
        bossbaddie = this.physics.add.image(700, 300, 'bossbaddie');
        this.physics.add.collider(bossbaddie, bullets, hitboss, null, this);
        bossbaddieIsSpawned = true;
    }

    if(bossbaddieIsSpawned)
    {
        this.physics.moveTo(bossbaddie,player.x, player.y, 50);
        if(bossbaddie.x < 0)
        this.physics.pause();
    }

    if(bossbaddieIsSpawned && i%100==0)
    {
        baddie[x].setPosition(bossbaddie.x,bossbaddie.y);
        x++;
    }
i++;
    if(baddie2IsSpawned)
    {
        for(var i = 0;i<5;i++)
        {
            this.physics.moveTo(baddie2[i],player.x, player.y, 700);
            if(baddie2[i].x < 0)
            this.physics.pause();
        }
    }

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
    else if(cursors.right.isDown)
    {
        player.setVelocityX(100);
    }
    else if(cursors.left.isDown)
    {
        player.setVelocityX(-100);
    }
    else 
    {
        player.setVelocityY(0);
        player.setVelocityX(0);
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
function hitBaddie (bad, bullet)
{
    //this.physics.pause();
    bullet.setVisible(false);
    bad.setPosition(500000000,0);
    score += 10;
    scoreText.setText('Score: ' + score);

    if(score >= 1000)
    {
        this.physics.pause();
        scoreText.setVisible(false);
        scoreText1 = this.add.text(100, 300, 'You got lucky! Your score is: ' + score, { fontSize: '32px', fill: '#ffffff ' });
    }
}

function hitboss (bad, bullet)
{
    //this.physics.pause();
    bullet.destroy();
    if(bossbaddieLife<=0)
    {
        bad.setPosition(500000000,0);
        gameOver = true;
        scoreText1 = this.add.text(100, 300, 'You got lucky! Your score is: ' + score, { fontSize: '32px', fill: '#ffffff ' });
    }
    score += 10;
    scoreText.setText('Score: ' + score);
    bossbaddieLife -= 5;

    if(score >= 1000)
    {
        this.physics.pause();
        scoreText.setVisible(false);
        scoreText1 = this.add.text(100, 300, 'You got lucky! Your score is: ' + score, { fontSize: '32px', fill: '#ffffff ' });
    }
}

function playerhit(bad,player)
{
    this.physics.pause();
    player.setTint(0xff0000);
    bad.setVisible(false);
    gameOver = true;
    scoreText1 = this.add.text(200, 300, 'nOOb! Your score is: ' + score, { fontSize: '32px', fill: '#ffffff ' });
}


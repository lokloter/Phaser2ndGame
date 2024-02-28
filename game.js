var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

var player;
var platform;
var cursors;
var obstacles;
var scrollSpeed = 100;
var jumpSpeed = -330;
var maxObstacles = 3;
var worldWidth = 10000;

function preload() {
  this.load.image("fon2", "assets/fon2.jpg");
  this.load.image("platform", "assets/platform.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("obstacle", "assets/obstacle.png");
}

function create() {
  this.add.tileSprite(0, 0, worldWidth, 1080, "fon2").setOrigin(0, 0);

  player = this.physics.add.sprite(100, 900, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.cameras.main.setBounds(0, 0, worldWidth, window.innerHeight);
  this.physics.world.setBounds(0, 0, worldWidth, window.innerHeight);

  this.cameras.main.startFollow(player);
  
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  platform = this.physics.add.staticGroup();
  for (var x = 0; x < worldWidth; x = x + 450) {
    console.log(x);
    platform.create(x, 1000, "platform").setOrigin(0, 0).refreshBody();
  }

  cursors = this.input.keyboard.createCursorKeys();

  obstacles = this.physics.add.group();
  //createObstacle();

  this.physics.add.collider(player, platform);
  this.physics.add.collider(player, obstacles, stopObstacle, null, this);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(0);
    player.anims.play("left", true);
    obstacles.setVelocityX(scrollSpeed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(0);
    player.anims.play("right", true);
    obstacles.setVelocityX(-scrollSpeed);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
    obstacles.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(jumpSpeed);
  }

  obstacles.children.iterate(function (child) {
    if (child.x < -100) {
      child.destroy();
    }
  });
  if (obstacles.countActive(true) < maxObstacles) {
    //createObstacle();
  }
}

function stopObstacle(player, obstacle) {
  obstacle.body.moves = false;
  isGameOver = true;
  gameOver();
}

function gameOver() {
  console.log("Game Over");
}

var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
      debug: true,
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
var scrollSpeed = 150;
var jumpSpeed = -330;
var maxObstacles = 3;
var worldWidth = 9600;

function preload() {
  this.load.image("fon2", "assets/fon2.jpg");
  this.load.image("platform", "assets/platform.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("obstacle", "assets/obstacle.png");
  this.load.image("Tree", "assets/Tree.png");
  this.load.image("Stone", "assets/Stone.png");
  this.load.image("Bush", "assets/Bush.png");
}

function create() {
  //для фону
  this.add.tileSprite(0, 0, worldWidth, 1080, "fon2").setOrigin(0, 0);

  //гравець
  player = this.physics.add.sprite(100, 900, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //для камери
  this.cameras.main.setBounds(0, 0, worldWidth, window.innerHeight);
  this.physics.world.setBounds(0, 0, worldWidth, window.innerHeight);

  this.cameras.main.startFollow(player);

  //для руху гравця
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

  //для фізики платформ
  platform = this.physics.add.staticGroup();
  for (var x = 0; x < worldWidth; x = x + 100) {
    console.log(x);
    platform.create(x, 1000, "platform").setOrigin(0, 0).refreshBody();
  }

  //stones
  for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(500, 1000)) {
    console.log(x);
    stone = this.physics.add.sprite(x, 1000, "Bush").setOrigin(0, 1);
    this.physics.add.collider(stone, platform);
    //create(x, 1000, "Bush");
  }

  for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(1000, 2000)) {
    console.log(x);
    stone = this.physics.add.sprite(x, 1000, "Tree").setOrigin(0, 1);
    this.physics.add.collider(stone, platform);
    //create(x, 1000, "Bush");
  }

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, platform);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-scrollSpeed);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(scrollSpeed);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(jumpSpeed);
  }
}

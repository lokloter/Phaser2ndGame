var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
var cursors;
var platforms;
var obstacles;

function preload() {
  this.load.image("ground", "assets/platform.png");
  this.load.image("obstacle", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, "ground").setScale(2).refreshBody();
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();

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

  obstacles = this.physics.add.group();
  this.physics.add.collider(obstacles, platforms);

  // Spawn obstacles
  this.time.addEvent({
    delay: 2000,
    callback: spawnObstacle,
    callbackScope: this,
    loop: true,
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function spawnObstacle() {
  var x = Phaser.Math.Between(50, 750);
  var obstacle = obstacles.create(x, 16, "obstacle");
  obstacle.setBounce(1);
  obstacle.setCollideWorldBounds(true);
  obstacle.setVelocity(Phaser.Math.Between(-200, 200), 20);
}

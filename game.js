var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 250 },
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

var enemy;
var player;
var platform;
var cursors;
var obstacles;
var scrollSpeed = 500;
var jumpSpeed = -330;
var maxObstacles = 3;
var worldWidth = 9600;
var score = 0;
var scoreText;
var lives = 2;
var livesText;
var resetbutton;
var playerX;
var enemycount = 3;

function preload() {
  //fon
  this.load.image("fon2", "assets/fon3.png");
  //platform
  this.load.image("platform", "assets/platform.png");
  //player
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  //objects
  this.load.image("Tree", "assets/Tree.png");
  this.load.image("Stone", "assets/Stone.png");
  this.load.image("Bush", "assets/Bush.png");
  //platforms in sky
  this.load.image("platform-sky", "assets/13.png");
  this.load.image("platform-sky1", "assets/14.png");
  this.load.image("platform-sky2", "assets/15.png");
  //mushrooms
  this.load.image("good_mushroom", "assets/Mushroom_1.png");
  this.load.image("bad_mushroom", "assets/Mushroom_2.png");
  //enemy
  this.load.image("enemy", "assets/enemy.png");
}

function create() {
  //для фону
  this.add
    .tileSprite(0, 0, worldWidth, 1080, "fon2")
    .setOrigin(0, 0)
    .setDepth(0);

  //для фізики платформ
  platform = this.physics.add.staticGroup();
  for (var x = 0; x < worldWidth; x = x + 100) {
    //console.log(x);
    platform
      .create(x, 1090 - 93, "platform")
      .setOrigin(0, 0)
      .refreshBody();
  }

  //для літаючих платформ

  for (var x = 200; x < worldWidth; x = x + Phaser.Math.Between(1000, 2000)) {
    //var y = Phaser.Math.FloatBetween(128, 128 * 6);
    y = 700;
    platform.create(x, y, "platform-sky");

    var i = 1;
    for (i = 1; i < Phaser.Math.Between(0, 5); i++)
    {
      console.log(x + 128 * i);
      platform.create(x + 128 * i, y, "platform-sky1");
    }

    platform.create(x + 128 * i , y, "platform-sky2");
  }

  //гравець
  player = this.physics.add.sprite(400, 400, "dude").setDepth(4);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  //ворог
  enemy = this.physics.add.group({
    key: "enemy",
    repeat: enemycount,
    setXY: { x: 1000, y: 1080 - 200, stepX: 400 },
  });

  enemy.children.iterate(function (child) {
    child
      .setCollideWorldBounds(true)
      .setVelocityX(Phaser.Math.FloatBetween(-500, 500));
  });
  //колізія ворога та платформи
  this.physics.add.collider(enemy, platform);

  //колізія ворога та pla
  this.physics.add.collider(
    player,
    enemy,
    (enemy) => {
      player.x = player.x + Phaser.Math.FloatBetween(-50, 50);
      player.y = player.y - Phaser.Math.FloatBetween(-50, 50);
    },
    null,
    this
  ); //this.physics.add.overlap(player, enemies, hitEnemy, null, this);

  //для камери
  this.cameras.main.setBounds(0, 0, worldWidth, config.height);
  this.physics.world.setBounds(0, 0, worldWidth, config.height);

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

  //objects
  for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(500, 1000)) {
    //console.log(x);
    stone = this.physics.add
      .sprite(x, 1000, "Bush")
      .setOrigin(0, 1)
      .setDepth(Phaser.Math.Between(1, 5))
      .setScale(Phaser.Math.FloatBetween(0.5, 1.5));
    this.physics.add.collider(stone, platform);
    //create(x, 1000, "Bush");
  }

  for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(1000, 2000)) {
    //console.log(x);
    stone = this.physics.add
      .sprite(x, 1000, "Tree")
      .setOrigin(0, 1)
      .setDepth(Phaser.Math.Between(1, 5))
      .setScale(Phaser.Math.FloatBetween(1, 1.5));
    this.physics.add.collider(stone, platform);
    //create(x, 1000, "Bush");
  }

  for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(900, 1400)) {
    //console.log(x);
    stone = this.physics.add
      .sprite(x, 1000, "Stone")
      .setOrigin(0, 1)
      .setDepth(Phaser.Math.Between(1, 5))
      .setScale(Phaser.Math.FloatBetween(0.5, 1));
    this.physics.add.collider(stone, platform);
  }

  //mushroom
  Mushroom = this.physics.add.staticGroup();
  for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(200, 600)) {
    Mushroom.create(x, 1000 - 20, "good_mushroom")
      .setOrigin(0.5, 0.5)
      .setDepth(6);
  }
  this.physics.add.collider(Mushroom, platform);
  this.physics.add.overlap(player, Mushroom, collectMushroom, null, this);

  BadMushroom = this.physics.add.staticGroup();
  for (var x = 20; x < worldWidth; x = x + Phaser.Math.Between(200, 600)) {
    BadMushroom.create(x, 1000 - 20, "bad_mushroom")
      .setOrigin(0.5, 0.5)
      .setDepth(6);
  }
  this.physics.add.collider(BadMushroom, platform);
  this.physics.add.overlap(player, BadMushroom, collectBadMushroom, null, this);

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, platform);

  //score
  scoreText = this.add
    .text(16, 16, "Mushrooms:0", { fontSize: "32px", fill: "#000" })
    .setScrollFactor(0);

  //lives
  livesText = this.add
    .text(1300, 16, showlive(), { fontSize: "32px", fill: "#000" })
    .setScrollFactor(0);
  //reset
  resetbutton = this.add
    .text(950, 16, "reset", { fontSize: "32px", fill: "#000z" })
    .setScrollFactor(0)
    .setInteractive();

  resetbutton.on("pointerdown", function () {
    console.log("reset");
    refreshBody();
  });

  //enemy
}

function update() {
  // рух
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
  //end
  if (lives == 0) {
    gameOver();
  }
  //агро радіус
  if (Math.abs(player.x - enemy.x) < 600) {
    enemy.moveTo(player, player.x, player.y, 300, 1);
  }
  //рух енемі
  enemy.children.iterate((child) => {
    if (Math.random() < 0.1) {
      child.setVelocityX(Phaser.Math.FloatBetween(-500, 500));
    }
  });
}
//restart
function refreshBody() {}

function collectBadMushroom(player, badMushroom) {
  badMushroom.disableBody(true, true);

  lives -= 1;
  livesText.setText(showlive());
  console.log(lives);
}

//showlive
function showlive() {
  livesText = "Lives: ";

  for (var i = 0; i < lives; i++) {
    livesText += "♥";
  }
  return livesText;
}

function collectMushroom(player, mushroom) {
  mushroom.disableBody(true, true);

  score += 1;
  scoreText.setText("Mushrooms:" + score);
}

// function hitEnemy(player, enemy) {
//   // Дія при зіткненні з ворогом
// }

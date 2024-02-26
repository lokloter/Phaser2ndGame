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
var platform;
var cursors;
var obstacles;
var scrollSpeed = 100; // Швидкість прокрутки перешкод
var jumpSpeed = -330; // Швидкість стрибка
var maxObstacles = 3; // Максимальна кількість перешкод одночасно

function preload() {
  this.load.image("phon", "assets/phon.jpg");
  this.load.image("platform", "assets/platform.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("obstacle", "assets/obstacle.png");
}

function create() {
  // Додайте фон
  this.add.image(400, 300, "phon");

  // Створення гравця
  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Анімація руху гравця
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

  // Створення платформи
  platform = this.physics.add.staticGroup();
  platform.create(400, 568, "platform").setScale(2).refreshBody();

  // Створення курсорів клавіатури
  cursors = this.input.keyboard.createCursorKeys();

  // Створення групи для перешкод
  obstacles = this.physics.add.group();

  // Створення першої перешкоди
  createObstacle();

  this.physics.add.collider(player, platform);
  this.physics.add.collider(player, obstacles, stopObstacle, null, this);
}

function update() {
  // Рух гравця
  if (cursors.left.isDown) {
    player.setVelocityX(0);
    player.anims.play("left", true);
    // Рух перешкод вправо
    obstacles.setVelocityX(scrollSpeed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(0);
    player.anims.play("right", true);
    // Рух перешкод вліво
    obstacles.setVelocityX(-scrollSpeed);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
    obstacles.setVelocityX(0);
  }

  // Перевірка клавіші простору для стрибка
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(jumpSpeed);
  }

  // Видалення перешкод, які вийшли за межі екрану
  obstacles.children.iterate(function (child) {
    if (child.x < -100) {
      child.destroy();
    }
  });

  // Створення нової перешкоди, якщо кількість перешкод менше максимальної кількості
  if (obstacles.countActive(true) < maxObstacles) {
    createObstacle();
  }
}

function stopObstacle(player, obstacle) {
  obstacle.body.moves = false;
}

function createObstacle() {
  var obstacle = obstacles.create(800, 500, "obstacle");
  obstacle.setImmovable(true);
  obstacle.body.allowGravity = false;
}

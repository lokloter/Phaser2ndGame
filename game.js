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
  
  function preload() {
    this.load.image("dude","assets/dude.png")
    this.load.image("phon","assets/phon.png")
    this.load.image("platform","assets/platform.png")
  }
  function create() {
    this.add.image(400, 300, "phon");
  }
  function update() {

  }
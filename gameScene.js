// Create a new Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 }, // Set global gravity
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

// Create a new Phaser game
const game = new Phaser.Game(config)

function preload() {
  // Load assets (e.g., a sprite image)
  this.load.image('object', "./assets/ballObject.png")
  this.load.image('conveyorBelt', './assets/conveyorBelt.png')
}

function create() {
  // Create a group to hold all falling objects
  this.fallingObjects = this.physics.add.group()

  // Create the ground
  const ground = this.add.rectangle(400, 580, 800, 40, 0x6666ff)
  this.physics.add.existing(ground, true) // true means it's static
  
  // Create the conveyor belt
  this.conveyorBelt = this.physics.add.sprite(400, 500, 'conveyorBelt')
  this.conveyorBelt.setImmovable(true) // The conveyor belt doesn't move when hit
  this.conveyorBelt.body.allowGravity = false // The conveyor belt is not affected by gravity
  
  // Enable collision between the falling objects and the ground
  this.physics.add.collider(this.fallingObjects, ground)
  
  // Enable collision between the falling objects and the conveyor belt
  this.physics.add.collider(this.fallingObjects, this.conveyorBelt, onConveyorBelt, null, this)
  
  // Set up input handling for the space bar
  this.input.keyboard.on('keydown-SPACE', createFallingObject, this)
}

function update() {
  // Check if any falling objects have moved off screen
  this.fallingObjects.children.iterate(function(fallingObject) {
      if (fallingObject && fallingObject.x > config.width) {
          fallingObject.destroy() // Remove the object when it moves out of the screen
      }
  });
}

function createFallingObject() {
  // Create a new falling object at the top of the screen
  const fallingObject = this.fallingObjects.create(400, 50, 'object')
  
  // Optional: Set the bounce value
  fallingObject.setBounce(0.2)
}

function onConveyorBelt(fallingObject, conveyorBelt) {
  // Apply horizontal velocity to the object when it hits the conveyor belt
  fallingObject.setVelocityX(150) // Adjust the value to control the speed
}

export class Mario extends Phaser.GameObjects.Sprite {
  private currScene: Phaser.Scene;
  private acceleration: number;
  private jumpHeight: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  body!: Phaser.Physics.Arcade.Body
  private jump: Phaser.Sound.BaseSound;
  private isJumping: boolean;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currScene = params.scene;
    this.currScene.add.existing(this);
    this.initSprite();
    this.currScene.add.existing(this);
    this.cursors = this.currScene.input.keyboard.createCursorKeys();
    this.currScene.anims.create({
      key: "mario-walk",
      frames: this.currScene.anims.generateFrameNames("atlas", {
        prefix: "mario-walk",
        start: 0,
        end: 1
      }),
      frameRate: 5,
      repeat: -1
    });
    this.jump = this.scene.sound.add("jump");
  }


  update(): void {
    // if (this.body.velocity.y = 0) {
    //   this.isJumping = false;
    // }
    this.animate()
    this.moveInput()
  }

  private initSprite() {
    this.acceleration = 500;
    this.jumpHeight = 340;
    this.isJumping = false;
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.currScene.physics.world.enable(this);
    this.body.setSize(12, 16);
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 300;
  }

  private animate() {
    if (this.body.velocity.y > 0) {
      this.setTexture("atlas", "mario-jump")
    } else if (this.body.velocity.x != 0) {
      this.anims.play("mario-walk", true)
    } else {
      this.setTexture("atlas", "mario-idle")
    }


  }

  private moveInput() {
    if (this.body.velocity.y == 0) {
      this.isJumping = false;
    }
    if (this.cursors.right.isDown) {
      this.body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    } else if (this.cursors.left.isDown) {
      this.body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }
    if (this.cursors.up.isDown && !this.isJumping) {
      this.jump.play();
      this.body.setVelocityY(-this.jumpHeight);
      this.isJumping = true;
    }
  }
}
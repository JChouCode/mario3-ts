export class Mario extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private acceleration: number;
  private jumpHeight: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  body!: Phaser.Physics.Arcade.Body;
  private jump: Phaser.Sound.BaseSound;
  private isJumping: boolean;
  private alive: boolean;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
    this.currentScene.anims.create({
      key: "mario-walk",
      frames: this.currentScene.anims.generateFrameNames("atlas", {
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
    this.animate()
    this.moveInput()
  }

  private initSprite() {
    this.acceleration = 500;
    this.jumpHeight = 300;
    this.isJumping = false;
    this.alive = true;
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    this.currentScene.physics.world.enable(this);
    this.body.setSize(12, 15);
    this.body.setOffset(0, 0);
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 300;
    // this.body.setCollideWorldBounds(true);
  }

  private animate() {
    if (this.alive) {
      if (this.body.velocity.y != 0) {
        this.setTexture("atlas", "mario-jump")
      } else if (this.body.velocity.x != 0) {
        this.anims.play("mario-walk", true)
      } else {
        this.setTexture("atlas", "mario-idle")
      }
    }
  }

  private moveInput() {
    if (this.alive) {
      if (this.y > this.currentScene.sys.canvas.height) {
        this.hit();
      }
      if (
        this.body.onFloor() ||
        this.body.touching.down ||
        this.body.blocked.down
      ) {
        this.isJumping = false;
      } else {
        this.isJumping = true;
      }
      if (this.cursors.right.isDown) {
        this.body.setAccelerationX(this.acceleration);
        // this.body.setVelocityX(this.acceleration);
        this.setFlipX(false);
      } else if (this.cursors.left.isDown) {
        this.body.setAccelerationX(-this.acceleration);
        // this.body.setVelocityX(this.acceleration);
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

  protected bounce(): void {
    // this.currentScene.add.tween({
    //   targets: this,
    //   props: { y: this.y - 30 },
    //   duration: 200,
    //   ease: "Power1",
    //   yoyo: true
    // });
    this.body.setVelocityY(-200);
  }

  protected hit(): void {
    this.alive = false;
    this.body.stop();
    this.anims.stop();
    this.setTexture("atlas", "mario-dead")
    this.body.setVelocityY(-400);
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
  }
}
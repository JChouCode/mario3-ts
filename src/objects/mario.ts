import sleep from "sleep-promise"

export class Mario extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  private acceleration: number;
  private jumpHeight: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  body!: Phaser.Physics.Arcade.Body;
  private jump: Phaser.Sound.BaseSound;
  private isJumping: boolean;
  private alive: boolean;
  private isBig: boolean;
  private isTransforming: boolean;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
    this.jump = this.scene.sound.add("jump");
    this.isBig = false;
    this.setOrigin(0, 1);
    this.isTransforming = false;
  }


  update(): void {
    if (this.isTransforming) {
      return;
    }
    this.animate()
    this.moveInput()
  }

  private initSprite() {
    this.acceleration = 500;
    this.jumpHeight = 300;
    this.isJumping = false;
    this.alive = true;
    this.setOrigin(0.5, 1);
    this.setFlipX(false);

    this.currentScene.physics.world.enable(this);
    this.body.setSize(12, 15);
    // this.body.setSize(16, 27);
    this.body.setOffset(0, 0);
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 300;
    // this.body.setCollideWorldBounds(true);
  }

  private animate() {
    if (this.alive) {
      if (this.body.velocity.y != 0) {
        this.anims.stop();
        if (this.isBig) {
          this.setTexture("atlas", "mario-big-jump");
          console.log("jump");
        } else {
          this.setTexture("atlas", "mario-jump");
        }
      } else if (this.body.velocity.x != 0) {
        if (this.isBig) {
          this.anims.play("mario-walk-big", true);
        } else {
          this.anims.play("mario-walk", true);
        }
      } else {
        this.anims.stop();
        if (this.isBig) {
          this.setTexture("atlas", "mario-big-idle");
        } else {
          this.setTexture("atlas", "mario-idle");
        }
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

  protected bounce(): void {
    this.body.setVelocityY(-200);
  }

  protected async hit(): Promise<void> {
    this.alive = false;
    this.body.stop();
    this.anims.stop();
    this.setTexture("atlas", "mario-dead")
    this.body.setVelocityY(-400);
    this.body.checkCollision.up = false;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    await sleep(3000);
    this.currentScene.scene.restart();
  }

  protected goBig(): void {
    this.anims.stop();
    this.isBig = true;
    this.body.setSize(14, 27);
    this.setOrigin(0, 1);
    this.body.stop();
    this.body.allowGravity = false;
    this.isTransforming = true;
    // freeze everything else
    this.once("animationcomplete",
      () => {
        this.isBig = true;
        this.isTransforming = false;
        this.body.allowGravity = true;
        this.body.setSize(14, 27);
        this.off("animationcomplete");
        this.y = 298;
        this.setOrigin(0.5, 0);
      }, this);
    this.anims.play("mario-transform", true);
    // this.off("animationcomplete");
    // this.anims.stop();
  }
}
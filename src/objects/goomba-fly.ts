import { Enemy, EnemyType } from "./enemy";

export class GoombaFly extends Enemy {

  private haveWing: boolean;
  private jumpHeight: number;
  private isJumping: boolean;
  private wingLeft: Wing;
  private wingRight: Wing;

  constructor(params) {
    super(params);
    this.speed = -50;
    this.body.setOffset(0, 0);
    this.enemyType = EnemyType.goombaFly;

    this.jumpHeight = -230;
    this.isJumping = false;

    this.wingLeft = new Wing({
      scene: this.currentScene,
      x: this.x - 4,
      y: this.y - this.height / 3,
      key: "atlas",
      frame: "wing0",
    }, true);
    this.wingLeft.anims.play("wing", true);
    this.wingRight = new Wing({
      scene: this.currentScene,
      x: this.x + this.width / 1.5 + 2,
      y: this.y - this.height / 3,
      key: "atlas",
      frame: "wing0",
    }, false);
    this.wingRight.anims.play("wing", true);
    this.haveWing = true;
    this.setDepth(99);

  }

  update() {
    if (!this.dead) {
      if (this.shown) {
        // Check if landed
        if (
          this.body.onFloor() ||
          this.body.touching.down ||
          this.body.blocked.down
        ) {
          this.isJumping = false;
        }
        this.body.setVelocityX(this.speed);
        if (this.haveWing) {
          this.wingLeft.body.setVelocityX(this.speed);
          this.wingRight.body.setVelocityX(this.speed);
        }
        // Reverse if hit wall
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
        }
        this.anims.play("goomba-red", true);
        if (!this.isJumping && this.haveWing) {
          this.body.setVelocityY(this.jumpHeight);
          this.wingLeft.body.setVelocityY(this.jumpHeight);
          this.wingRight.body.setVelocityY(this.jumpHeight);
          this.isJumping = true;
        }
      } else {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          this.getBounds(),
          this.currentScene.cameras.main.worldView
        )) {
          this.shown = true;
        }
      }
    }
  }

  headHit(): void {
    if (this.haveWing) {
      // this.wingLeft.destroy();
      // this.wingRight.destroy();
      this.haveWing = false;
    }
    else {
      this.dead = true;
      this.anims.stop();
      this.setTexture("atlas", "goomba-red-flat");
      this.setDisplayOrigin(0, 0);
      this.body.stop();
      this.body.setSize(16, 9);
      this.destroy();
      // this.body.allowGravity = false;
      // this.currentScene.add.tween({
      //   targets: ,
      //   props: { alpha: 0 },
      //   duration: 800,
      //   ease: "Power0",
      //   yoyo: false,
      //   onComplete: function () {
      //     this.isDead();
      //   }
      // });
    }
  }
}

export class Wing extends Phaser.GameObjects.Sprite {
  private currentScene: Phaser.Scene;
  body!: Phaser.Physics.Arcade.Body;

  constructor(params, left: boolean) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.initSprite();
    this.setFlipX(left);
  }

  private initSprite() {
    this.setOrigin(0, 0);
    this.currentScene.add.existing(this);
    this.currentScene.physics.world.enable(this);
    this.body.setSize(8, 9);
  }
}
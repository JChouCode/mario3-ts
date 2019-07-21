import { Enemy, EnemyType } from "./enemy";

export class GoombaFly extends Enemy {

  private haveWing: boolean;
  private jumpHeight: number;
  private isJumping: boolean;
  // private wingLeft: Wing;
  // private wingRight: Wing;

  constructor(params) {
    super(params);
    this.speed = -50;
    this.body.setOffset(-100, 0);
    // this.setDisplayOrigin(0, 0);
    this.setOrigin(0, 1);
    // this.body.setSize(16, 16);
    // this.setOrigin(0.5, 0.5);
    // this.setDisplayOrigin(0.5, 0.5)
    this.enemyType = EnemyType.goombaFly;
    this.body.setSize(24, 18);
    this.jumpHeight = -230;
    this.isJumping = false;
    this.haveWing = true;
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
        // Reverse if hit wall
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
        }
        if (this.haveWing) {
          this.anims.play("goomba-fly", true);
        } else {
          this.anims.play("goomba-red", true);
        }
        if (!this.isJumping && this.haveWing) {
          this.body.setVelocityY(this.jumpHeight);
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
      this.haveWing = false;
    }
    else {
      this.dead = true;
      this.anims.stop();
      this.setTexture("atlas", "goomba-red-flat");
      this.setDisplayOrigin(0, 0);
      this.body.stop();
      this.body.setSize(16, 9);
      // this.destroy();
      // this.body.allowGravity = false;
      this.currentScene.add.tween({
        targets: this,
        props: { alpha: 0 },
        duration: 800,
        ease: "Power0",
        yoyo: false,
        onComplete: () => {
          this.isDead();
        }
      });
      // }
      // this.currentScene.tweens.
    }
  }

  // export class Wing extends Phaser.GameObjects.Sprite {
  //   private currentScene: Phaser.Scene;
  //   body!: Phaser.Physics.Arcade.Body;

  //   constructor(params, left: boolean) {
  //     super(params.scene, params.x, params.y, params.key, params.frame);
  //     this.currentScene = params.scene;
  //     this.initSprite();
  //     this.setFlipX(left);
  //   }

  //   private initSprite() {
  //     this.setOrigin(0, 0);
  //     this.currentScene.add.existing(this);
  //     this.currentScene.physics.world.enable(this);
  //     this.body.setSize(8, 9);
  //   }
  // }
}
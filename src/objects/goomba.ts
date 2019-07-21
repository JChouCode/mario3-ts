import { Enemy, EnemyType } from "./enemy";

export class Goomba extends Enemy {
  constructor(params) {
    super(params);
    this.speed = -50;
    this.body.setOffset(0, 0);
    this.enemyType = EnemyType.goomba;
  }

  update() {
    if (!this.dead) {
      if (this.shown) {
        this.body.setVelocityX(this.speed);
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
        }
        this.anims.play("goomba", true);
      } else {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          this.getBounds(),
          this.currentScene.cameras.main.worldView
        )) {
          this.shown = true;
        }
      }
    }
    // else {
    //   this.anims.stop();
    //   this.body.velocity.x = 0;
    //   this.body.checkCollision.none = true;
    // }
  }

  headHit(): void {
    this.dead = true;
    this.anims.stop();
    this.setTexture("atlas", "goomba-flat");
    this.setDisplayOrigin(0, 0);
    this.body.setSize(16, 9);
    this.body.stop();
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
  }




}
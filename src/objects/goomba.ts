import { Enemy } from "./enemy";

export class Goomba extends Enemy {
  constructor(params) {
    super(params);
    this.speed = 50;
    this.body.setOffset(0, 0);
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
          console.log("hm");
          this.shown = true;
        }
      }
    } else {
      this.anims.stop();
      this.body.velocity.x = 0;
      this.body.checkCollision.none = true;
    }
  }

  headHit(): void {
    this.dead = true;
    this.body.setOffset(0, 5);
    this.setTexture("atlas", "goomba-flat");
  }




}
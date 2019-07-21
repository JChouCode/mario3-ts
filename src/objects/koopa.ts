import { Enemy, EnemyType } from "./enemy";

export class Koopa extends Enemy {

  private inShell: boolean;
  private shellSpeed: number;

  constructor(params) {
    super(params);
    this.speed = -50;
    this.inShell = false;
    this.shellSpeed = 170;
    this.setOrigin(0);
    this.enemyType = EnemyType.koopa;
    // this.body.setOffset(0, 100);
    // this.set
    // this.setDisplayOrigin(0, 100);
    this.body.setSize(16, 26);
    this.setFlipX(false);
  }

  update() {
    if (!this.dead) {
      if (this.shown) {
        //Regardless koopa in shell or not, bounce off walls
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.setVelocityX(this.speed);
          this.flipX = !this.flipX;
        }
        // Koopa not in shell
        if (!this.inShell) {
          this.body.setVelocityX(this.speed);
          this.anims.play("koopa", true);
        }
        // Koopa in shell
        else {
          if (this.body.velocity.x != 0) {
            this.anims.play("koopa-shell", true);
          }
          // else {
          //   this.setTexture("atlas", "koopa-shell-idle");
          // }
        }
      }
      // If on screen, show
      else {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          this.getBounds(),
          this.currentScene.cameras.main.worldView
        )) {
          this.shown = true;
        }
      }
    }
    // Koopa dead
    else {
      this.anims.stop();
      this.body.stop();
      this.body.checkCollision.none = true;
    }
  }

  headHit(): void {
    if (!this.inShell) {
      this.inShell = true;
      // make body smaller
      // this.setDisplayOrigin(0, -15);
      this.setTexture("atlas", "koopa-shell-idle");
      this.setDisplayOrigin(0, 0);
      this.body.setSize(16, 16);
      this.anims.stop();
      // this.setTexture("atlas", "koopa-shell-idle");
      this.body.stop();
    }
  }

  isInShell(): boolean {
    return this.inShell;
  }

  isKicked(): boolean {
    return this.inShell && this.body.velocity.x != 0;
  }

  shoot(dir: number): void {
    if (dir == 1) {
      this.speed = this.shellSpeed;
      this.body.velocity.x = this.speed;
    } else {
      this.speed = -this.shellSpeed;
      this.body.velocity.x = this.speed;
    }
  }




}
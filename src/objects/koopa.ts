import { Enemy, EnemyType } from "./enemy";

export enum KoopaColor {
  green,
  red
}

export class Koopa extends Enemy {

  private inShell: boolean;
  private shellSpeed: number;
  private koopaColor: KoopaColor;

  constructor(params, koopaColor: KoopaColor) {
    super(params);
    this.speed = -50;
    this.inShell = false;
    this.shellSpeed = 170;
    this.setOrigin(0);
    this.enemyType = EnemyType.koopa;
    this.koopaColor = koopaColor;
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
          if (this.koopaColor == KoopaColor.green) {
            this.anims.play("koopa", true);
          } else {
            this.anims.play("koopa-red", true);
          }
        }
        // Koopa in shell
        else {
          if (this.body.velocity.x != 0) {
            if (this.koopaColor == KoopaColor.green) {
              this.anims.play("koopa-shell", true);
            } else {
              this.anims.play("koopa-shell-red", true);
            }
          }
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
      if (this.koopaColor == KoopaColor.green) {
        this.setTexture("atlas", "koopa-shell-idle");
      } else {
        this.setTexture("atlas", "koopa-shell-red-idle");
      }
      this.setDisplayOrigin(0, 0);
      this.body.setSize(16, 16);
      this.anims.stop();
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
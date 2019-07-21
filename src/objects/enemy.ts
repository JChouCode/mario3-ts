export enum EnemyType {
  goomba,
  koopa,
  goombaFly,
}

export class Enemy extends Phaser.GameObjects.Sprite {
  protected currentScene: Phaser.Scene;
  protected shown: boolean;
  protected dead: boolean;
  protected speed: number;
  protected enemyType: EnemyType;
  body!: Phaser.Physics.Arcade.Body;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    // variables
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);

    // create goomba walk animation
    this.currentScene.anims.create({
      key: "goomba",
      frames: this.currentScene.anims.generateFrameNames("atlas", {
        prefix: "goomba",
        start: 0,
        end: 1
      }),
      frameRate: 5,
      repeat: -1
    });

    // create koopa walk animation
    this.currentScene.anims.create({
      key: "koopa",
      frames: this.currentScene.anims.generateFrameNames("atlas", {
        prefix: "koopa",
        start: 0,
        end: 1
      }),
      frameRate: 5,
      repeat: -1
    });

    this.currentScene.anims.create({
      key: "koopa-shell",
      frames: this.currentScene.anims.generateFrameNames("atlas", {
        prefix: "koopa-shell",
        start: 0,
        end: 2
      }),
      frameRate: 25,
      repeat: -1
    });


  }

  update(): void {
    if (this.x < 0) {
      this.destroy()
    }
  }
  protected initSprite() {
    // variables
    this.shown = false;
    this.dead = false;

    // sprite
    this.setOrigin(0, 0);
    // this.setFrame(0);

    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(16, 16);
    // this.body.setCollideWorldBounds(true);
  }

  protected isDead(): void {
    this.destroy();
  }

  protected getEnemyType(): EnemyType {
    return this.enemyType;
  }

  protected reverse(): void {
    this.speed = -this.speed;
    this.body.velocity.x = this.speed;
  }

  protected shellHit(dir: number): void {
    this.dead = true;
    this.angle = 180;
    this.body.stop();
    this.body.velocity.y = -50;
    this.body.velocity.x = dir * 40;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    this.body.checkCollision.up = false;
  }


}
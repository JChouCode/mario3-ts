export class Enemy extends Phaser.GameObjects.Sprite {
  protected currentScene: Phaser.Scene;
  protected shown: boolean;
  protected dead: boolean;
  protected speed: number;
  body!: Phaser.Physics.Arcade.Body

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    // variables
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);

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
  }

  protected initSprite() {
    // variables
    this.shown = false;
    this.dead = false;

    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);

    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(16, 16);
    this.body.setCollideWorldBounds(true);
  }

  protected isDead(): void {
    this.destroy();
  }
}
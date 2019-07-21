export class Brick extends Phaser.GameObjects.Sprite {

  private currentScene: Phaser.Scene;
  body!: Phaser.Physics.Arcade.Body;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.setOrigin(0, 0);
    this.currentScene.physics.world.enable(this);
    this.body.setSize(16, 16);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  update(): void {
    this.anims.play("brick", true);
  }

  boxHit(): void {
    for (let i = -2; i <= 2; i++) {
      if (i == 0) {
        continue
      }
      let brick = this.currentScene.add.existing(new smallBrick({
        scene: this.currentScene,
        x: this.x + this.width / 2,
        y: this.y,
        key: "atlas",
        frame: "brickball"
      }, i));
    }
    this.destroy();

  }
}

export class smallBrick extends Phaser.GameObjects.Sprite {

  private currentScene: Phaser.Scene;
  body!: Phaser.Physics.Arcade.Body;

  constructor(params, i: number) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
    this.currentScene.physics.world.enable(this);
    this.body.setSize(4, 4);
    this.body.setVelocity(20 * i, -70 * Math.abs(i));
  }

  private initSprite() {
    this.setOrigin(0, 0);
    this.setDisplaySize(4, 4);
  }

  update() {
    if (this.y - 4 > this.currentScene.sys.canvas.height) {
      this.destroy();
    }
  }
}
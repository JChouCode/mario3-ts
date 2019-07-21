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
    // this.setTexture("atlas", "brick");
    this.currentScene.physics.world.enable(this);
    this.body.setSize(8, 8);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  update(): void {
    if (this.body.touching.down) {
      for (let i = -2; i < 2; i++) {
        let brick = this.currentScene.add.existing(new smallBrick({
          scene: this.currentScene,
          x: this.x,
          y: this.y - 40,
          key: "atlas",
          frame: "brick"
        }, i));
        //   .sprite(this.x, this.y, "atlas", "brick")
        //   .setOrigin(0, 0)
        //   .setDisplaySize(4, 4);
        // let brickBody: Phaser.Physics.Arcade.Body = brick.body;
        // this.currentScene.physics.world.enable(brick);
        // brickBody.setVelocity(40 * i, -40 * i);
        // brickBody.setSize(4, 4);
      }
      this.destroy();
    }
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
    this.setDisplaySize(4, 4);
    this.body.setVelocity(40 * i, -40 * i);
  }

  private initSprite() {
    this.setOrigin(0, 0);
    // this.setTexture("atlas", "brick");
    this.setDisplaySize(4, 4);
  }

  update() {
    if (this.y - 4 > this.currentScene.sys.canvas.height) {
      this.destroy();
    }
  }
}
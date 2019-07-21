// import { PowerUp } from "./power-up"

export class Coin extends Phaser.GameObjects.Sprite {

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
    this.body.setSize(14, 16);
  }

  update(): void {
    this.anims.play("coin", true);
  }

}


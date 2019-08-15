import { Coin } from "./coin"
import { PowerUp } from "./power-up"

export enum Collectible {
  coin,
  mushroom
}

export class Question extends Phaser.GameObjects.Sprite {

  private currentScene: Phaser.Scene;
  body!: Phaser.Physics.Arcade.Body;
  private content: Collectible;
  private timeline: Phaser.Tweens.Timeline;
  private opened: boolean;

  constructor(params, content: Collectible) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.initSprite();
    this.opened = false;
    this.setDepth(1);
    this.content = content;
    this.timeline = this.currentScene.tweens.createTimeline({});
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
    if (!this.opened) {
      this.anims.play("question", true);
    }
  }

  boxHit(): void {
    if (!this.opened) {
      this.opened = true;
      this.currentScene.sound.play("bump");
      this.anims.stop();
      this.setTexture("atlas", "question-empty");
      this.timeline.add({
        targets: this,
        props: { y: this.y - 10 },
        duration: 60,
        ease: "Power0",
        yoyo: true,
      });
      this.timeline.play();
    }
  }

  spawnCoin(): void {
    this.currentScene.sound.play("coin");
    let coin = new Coin({
      scene: this.currentScene,
      x: this.x + this.width / 2,
      y: this.y - 20,
      key: "atlas",
      frame: "coin0"
    });
    coin.anims.play("coin", true);
    this.currentScene.tweens.add({
      targets: coin,
      props: { y: this.y - 50 },
      duration: 200,
      ease: "Power0",
      yoyo: true,
      onComplete: () => { coin.destroy() }
    });
  }

  getContent(): Collectible {
    return this.content;
  }

  isOpened(): boolean {
    return this.opened;
  }
}




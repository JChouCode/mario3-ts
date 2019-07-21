export class PowerUp extends Phaser.GameObjects.Sprite {

  private currentScene: Phaser.Scene;
  body!: Phaser.Physics.Arcade.Body;
  private speed: number;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;
    this.speed = 40;
    this.currentScene.physics.world.enable(this);
    this.currentScene.add.existing(this);
    this.body.setSize(16, 16);
    this.body.allowGravity = false;
    this.setDepth(0);
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 9 },
      duration: 800,
      ease: "linear",
      yoyo: false,
      onComplete: () => {
        this.body.setVelocityX(this.speed);
        this.body.allowGravity = true;
      }
    })
  }

  update() {
    if (this.body.blocked.right || this.body.blocked.left) {
      this.speed = -this.speed;
      this.body.velocity.x = this.speed;
    }
  }
}
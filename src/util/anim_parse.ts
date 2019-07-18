export class AnimParser {
  private scene: Phaser.Scene;
  private json: any;

  constructor(scene: Phaser.Scene, json: any) {
    this.scene = scene;
    this.json = json;
  }

  parseAnims() {
    for (let anim of this.json) {
      let frames = [];
      for (let frame in anim.frames) {
        frames.push()
      }
    }
  }
}
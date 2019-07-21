
import "phaser";
import { MainScene } from "./scenes/game-scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  // width: 800,
  // height: 344,
  type: Phaser.AUTO,
  // zoom: 2,
  scale: {
    parent: 'phaser-example',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 677,
    height: 344
  },
  parent: "game",
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 475 }
    }
  },
  input: {
    keyboard: true
  },
  backgroundColor: "#f8f8f8",
  render: { pixelArt: true, antialias: false }
};

// game class
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new Game(config);
});


import "phaser";
import { MainScene } from "./scenes/game-scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 344,
  type: Phaser.AUTO,
  parent: "game",
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: {
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


import { Mario } from "../objects/mario";

export class MainScene extends Phaser.Scene {

  private phaserSprite: Phaser.GameObjects.Sprite;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;

  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private aboveLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private plantLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private player: Mario;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  init(): void { }

  preload(): void {
    this.load.image("tileset", "./src/assets/tileset.png");
    this.load.tilemapTiledJSON("map", "./src/assets/map.json");
    this.load.atlas("atlas", "./src/assets/atlas.png", "./src/assets/atlas.json");
    this.load.audio("bgmusic", "./src/assets/bgmusic.mp3");
    this.load.audio("jump", "./src/assets/jump.wav");
  }

  create(): void {
    let bgmusic = this.sound.add("bgmusic");
    bgmusic.play();
    this.map = this.make.tilemap({ key: "map" });
    this.tileset = this.map.addTilesetImage("mariotest4", "tileset");
    this.backgroundLayer = this.map.createStaticLayer("background", this.tileset, 0, 0)
    this.aboveLayer = this.map.createStaticLayer("above", this.tileset, 0, 0)
    this.plantLayer = this.map.createStaticLayer("plant above", this.tileset, 0, 0)
    this.player = new Mario({
      scene: this,
      x: 10,
      y: 100,
      key: "atlas",
      frame: "mario-idle"
    });
    this.backgroundLayer.setCollisionByProperty({ collides: true });
    this.aboveLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, this.backgroundLayer);
    this.physics.add.collider(this.player, this.aboveLayer);

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(): void {
    this.player.update()
  }
}


import { Mario } from "../objects/mario";
import { Goomba } from "../objects/goomba";

export class MainScene extends Phaser.Scene {

  private phaserSprite: Phaser.GameObjects.Sprite;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;

  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private aboveLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private plantLayer: Phaser.Tilemaps.StaticTilemapLayer;

  private player: Mario;
  private enemies: Phaser.GameObjects.Group;

  private stomp: Phaser.Sound.BaseSound;
  private lose: Phaser.Sound.BaseSound;
  private bgmusic: Phaser.Sound.BaseSound;

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
    this.load.audio("bgmusic", "./src/assets/level1.mp3");
    this.load.audio("jump", "./src/assets/jump.wav");
    this.load.audio("stomp", "./src/assets/stomp.wav");
    this.load.audio("lose", "./src/assets/lose-life.mp3");
  }

  create(): void {
    this.bgmusic = this.sound.add("bgmusic");
    this.stomp = this.sound.add("stomp");
    this.lose = this.sound.add("lose");
    this.bgmusic.play("", { loop: true });
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

    this.enemies = this.add.group({
      runChildUpdate: true
    });

    this.loadEnemies();


    this.physics.add.collider(this.player, this.backgroundLayer);
    this.physics.add.collider(this.player, this.aboveLayer);
    // this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.enemies, this.backgroundLayer);
    this.physics.add.collider(this.enemies, this.aboveLayer);

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.checkHeadHit,
      null,
      this
    );

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(): void {
    this.player.update()
  }

  private loadEnemies(): void {
    const objects = this.map.getObjectLayer("enemy").objects as any[];
    objects.forEach(object => {
      if (object.type === "goomba") {
        this.enemies.add(
          new Goomba({
            scene: this,
            x: object.x,
            y: object.y - 40,
            key: "atlas",
            frame: "goomba0"
          }));
      }
    });
  }

  private checkHeadHit(_player, _enemy): void {
    if (_player.body.touching.down && _enemy.body.touching.up) {
      this.stomp.play();
      _enemy.headHit();
      _player.bounce();
      this.add.tween({
        targets: _enemy,
        props: { alpha: 0 },
        duration: 1000,
        ease: "Power0",
        yoyo: false,
        onComplete: function () {
          _enemy.isDead();
        }
      });
    } else {
      _player.hit()
      this.bgmusic.stop();
      this.lose.play();
    }

  }


}


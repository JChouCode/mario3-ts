
import { Mario } from "../objects/mario";
import { Goomba } from "../objects/goomba";
import { Koopa } from "../objects/koopa";
import { Enemy, EnemyType } from "../objects/enemy";
import { Question } from "../objects/question"
import { GoombaFly } from "../objects/goomba-fly"
import { Coin } from "../objects/coin"
// import { Brick } from "../objects/brick";

export class MainScene extends Phaser.Scene {

  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private tileset2: Phaser.Tilemaps.Tileset;

  private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private aboveLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private plantLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private blockLayer: Phaser.Tilemaps.StaticTilemapLayer;
  private enemyWallLayer: Phaser.Tilemaps.StaticTilemapLayer;


  private player: Mario;
  private enemies: Phaser.GameObjects.Group;
  private questions: Phaser.GameObjects.Group;
  private enemyWall: Phaser.GameObjects.Group;

  private stomp: Phaser.Sound.BaseSound;
  private lose: Phaser.Sound.BaseSound;
  private bgmusic: Phaser.Sound.BaseSound;
  private kick: Phaser.Sound.BaseSound;

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
    this.load.audio("kick", "./src/assets/kick.wav");
    this.load.audio("bump", "./src/assets/bump.wav");
    this.load.audio("coin", "./src/assets/coin.wav");
  }

  create(): void {
    this.bgmusic = this.sound.add("bgmusic");
    this.stomp = this.sound.add("stomp");
    this.lose = this.sound.add("lose");
    this.kick = this.sound.add("kick");
    this.bgmusic.play("", { loop: true });

    this.map = this.make.tilemap({ key: "map" });
    this.tileset = this.map.addTilesetImage("mariotest4", "tileset");
    this.tileset2 = this.map.addTilesetImage("tileset", "tileset");

    this.backgroundLayer = this.map.createStaticLayer("background", this.tileset, 0, 0);
    this.aboveLayer = this.map.createStaticLayer("above", this.tileset, 0, 0);
    this.plantLayer = this.map.createStaticLayer("plant above", this.tileset, 0, 0);
    this.enemyWallLayer = this.map.createStaticLayer("enemy wall", this.tileset, 0, 0);
    this.blockLayer = this.map.createStaticLayer("blocks", this.tileset2, 0, 0);
    // this.blockLayer2 = this.map.createStaticLayer("blocks", this.tileset, 0, 0);

    this.anims.create({
      key: "question",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "question",
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "coin",
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: "wing",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "wing",
        start: 0,
        end: 1
      }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: "goomba-red",
      frames: this.anims.generateFrameNames("atlas", {
        prefix: "goomba-red",
        start: 0,
        end: 1
      }),
      frameRate: 7,
      repeat: -1
    });

    this.player = new Mario({
      scene: this,
      x: 10,
      y: 100,
      key: "atlas",
      frame: "mario-idle"
    });

    this.backgroundLayer.setCollisionByProperty({ collides: true });
    this.aboveLayer.setCollisionByProperty({ collides: true });
    this.blockLayer.setCollisionByProperty({ collides: true });
    // this.blockLayer2.setCollisionByProperty({ collides: true });
    this.enemyWallLayer.setCollisionByProperty({ collides: true });

    // collide only top
    this.blockLayer.forEachTile(tile => {
      tile.collideLeft = false;
      tile.collideRight = false;
      tile.collideDown = false;
      tile.faceLeft = false;
      tile.faceRight = false;
      tile.faceBottom = false;
    });

    this.enemies = this.add.group({
      runChildUpdate: true
    });

    this.questions = this.add.group({
      runChildUpdate: true
    });

    this.loadEnemies();


    this.physics.add.collider(this.player, this.backgroundLayer);
    this.physics.add.collider(this.player, this.aboveLayer);
    this.physics.add.collider(this.player, this.blockLayer);
    // this.physics.add.collider(this.player, this.enemyWallLayer);
    // this.physics.add.collider(this.player, this.blockLayer2);
    // this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.enemies, this.backgroundLayer);
    this.physics.add.collider(this.enemies, this.enemyWallLayer);
    this.physics.add.collider(this.enemies, this.aboveLayer);
    this.physics.add.collider(this.enemies, this.blockLayer);

    this.physics.add.collider(
      this.player,
      this.enemies,
      this.collideEnemy,
      null,
      this
    );

    this.physics.add.overlap(
      this.enemies,
      this.enemies,
      this.overlapEnemies,
      null,
      this
    );

    this.physics.add.collider(this.player, this.questions, this.collideQuestion, null, this)

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    // camera.startFollow(this.player, false, 1, 1);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update(): void {
    this.player.update()
  }

  private loadEnemies(): void {
    const objects = this.map.getObjectLayer("enemy").objects as any[];
    objects.forEach(object => {
      switch (object.type) {
        case "goomba": {
          this.enemies.add(
            new Goomba({
              scene: this,
              x: object.x,
              y: object.y - 10,
              key: "atlas",
              frame: "goomba0"
            }));
          break;
        }
        case "koopa": {
          this.enemies.add(
            new Koopa({
              scene: this,
              x: object.x,
              y: object.y - 10,
              key: "atlas",
              frame: "koopa0"
            }));
          break;
        }
        case "question": {
          this.questions.add(
            new Question({
              scene: this,
              x: object.x,
              y: object.y,
              key: "atlas",
              frame: "question0"
            }));
          break;
        }
        case "goomba-fly": {
          this.enemies.add(
            new GoombaFly({
              scene: this,
              x: object.x,
              y: object.y - 10,
              key: "atlas",
              frame: "goomba-red0"
            }));
          break;
        }
      }
    });
  }



  private collideEnemy(_player, _enemy): void {
    switch (_enemy.getEnemyType()) {
      case EnemyType.goomba: case EnemyType.goombaFly: {
        if (_player.body.touching.down && _enemy.body.touching.up) {
          this.stomp.play();
          _enemy.headHit();
          _player.bounce();
        } else {
          _player.hit()
          this.bgmusic.stop();
          this.lose.play();
        }
        break;
      }
      case EnemyType.koopa: {
        if (!_enemy.isInShell()) {
          if (_player.body.touching.down && _enemy.body.touching.up) {
            // play sound
            this.stomp.play();
            _enemy.headHit();
            _player.bounce();
          } else {
            _player.hit()
            this.bgmusic.stop();
            this.lose.play();
          }
        } else if (_player.body.touching.right && _enemy.body.touching.left) {
          // kick right
          // set mario to kick anim
          this.kick.play();
          _enemy.shoot(1);
        } else if (_player.body.touching.left && _enemy.body.touching.right) {
          // kick left
          // set mario to kick anim
          this.kick.play();
          _enemy.shoot(-1);
        }
        break;
      }
    }
  }

  private collideQuestion(_player, _question): void {
    if (_player.body.touching.up && _question.body.touching.down) {
      _question.boxHit();
    }
  }

  private overlapEnemies(_enemy1, _enemy2): void {
    if (_enemy1.getEnemyType() == EnemyType.koopa) {
      if (_enemy1.isKicked()) {
        this.sound.play("kick");
        _enemy2.shellHit(1);
      }
    } else if (_enemy2.getEnemyType() == EnemyType.koopa) {
      if (_enemy2.isKicked()) {
        this.sound.play("kick");
        _enemy1.shellHit(1);
      }
    }
  }
  // private collideEnemies(_enemy1, _enemy2): void {
  // let reverse: boolean = true;
  //   switch (_enemy1.getEnemyType(), _enemy2.getEnemyType()) {
  //     case EnemyType.goomba, EnemyType.koopa: {
  //       if (_enemy2.isKicked()) {
  //         this.sound.play("kick");
  //         _enemy1.shellHit(1);
  //         // _enemy2.shoot(1);
  //         reverse = false;
  //       }
  //       break;
  //     }
  //     case EnemyType.koopa, EnemyType.goomba: {
  //       if (_enemy1.isKicked()) {
  //         console.log("hm");
  //         this.sound.play("kick");
  //         _enemy2.shellHit(-1);
  //         // _enemy1.shoot(-1);
  //         reverse = false;
  //       }
  //       break;
  //     }
  //     default: {
  //       return
  //     }
  //   }
  //   if (reverse) {
  //     _enemy1.reverse();
  //     _enemy2.reverse();
  //   }
  // }
}


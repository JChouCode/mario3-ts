
import { Mario } from "../objects/mario";
import { Goomba } from "../objects/goomba";
import { Koopa, KoopaColor } from "../objects/koopa";
import { Enemy, EnemyType } from "../objects/enemy";
import { Question, Collectible } from "../objects/question"
import { GoombaFly } from "../objects/goomba-fly"
import { Coin } from "../objects/coin"
import { Brick } from "../objects/brick";
import { PowerUp } from "../objects/power-up";

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
  private bricks: Phaser.GameObjects.Group;
  private collectibles: Phaser.GameObjects.Group;
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
    this.load.image("tileset", "./src/assets/tileset-extruded.png");
    this.load.tilemapTiledJSON("map", "./src/assets/map.json");
    this.load.atlas("atlas", "./src/assets/atlas.png", "./src/assets/atlas.json");
    this.load.audio("bgmusic", "./src/assets/level1.mp3");
    this.load.audio("jump", "./src/assets/jump.wav");
    this.load.audio("stomp", "./src/assets/stomp.wav");
    this.load.audio("lose", "./src/assets/lose-life.mp3");
    this.load.audio("kick", "./src/assets/kick.wav");
    this.load.audio("bump", "./src/assets/bump.wav");
    this.load.audio("coin", "./src/assets/coin.wav");
    this.load.audio("brick", "./src/assets/brick.wav");
    this.load.audio("mushroom", "./src/assets/mushroom.wav");
    this.load.audio("powerup", "./src/assets/powerup.wav");
  }

  create(): void {
    this.bgmusic = this.sound.add("bgmusic");
    this.stomp = this.sound.add("stomp");
    this.lose = this.sound.add("lose");
    this.kick = this.sound.add("kick");
    this.bgmusic.play("", { loop: true });

    this.map = this.make.tilemap({ key: "map" });
    this.tileset = this.map.addTilesetImage("mariotest4", "tileset", 16, 16, 2, 3);
    this.tileset2 = this.map.addTilesetImage("tileset", "tileset", 16, 16, 2, 3);

    this.backgroundLayer = this.map.createStaticLayer("background", this.tileset, 0, 0);
    this.aboveLayer = this.map.createStaticLayer("above", this.tileset, 0, 0);
    this.plantLayer = this.map.createStaticLayer("plant above", this.tileset, 0, 0);
    this.enemyWallLayer = this.map.createStaticLayer("enemy wall", this.tileset, 0, 0);
    this.blockLayer = this.map.createStaticLayer("blocks", this.tileset2, 0, 0);

    // Create animations
    this.createAnim("question", "question", 0, 3, 7, -1);
    this.createAnim("brick", "brick", 0, 3, 7, -1);
    this.createAnim("coin", "coin", 0, 3, 7, -1);
    this.createAnim("goomba-fly", "goomba-fly", 0, 1, 7, -1);
    this.createAnim("goomba-red", "goomba-red", 0, 1, 5, -1);
    this.createAnim("goomba", "goomba", 0, 1, 5, -1);
    this.createAnim("koopa", "koopa", 0, 1, 5, -1);
    this.createAnim("koopa-red", "koopa-red", 0, 1, 5, -1);
    this.createAnim("koopa-shell", "koopa-shell", 0, 2, 25, -1);
    this.createAnim("koopa-shell-red", "koopa-shell-red", 0, 2, 25, -1);
    this.createAnim("mario-walk", "mario-walk", 0, 1, 5, -1);
    this.createAnim("mario-walk-big", "mario-big", 0, 2, 5, -1);
    this.createAnim("mario-transform", "mario-transform", 0, 1, 15, 7);

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

    // Initialize groups
    this.enemies = this.add.group({
      runChildUpdate: true
    });

    this.questions = this.add.group({
      runChildUpdate: true
    });

    this.bricks = this.add.group({
      runChildUpdate: true
    });

    this.collectibles = this.add.group({
      runChildUpdate: true
    });

    this.loadEnemies();

    // Add colliders
    this.physics.add.collider(this.player, this.backgroundLayer);
    this.physics.add.collider(this.player, this.aboveLayer);
    this.physics.add.collider(this.player, this.blockLayer);

    this.physics.add.collider(this.enemies, this.backgroundLayer);
    this.physics.add.collider(this.enemies, this.enemyWallLayer);
    this.physics.add.collider(this.enemies, this.aboveLayer);
    this.physics.add.collider(this.enemies, this.blockLayer);

    this.physics.add.collider(this.collectibles, this.backgroundLayer);
    this.physics.add.collider(this.collectibles, this.aboveLayer);
    this.physics.add.collider(this.collectibles, this.blockLayer);
    this.physics.add.collider(this.collectibles, this.enemies);
    this.physics.add.collider(this.collectibles, this.questions);

    this.physics.add.collider(
      this.player,
      this.enemies,
      this.collideEnemy,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.overlapCollectible,
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

    this.physics.add.collider(this.player, this.bricks, this.collideBrick, null, this);

    this.physics.add.collider(this.player, this.questions, this.collideQuestion, null, this)

    const camera = this.cameras.main;
    camera.startFollow(this.player, true, 0.1, 0.1);
    camera.setZoom(2);
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
            }, KoopaColor.green));
          break;
        }
        case "koopa-red": {
          this.enemies.add(
            new Koopa({
              scene: this,
              x: object.x,
              y: object.y - 10,
              key: "atlas",
              frame: "koopa-red0"
            }, KoopaColor.red));
          break;
        }
        case "question": {
          if (object.properties.content == "mushroom") {
            console.log("hmm");
            this.questions.add(
              new Question({
                scene: this,
                x: object.x,
                y: object.y,
                key: "atlas",
                frame: "question0"
              }, Collectible.mushroom));
          } else
            this.questions.add(
              new Question({
                scene: this,
                x: object.x,
                y: object.y,
                key: "atlas",
                frame: "question0"
              }, Collectible.mushroom));
          break;
        }
        case "brick": {
          this.bricks.add(
            new Brick({
              scene: this,
              x: object.x,
              y: object.y,
              key: "atlas",
              frame: "brick0"
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
      switch (_question.getContent()) {
        case Collectible.coin: {
          _question.spawnCoin();
          break;
        }
        case Collectible.mushroom: {
          this.collectibles.add(new PowerUp({
            scene: this,
            x: _question.x + _question.width / 2,
            y: _question.y,
            key: "atlas",
            frame: "mushroom"
          }));
          this.sound.play("mushroom");
          break;
        }
      }

    }
  }

  private overlapCollectible(_player, _collectible): void {
    this.sound.play("powerup");
    _player.goBig();
    _collectible.destroy();
  }

  private collideBrick(_player, _brick): void {
    if (_player.body.touching.up && _brick.body.touching.down) {
      this.sound.play("brick");
      _brick.boxHit();
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

  private createAnim(key, prefix, start, end, rate, repeat): void {
    this.anims.create({
      key: key,
      frames: this.anims.generateFrameNames("atlas", {
        prefix: prefix,
        start: start,
        end: end
      }),
      frameRate: rate,
      repeat: repeat
    });
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


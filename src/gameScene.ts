import "phaser";

export class GameScene extends Phaser.Scene {
  deltaCoin: number;
  deltaShark: number;
  deltaTrunk: number;
  lastCoinTime: number;
  lastSharkTime: number;
  lastTrunkTime: number;
  coinsCaught: number;
  coinsFallen: number;
  taken: number;
  emitted: number;
  endWaterfall: Phaser.Physics.Arcade.StaticGroup;
  sky: Phaser.Physics.Arcade.StaticGroup;
  groundLeft: Phaser.Physics.Arcade.StaticGroup;
  groundRight: Phaser.Physics.Arcade.StaticGroup;
  score: Phaser.GameObjects.Text;
  fallen: Phaser.GameObjects.Text;
  keys: Phaser.Types.Input.Keyboard.CursorKeys;

  duck;

  constructor() {
    super({
      key: "GameScene"
    });
  }
  init(): void {
    this.deltaCoin = 1000;
    this.deltaShark = 5150;
    this.deltaTrunk = 2200;
    this.lastCoinTime = 0;
    this.lastSharkTime = 0;
    this.lastTrunkTime = 0;
    this.coinsCaught = 0;
    this.coinsFallen = 0;
    this.taken = 0;
    this.emitted = 0;
  }
  preload(): void {
    this.load.setBaseURL('./');
    this.load.image("coin", "assets/Coin.svg");
    this.load.image("endWaterfall", "assets/End.svg");
    this.load.image("ground", "assets/Ground.svg");
    this.load.image("sky", "assets/Sky.svg");
    this.load.image("duck", "assets/Duck.svg");
    this.load.image("shark", "assets/Shark.svg");
    this.load.image("trunk", "assets/Trunk.svg");
  }

  create(): void {
    this.groundLeft = this.physics.add.staticGroup({
      key: 'ground',
      frameQuantity: 5
    });
    Phaser.Actions.PlaceOnLine(
      this.groundLeft.getChildren(),
      new Phaser.Geom.Line(50, 550, 50, 50),
    );
    this.groundLeft.refresh();

    this.groundRight = this.physics.add.staticGroup({
      key: 'ground',
      frameQuantity: 5
    });
    Phaser.Actions.PlaceOnLine(
      this.groundRight.getChildren(),
      new Phaser.Geom.Line(750, 550, 750, 50),
    );
    this.groundRight.refresh();

    this.endWaterfall = this.physics.add.staticGroup({
      key: 'endWaterfall',
      frameQuantity: 9
    });
    Phaser.Actions.PlaceOnLine(
      this.endWaterfall.getChildren(),
      new Phaser.Geom.Line(10, 550, 900, 550),
    );
    this.endWaterfall.refresh();
  
    this.sky = this.physics.add.staticGroup({
      key: 'sky',
      frameQuantity: 8
    });
    Phaser.Actions.PlaceOnLine(
      this.sky.getChildren(),
      new Phaser.Geom.Line(50, 50, 850, 50),
    );
    this.sky.refresh();
  
    this.score = this.add.text(10, 70, '',
      { font: '24px Arial Bold', fill: '#495AB4' });
    this.fallen = this.add.text(710, 70, '',
      { font: '24px Arial Bold', fill: '#495AB4' });

    this.keys = this.input.keyboard.createCursorKeys();

    this.duck = this.physics.add.sprite(400, 450, 'duck');
    this.duck.setDisplaySize(45, 70);

    this.duck.setCollideWorldBounds(true);
    this.physics.add.collider(this.duck, this.endWaterfall);
  }

  update(time: number): void {
    var diffCoin: number = time - this.lastCoinTime;
    if (diffCoin > this.deltaCoin) {
      this.lastCoinTime = time;
      if (this.deltaCoin > 500) {
        this.deltaCoin -= 50;
      }
      this.emitCoin();
    }
    var diffShark: number = time - this.lastSharkTime;
    if (diffShark > this.deltaShark) {
      this.lastSharkTime = time;
      if (this.deltaShark > 500) {
        this.deltaShark -= 250;
      }
      this.emitShark();
    }
    var diffTrunk: number = time - this.lastTrunkTime;
    if (diffTrunk > this.deltaTrunk) {
      this.lastTrunkTime = time;
      if (this.deltaTrunk > 500) {
        this.deltaTrunk -= 100;
      }
      this.emitTrunk();
    }
    this.score.text = `Amount ${this.coinsCaught} $`;
    this.fallen.text = `${this.coinsFallen} Fallen`;

    if (this.keys.left.isDown) {
      if (this.duck.x > 150) this.duck.x -= 5;
    }
    if (this.keys.right.isDown) {
      if (this.duck.x < 650) this.duck.x += 5;
    }
  }

  private coinTaken(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0x00ff00);
      star.setVelocity(0, 0);
      this.coinsCaught += 1;
      this.taken += 1;
      star.destroy();
    }
  }

  private trunkTaken(trunk: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      trunk.setTint(0xff0000);
      trunk.setVelocity(0, 0);
      this.coinsCaught -= 5;
      trunk.destroy();
      if (this.coinsCaught < 0) {
        this.scene.start(
          "ScoreScene",
          {
            coinsCaught: this.coinsCaught,
            bankrupt: true,
            taken: this.taken,
            emitted: this.emitted,
          },
        );
      }
    }
  }

  private sharkTaken(shark: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      this.duck.setTint(0xff0000);
      shark.setVelocity(0, 0);
      this.time.delayedCall(100, function (shark) {
        shark.destroy();
        this.scene.start(
          "ScoreScene",
          {
            coinsCaught: - this.coinsCaught,
            bankrupt: true,
            taken: this.taken,
            emitted: this.emitted,
          },
        );
      }, [shark], this);
    }
  }

  private onFallCoin(coin: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      coin.setTint(0xff0000);
      this.time.delayedCall(0, function (coin) {
        this.coinsFallen += 1;
        coin.destroy();
        // if (this.coinsFallen > 9) {
        //   this.scene.start(
        //     "ScoreScene",
        //     {
        //       coinsCaught: this.coinsCaught,
        //       bankrupt: false,
        //       taken: this.taken,
        //       emitted: this.emitted,
        //     },
        //   );
        // }
      }, [coin], this);
    }
  }

  private onFallShark(shark: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      shark.setAlpha(0.5);
      this.time.delayedCall(100, function (shark) {
        shark.destroy();
      }, [shark], this);
    }
  }

  private onFallTrunk(trunk: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      trunk.setAlpha(0.5);
      this.time.delayedCall(100, function (trunk) {
        trunk.destroy();
      }, [trunk], this);
    }
  }

  private emitCoin(): void {
    var coin: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(200, 550);
    var y = 100;
    coin = this.physics.add.image(x, y, "coin");
    coin.setDisplaySize(30, 30);
    coin.setVelocity(0, 200);
    coin.setInteractive();
    this.physics.add.collider(
      coin,
      this.duck,
      this.coinTaken(coin),
      null,
      this,
    );
    this.physics.add.collider(
      coin,
      this.endWaterfall,
      this.onFallCoin(coin),
      null,
      this,
    );
    this.emitted += 1;
  }

  private emitShark(): void {
    var shark: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(150, 650);
    var y = 100;
    shark = this.physics.add.image(x, y, "shark");
    // shark.setDisplaySize(100, );
    shark.setVelocity(0, 100);
    shark.setInteractive();
    this.physics.add.collider(
      shark,
      this.duck,
      this.sharkTaken(shark),
      null,
      this,
    );
    this.physics.add.collider(
      shark,
      this.endWaterfall,
      this.onFallShark(shark),
      null,
      this,
    );
  }

  private emitTrunk(): void {
    var trunk: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(150, 650);
    var y = 100;
    trunk = this.physics.add.image(x, y, "trunk");
    trunk.setVelocity(0, 130);
    trunk.setInteractive();
    trunk.setDisplaySize(80, 80);
    this.physics.add.collider(
      trunk,
      this.duck,
      this.trunkTaken(trunk),
      null,
      this,
    );
    this.physics.add.collider(
      trunk,
      this.endWaterfall,
      this.onFallTrunk(trunk),
      null,
      this,
    );
  }
};
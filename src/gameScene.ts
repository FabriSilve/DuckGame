import "phaser";

export class GameScene extends Phaser.Scene {
  deltaCoin: number;
  deltaShark: number;
  lastCoinTime: number;
  lastSharkTime: number;
  coinsCaught: number;
  coinsFallen: number;
  endWaterfall: Phaser.Physics.Arcade.StaticGroup;
  sky: Phaser.Physics.Arcade.StaticGroup;
  groundLeft: Phaser.Physics.Arcade.StaticGroup;
  groundRight: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
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
    this.lastCoinTime = 0;
    this.lastSharkTime = 0;
    this.coinsCaught = 0;
    this.coinsFallen = 0;
  }
  preload(): void {
    this.load.setBaseURL('./');
    this.load.image("coin", "assets/Coin.svg");
    this.load.image("endWaterfall", "assets/End.svg");
    this.load.image("ground", "assets/Ground.svg");
    this.load.image("sky", "assets/Sky.svg");
    this.load.image("duck", "assets/Duck.svg");
    this.load.image("shark", "assets/Shark.svg");
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
  
    this.info = this.add.text(10, 70, '',
      { font: '24px Arial Bold', fill: '#495AB4' });

    this.keys = this.input.keyboard.createCursorKeys();

    this.duck = this.physics.add.sprite(400, 450, 'duck');
    // this.duck.setBounce(0.2);
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
        this.deltaShark -= 50;
      }
      this.emitShark();
    }
    this.info.text = `Amount ${this.coinsCaught} $`;

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
      this.time.delayedCall(100, function (star) {
        star.destroy();
      }, [star], this);
    }
  }

  private sharkTaken(shark: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      // this.duck.setTint(0x00ff00);
      shark.setVelocity(0, 0);
      this.coinsCaught = 0;
      this.time.delayedCall(100, function (shark) {
        shark.destroy();
        this.scene.start(
          "ScoreScene",
          { starsCaught: this.coinsCaught },
        );
      }, [shark], this);
    }
  }

  private onFall(coin: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      coin.setTint(0xff0000);
      this.coinsFallen += 1;
      this.time.delayedCall(100, function (coin) {
        coin.destroy();
        if (this.coinsFallen > 3) {
          this.scene.start(
            "ScoreScene", // "BankruptScene",
            { starsCaught: this.coinsCaught },
          );
        }
      }, [coin], this);
    }
  }

  private onFallShark(shark: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      // star.setTint(0xff0000);
      // this.coinsFallen += 1;
      this.time.delayedCall(100, function (shark) {
        shark.destroy();
      }, [shark], this);
    }
  }

  private emitCoin(): void {
    var coin: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(150, 650);
    var y = 100;
    coin = this.physics.add.image(x, y, "coin");
    coin.setDisplaySize(50, 50);
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
      this.onFall(coin),
      null,
      this,
    );
  }

  private emitShark(): void {
    var shark: Phaser.Physics.Arcade.Image;
    var x = Phaser.Math.Between(150, 650);
    var y = 100;
    shark = this.physics.add.image(x, y, "shark");
    shark.setDisplaySize(50, 50);
    shark.setVelocity(0, 200);
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
};
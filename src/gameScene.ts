import "phaser";

export class GameScene extends Phaser.Scene {
  delta: number;
  lastStarTime: number;
  starsCaught: number;
  starsFallen: number;
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
    this.delta = 1000;
    this.lastStarTime = 0;
    this.starsCaught = 0;
    this.starsFallen = 0;
  }
  preload(): void {
    this.load.setBaseURL('./');
    this.load.image("coin", "assets/Coin.svg");
    this.load.image("endWaterfall", "assets/End.svg");
    this.load.image("ground", "assets/Ground.svg");
    this.load.image("sky", "assets/Sky.svg");
    this.load.image("duck", "assets/Duck.svg");
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
    this.duck.setBounce(0.2);
    this.duck.setCollideWorldBounds(true);
  }

  update(time: number): void {
    var diff: number = time - this.lastStarTime;
    if (diff > this.delta) {
      this.lastStarTime = time;
      if (this.delta > 500) {
        this.delta -= 20;
      }
      this.emitCoin();
    }
    this.info.text = `Amount ${this.starsCaught} $`;

    if (this.keys.left.isDown) {
      if (this.duck.x > 150) this.duck.x -= 5;
    }
    if (this.keys.right.isDown) {
      if (this.duck.x < 650) this.duck.x += 5;
    }
  }

  private onClick(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0x00ff00);
      star.setVelocity(0, 0);
      this.starsCaught += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
      }, [star], this);
    }
  }

  private onFall(star: Phaser.Physics.Arcade.Image): () => void {
    return function () {
      star.setTint(0xff0000);
      this.starsFallen += 1;
      this.time.delayedCall(100, function (star) {
        star.destroy();
        if (this.starsFallen > 2) {
          this.scene.start("ScoreScene",
            { starsCaught: this.starsCaught });
        }
      }, [star], this);
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
    coin.on(
      'pointerdown',
      this.onClick(coin),
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
};
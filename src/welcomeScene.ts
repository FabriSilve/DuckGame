import "phaser";

export class WelcomeScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  endWaterfall: Phaser.Physics.Arcade.StaticGroup;
  sky: Phaser.Physics.Arcade.StaticGroup;
  groundLeft: Phaser.Physics.Arcade.StaticGroup;
  groundRight: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({
      key: "WelcomeScene"
    });
  }

  preload(): void {
    this.load.setBaseURL('./');
    this.load.image("endWaterfall", "assets/End.svg");
    this.load.image("ground", "assets/Ground.svg");
    this.load.image("sky", "assets/Sky.svg");
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
  
    var titleText: string = "Duck Life";
    this.title = this.add.text(150, 200, titleText,
      { font: '120px Arial Bold', fill: '#FBFBAC' });
    var hintText: string = "Click to start";
    this.hint = this.add.text(330, 350, hintText,
      { font: '24px Arial Bold', fill: '#FBFBAC' });
    this.input.on('pointerdown', function (/*pointer*/) {
      this.scene.start("GameScene");
    }, this);
  }
};
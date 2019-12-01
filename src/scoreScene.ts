import "phaser";

export class ScoreScene extends Phaser.Scene {
  score: number;
  emitted: number;
  taken: number;
  bankrupt: boolean;
  result: Phaser.GameObjects.Text;
  points: Phaser.GameObjects.Text;
  rateo: Phaser.GameObjects.Text;
  quantity: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  endWaterfall: Phaser.Physics.Arcade.StaticGroup;
  sky: Phaser.Physics.Arcade.StaticGroup;
  groundLeft: Phaser.Physics.Arcade.StaticGroup;
  groundRight: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({
      key: "ScoreScene"
    });
  }
  init(params: any): void {
    this.score = params.coinsCaught;
    this.bankrupt = params.bankrupt;
    this.emitted = params.emitted;
    this.taken = params.taken;
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


    var resultText: string = this.bankrupt
      ? 'Bankrupt! They got you...'
      : 'Great score!';
    const x = this.bankrupt ? 150 : 275;
    this.result = this.add.text(x, 200, resultText,
      { font: '48px Arial Bold', fill: '#FBFBAC' });
    this.points = this.add.text(360, 300, `${this.score} $`,
      { font: '48px Arial Bold', fill: '#FBFBAC' });
    
    const rateo = Math.round((this.taken / this.emitted) * 100) / 100;
    const rateoText = `${this.taken} / ${this.emitted} taken`;
    this.quantity = this.add.text(200, 380, rateoText,
      { font: '28px Arial Bold', fill: '#FBFBAC' });
    this.rateo = this.add.text(500, 380, `${rateo} rateo`,
      { font: '28px Arial Bold', fill: '#FBFBAC' });

    var hintText: string = "Click to restart";
    this.hint = this.add.text(320, 470, hintText,
      { font: '24px Arial Bold', fill: '#FBFBAC' });
    this.input.on('pointerdown', function (/*pointer*/) {
      this.scene.start("GameScene");
    }, this);
  }
};
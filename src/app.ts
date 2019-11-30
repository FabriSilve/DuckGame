import "phaser";

import { GameScene } from "./gameScene";

const config: GameConfig = {
  title: "Starfall",
  width: '100vw',
  height: '100vh',
  parent: "game",
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#18216D"
};

export class StarfallGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new StarfallGame(config);
};
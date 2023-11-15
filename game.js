let player, player_cover;
let cursors;
let bullet1, bullet2, bullet3;
let bullet1_speed, bullet2_speed, bullet3_speed;
let lastFired = 0;
let slowUps;
let isGameOver = false;
let slowDown = false;
let shield, shieldYn, shieldTime;
let timer;
let timerText;
let life = 1;
let player_scale, player_cover_scale;
let particles; // 효과
let emitter; // 효과
let frequency;
let timeElapsed = 0;
let end_flag;
let music, collider_sound;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 12000,
  backgroundColor: 'black',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, GameScene],
};

const game = new Phaser.Game(config);

let player, player_cover, wall = {};
let cursors;
let bullet1, bullet2, bullet3;
let bullet1_speed = 100, bullet2_speed = 100, bullet3_speed = 100;
let lastFired = 0;
let slowUps;
let isGameOver = false;
let slowDown = false;
let shield, shieldYn, shieldTime;
let timer;
let timerText, upText;
let life = 1;
let player_scale, player_cover_scale;
let particles; // 효과
let emitter; // 효과
let frequency;  // shield 가 반복되는 시간
let timeElapsed = 0;
let end_flag;
let music, collider_sound;
const CONFIG_WIDTH = 800;
const CONFIG_HEIGHT = 15000;


const config = {
  type: Phaser.AUTO,
  width: CONFIG_WIDTH,
  height: CONFIG_HEIGHT,
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

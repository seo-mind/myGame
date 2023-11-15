class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' });
    }
  
    preload() {
      this.load.image('startButton', 'assets/sprites/startButton.png');
      this.load.image('background', 'assets/sprites/background.png');  // 배경 이미지 불러오기
    }
  
    create() {
  
      let enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  
      enterKey.on('down', function(event) {
        // Enter 키가 눌렸을 때 게임을 시작합니다.
        this.scene.start('GameScene');
      }, this);
  
      this.add.image(400, 300, 'background');  // 배경 이미지 추가
      let startButton = this.add.image(400, 300, 'startButton').setInteractive();
      startButton.on('pointerdown', () => this.scene.start('GameScene'));
    }
  }
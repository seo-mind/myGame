
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  // 이전에 있던 create(), update() 등의 메서드들...


  preload() {
    this.load.image('player', 'assets/sprites/player.png');

    this.load.image('bullet1', 'assets/sprites/bullet1.png');
    this.load.image('bullet2', 'assets/sprites/bullet2.png');

    this.load.image('bullet3', 'assets/sprites/bullet3.png');

    this.load.image('slowUp', 'assets/sprites/slowUp.png');

    this.load.image('shield', 'assets/sprites/shield.png');
    this.load.image('flame', 'assets/sprites/flame.png');
    this.load.image('end_flag', 'assets/sprites/end_flag.png');
    this.load.image('play_background', 'assets/sprites/play_background.png');
    
    // 배경음악 로드
    this.load.audio('backgroundMusic', 'assets/sounds/backgroundMusic.mp3');

    this.load.audio('collider_player', 'assets/sounds/collider_player.mp3');

  }

  create() {
    // 'background' 이미지를 반복해서 배경으로 사용
    this.add.tileSprite(0, 0, game.config.width, game.config.height, 'play_background').setOrigin(0, 0);
    end_flag = this.physics.add.sprite(config.width / 2, 40, 'end_flag');

    // 제일 위에 깃발 놓자
    // 난이도로 

    // 아이템  , life 추가 but bullet size up 

    // 배경음악 추가
    music = this.sound.add('backgroundMusic');
    collider_sound = this.sound.add('collider_player');
    // 배경음악 재생
    music.play({
        loop: true // 음악이 끝나면 자동으로 다시 시작
    });

    player = this.physics.add.sprite(config.width / 2, config.height -200, 'player'); // 밑 부분에 플레이어 생성
    

    // player_cover = this.physics.add.sprite(config.width / 2, config.height -200, 'player'); // 밑 부분에 플레이어 생성
   

    //player = this.physics.add.sprite(config.width / 2, 100, 'player'); // 밑 부분에 플레이어 생성
    player.setCollideWorldBounds(true);
    
    player_scale = player.scale;
    player.body.setSize(20, 20);
    // player_cover_scale = player_cover.scale;
    // 카메라가 플레이어를 따라가도록 설정
    this.cameras.main.startFollow(player);
    //this.cameras.main.setFollowOffset(0, 0);
    
    this.cameras.main.setViewport(0, 0, this.physics.world.bounds.width,800);
    

    this.cameras.main.setBounds(0, 0, config.width, config.height)
    // x와 y: 제한 영역의 시작점(왼쪽 상단 모서리)을 지정합니다. 이 값은 픽셀 단위입니다.
    // width와 height: 제한 영역의 크기를 지정합니다. 이 값도 픽셀 단위입니다.
    //this.cameras.main.setBounds(0, config.height / 2, config.width, config.height);


    // 카메라의 오프셋 설정
    //
    // 카메라의 오프셋 설정
    
    // 카메라의 이동 범위를 플레이어 주변의 800x600 영역으로 제한
    //this.cameras.main.setBounds(player.x - 400, player.y - 300, 500, 500);
    
    
    // 마우스 입력을 감지할 수 있도록 설정
    //this.input.on('pointermove', this.movePlayer, this);

    bullet1 = this.physics.add.group();
    bullet2 = this.physics.add.group();
    bullet3 = this.physics.add.group();
    shield = this.physics.add.group();
    slowUps = this.physics.add.group();


    cursors = this.input.keyboard.createCursorKeys();

    timeElapsed = 0;
    shieldTime = timeElapsed;
    timerText = this.add.text(15, 15, 'Time: 0', { fontSize: '30px', fill: '#fff' });
    timerText.setScrollFactor(0); // 텍스트를 카메라에 고정
    frequency = 10;
    shieldYn = false;
    timer = this.time.addEvent({
      delay: 1000,  // 1000ms = 1초
      callback: function () {
        timeElapsed++;
        timerText.setText('Time: ' + timeElapsed);

        if (shieldYn == true && timeElapsed > shieldTime) {
          shieldTime += frequency;
          let diagonalBulletType = Math.floor(Math.random() * 3);
          if (diagonalBulletType == 0) {
            bullet1.getChildren().forEach(bullet => {
              bullet.disableBody(false, true);
            });
          } else if (diagonalBulletType == 1) {
            bullet2.getChildren().forEach(bullet => {
              bullet.disableBody(false, true);
            });
          } else if (diagonalBulletType == 2) {
            bullet3.getChildren().forEach(bullet => {
              bullet.disableBody(false, true);
            });
          }

        }
      },
      callbackScope: this,
      loop: true
    });

    life = 1;
    bullet1_speed = 100;
    bullet2_speed = 200;
    bullet3_speed = 200;


    //// 불꽃 효과를 위한 particle manager를 생성합니다.
    particles = this.add.particles('flame');

    // player에 붙일 emitter를 생성합니다.
    emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    // 처음에는 효과를 꺼둡니다.
    emitter.stop();
    emitter.startFollow(player);
  }

  update(time, delta) {

    if (!isGameOver) {

      player.setVelocity(0, 0);
      emitter.stop();
      if (cursors.left.isDown) {
        player.setVelocityX(-200);
        //this.sound.play('leftSound');
        // player.setTexture('leftImage');
        emitter.start();
      } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        emitter.start();
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-200);
        emitter.start();
      } else if (cursors.down.isDown) {
        player.setVelocityY(200);
        emitter.start();
      }


      if (time > lastFired) {

        let bullet_y  = player.y  - 800 > 0 ? player.y  - 800 : 0 ;
        // 무작위로 shield 생성
        if (!isGameOver && Phaser.Math.Between(0, 500) < 30) {
          
          let newShield = shield.create(Phaser.Math.Between(0, config.width), bullet_y, 'shield');
          newShield.setVelocity(0, 100);
        }

        // 무작위로 slow 생성
        if (!isGameOver && Phaser.Math.Between(0, 500) < 30) {
          let slowUp = slowUps.create(Phaser.Math.Between(0, config.width), bullet_y, 'slowUp');
          slowUp.setVelocity(0, 100);
        }

        let b1 = bullet1.get();
        let b2 = bullet2.get();
        let b3 = bullet3.get();


        // let b = [];


        // for( let i = 0; i < 2 ; i++){
        //   b[i] = bullet1.get();
        //   //this.enermyBullet(b[i]);
        // }
        this.enermyBullet(b1);
        this.enermyBullet(b2);
        this.enermyBullet(b3);


        //lastFired = time + 1000;
        //lastFired = time + 500;
        lastFired = time + (1000 - time / 5000);

        bullet1_speed = bullet1_speed + time / 5000;

      }

      // 플레이어와 shield가 충돌했을 때 bullet2를 비활성화
      this.physics.overlap(player, shield, this.shieldHit, null, this);
      this.physics.add.collider(player, bullet1, this.endGame, null, this);
      this.physics.add.collider(player, bullet2, this.endGame, null, this);
      this.physics.add.collider(player, bullet3, this.endGame, null, this);
      this.physics.overlap(player, slowUps, this.collectslowUp, null, this);
      this.physics.overlap(player, end_flag, this.winGame, null, this);
    }


  }

  collectslowUp(player, slowUp) {
    slowUp.disableBody(false, true);

    // 총알의 이동 속도를 느리게 만듬
    slowDown = true;

    // 일정 시간 후에 총알의 이동 속도를 원래대로 복구
    this.time.delayedCall(5000, () => {
      slowDown = false;
    });
  }
  // 플레이어와 shield가 충돌했을 때 호출되는 함수
  shieldHit(player, shield) {
    shield.disableBody(false, true);

    this.addLife(player);
    shieldYn = true;

    // bullet2의 모든 오브젝트를 비활성화
    this.destoryBullet(bullet1);
    this.destoryBullet(bullet2);
    this.destoryBullet(bullet3);

  }

  addLife(player) {
    life++;
    frequency--;
    shieldTime = timeElapsed + frequency;
    player.setScale(player.scale + (player_scale * 0.2));
  }

  minusLife(player) {
    life--;

    frequency++;
    shieldTime = timeElapsed + frequency;
    if (life == 1) {
      shieldYn = false;
    }
    if( life > 0){
      player.setScale(player.scale - (player_scale * 0.2));
    }
    
    return life;
  }
  destoryBullet(bullet) {
    bullet.getChildren().forEach(b => {
      b.disableBody(false, true);
    });
  }

  enermyBullet(bullet) {
    let diagonalBulletType = Math.floor(Math.random() * 3);
    if (diagonalBulletType == 0) {
      diagonalBulletType = 'bullet1';
    } else if (diagonalBulletType == 1) {
      diagonalBulletType = 'bullet2';
    } else if (diagonalBulletType == 2) {
      diagonalBulletType = 'bullet3';
    }

    bullet.setTexture(diagonalBulletType);
    bullet.setActive(true);
    bullet.setVisible(true);
    let bullet_y  = player.y  - 800 > 0 ? player.y  - 800 : 0 
    bullet.setPosition(
      Math.random() * config.width,
      bullet_y
    );
    //bullet.setVelocityY(bullet1_speed);

    // 총알이 플레이어를 향하도록 방향 계산
    let angleToPlayer = Phaser.Math.Angle.BetweenPoints(bullet, player);
    let velocity = this.physics.velocityFromAngle(
      Phaser.Math.RadToDeg(angleToPlayer),
      bullet_y
    );
    bullet.setVelocity(velocity.x, velocity.y);

    let speed = slowDown ? 50 : bullet1_speed;
    this.physics.moveToObject(bullet, player, speed);
  }

  movePlayer(pointer) {
    // 마우스 커서의 위치로 플레이어를 천천히 이동
    this.tweens.add({
      targets: player,
      x: pointer.x,
      y: pointer.y,
      duration: 200  // 이동하는 데 걸리는 시간(밀리초)
    });
  }

  endGame(player, bullet) {

    bullet.disableBody(false, true);
    if (this.minusLife(player) == 0) {
      this.end_game();
      collider_sound.play();
    }
  }
  winGame(player, end_flag) {
    this.end_game(player);
  }

  end_game(){
    this.physics.pause();
    player.setTint(0xff0000);
    isGameOver = true;  // 게임 종료 상태를 저장
    timer.remove();
    emitter.stop();
    this.input.off('pointermove', this.movePlayer, this);
    music.stop();
  }

}
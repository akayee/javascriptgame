import Phaser from 'phaser';
import i18next from 'i18next';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
    this.score = 0;
    this.level = 1;
    this.difficulty = 2; // Varsayılan olarak orta seviye
    this.completed = false;
    this.highScore = 0;
    this.previousScore = 0;
  }
  
  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.difficulty = data.difficulty || 2;
    this.completed = data.completed || false;
    
    // Önceki ve en yüksek skorları yükle
    this.loadScores();
    
    // Şimdiki skoru localStorage'a kaydet
    this.saveScore();
  }
  
  // Skorları localStorage'dan yükleme
  loadScores() {
    // Yüksek skor
    const storedHighScore = localStorage.getItem('typeDefenderHighScore');
    this.highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    
    // Son skor (şu ankinden önceki)
    const storedPreviousScore = localStorage.getItem('typeDefenderLastScore');
    this.previousScore = storedPreviousScore ? parseInt(storedPreviousScore) : 0;
  }
  
  // Mevcut skoru localStorage'a kaydetme
  saveScore() {
    // Önceki skoru sakla
    localStorage.setItem('typeDefenderLastScore', this.score.toString());
    
    // Yüksek skoru güncelle (gerekirse)
    if (this.score > this.highScore) {
      localStorage.setItem('typeDefenderHighScore', this.score.toString());
      this.highScore = this.score;
    }
  }
  
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Arka plan
    this.add.rectangle(0, 0, width, height, 0x0f172a)
      .setOrigin(0, 0);
    
    // Ekran ortasına bir panel ekle
    // eslint-disable-next-line no-unused-vars
    const panel = this.add.rectangle(width / 2, height / 2, width * 0.7, height * 0.7, 0x1e293b)
      .setOrigin(0.5)
      .setStrokeStyle(4, 0x3b82f6);
      
    // Başlık
    let titleText;
    let titleColor;
    if (this.completed) {
      titleText = i18next.t('gameOver.congratulations');
      titleColor = '#4ade80'; // yeşil
    } else {
      titleText = i18next.t('gameOver.gameOver');
      titleColor = '#f87171'; // kırmızı
    }
    
    const gameOverText = this.add.text(width / 2, height * 0.2, titleText, {
      fontFamily: 'Arial',
      fontSize: 42,
      fontStyle: 'bold',
      color: titleColor,
      stroke: '#000000',
      strokeThickness: 6
    });
    gameOverText.setOrigin(0.5);
    
    // Skor ve seviye bilgisi - biraz daha yukarı taşı
    // eslint-disable-next-line no-unused-vars
    const scoreBox = this.add.rectangle(width / 2, height * 0.35, 200, 50, 0x2563eb, 0.7)
      .setOrigin(0.5);
    
    const scoreText = this.add.text(width / 2, height * 0.35, `${i18next.t('gameOver.finalScore')}: ${this.score}`, {
      fontFamily: 'Arial',
      fontSize: 28,
      fontWeight: 'bold',
      color: '#ffffff'
    });
    scoreText.setOrigin(0.5);
    
    // Önceki skor - eklendi
    // eslint-disable-next-line no-unused-vars
    const lastScoreBox = this.add.rectangle(width / 2, height * 0.43, 300, 40, 0x4b5563, 0.7)
      .setOrigin(0.5);
    
    const lastScoreText = this.add.text(width / 2, height * 0.43, `${i18next.t('gameOver.previousScore')}: ${this.previousScore}`, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#e2e8f0'
    });
    lastScoreText.setOrigin(0.5);
    
    // Yüksek skor - eklendi
    // eslint-disable-next-line no-unused-vars
    const highScoreBox = this.add.rectangle(width / 2, height * 0.5, 300, 40, 0xf59e0b, 0.7)
      .setOrigin(0.5);
    
    const highScoreText = this.add.text(width / 2, height * 0.5, `${i18next.t('gameOver.highScore')}: ${this.highScore}`, {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#ffffff'
    });
    highScoreText.setOrigin(0.5);
    
    // Yeni rekor bilgisi
    if (this.score > this.previousScore && this.score === this.highScore) {
      const newRecordText = this.add.text(width / 2, height * 0.57, i18next.t('gameOver.newHighScore'), {
        fontFamily: 'Arial',
        fontSize: 22,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#fcd34d'
      });
      newRecordText.setOrigin(0.5);
      
      // Yeni rekor için parlama animasyonu
      this.tweens.add({
        targets: newRecordText,
        alpha: 0.5,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }
    
    // Ulaşılan seviye bilgisi
    const levelText = this.add.text(width / 2, height * 0.64, `${i18next.t('gameOver.reachedLevel')}: ${this.level}`, {
      fontFamily: 'Arial',
      fontSize: 22,
      color: '#ffffff'
    });
    levelText.setOrigin(0.5);
    
    // Motivasyon mesajı
    let message = '';
    let messageColor = '#ffffff';
    if (this.completed) {
      message = i18next.t('gameOver.completed');
      messageColor = '#4ade80';
    } else if (this.score > 200) {
      message = i18next.t('gameOver.excellent');
      messageColor = '#60a5fa';
    } else if (this.score > 100) {
      message = i18next.t('gameOver.good');
      messageColor = '#fbbf24';
    } else {
      message = i18next.t('gameOver.needPractice');
      messageColor = '#f59e0b';
    }
    
    // eslint-disable-next-line no-unused-vars
    const messageBox = this.add.rectangle(width / 2, height * 0.72, width * 0.6, 60, 0x0f172a, 0.8)
      .setOrigin(0.5);
    
    const messageText = this.add.text(width / 2, height * 0.72, message, {
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
      color: messageColor,
      align: 'center',
      wordWrap: { width: width * 0.6 - 20 }
    });
    messageText.setOrigin(0.5);
    
    // Butonlar
    const buttonStyle = {
      fontFamily: 'Arial',
      fontSize: 22,
      color: '#ffffff',
      backgroundColor: '#3b82f6',
      padding: {
        x: 20,
        y: 12
      }
    };
    
    // Tekrar oyna butonu - ana butondur
    const playAgainButton = this.add.text(width / 2, height * 0.82, i18next.t('gameOver.playAgain'), buttonStyle)
      .setOrigin(0.5)
      .setPadding(15)
      .setStyle({ backgroundColor: '#3b82f6' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame())
      .on('pointerover', () => {
        playAgainButton.setStyle({ backgroundColor: '#2563eb' });
        playAgainButton.setScale(1.05);
      })
      .on('pointerout', () => {
        playAgainButton.setStyle({ backgroundColor: '#3b82f6' });
        playAgainButton.setScale(1);
      });
    
    // Ana menü butonu
    const menuButton = this.add.text(width / 2, height * 0.9, i18next.t('gameOver.mainMenu'), buttonStyle)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#4b5563' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MenuScene'))
      .on('pointerover', () => {
        menuButton.setStyle({ backgroundColor: '#374151' });
        menuButton.setScale(1.05);
      })
      .on('pointerout', () => {
        menuButton.setStyle({ backgroundColor: '#4b5563' });
        menuButton.setScale(1);
      });
  }
  
  restartGame() {
    // Oyunu yeniden başlat, 1. seviyeden başla
    this.scene.start('GameScene', { difficulty: this.difficulty, currentLevel: 1 });
  }
} 
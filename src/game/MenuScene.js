import Phaser from 'phaser';
import i18next from 'i18next';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.highScore = 0;
    this.lastScore = 0;
    this.currentLanguage = i18next.language || 'tr'; // Varsayılan dil
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Skorları localStorage'dan yükle
    this.loadScores();

    // Arka plan
    this.add.rectangle(0, 0, width, height, 0x0f172a)
      .setOrigin(0, 0);

    // Logo
    const logo = this.add.image(width / 2, height * 0.18, 'logo');
    logo.setDisplaySize(300, 100);

    // Skor bilgileri (varsa)
    if (this.lastScore > 0 || this.highScore > 0) {
      // Skor paneli
      const scorePanel = this.add.rectangle(width / 2, height * 0.28, 300, 60, 0x1e293b, 0.8)
        .setOrigin(0.5);

      // Son skor
      if (this.lastScore > 0) {
        this.add.text(width / 2 - 140, height * 0.28 - 12, i18next.t('menu.lastScore') + ":", {
          fontFamily: 'Arial',
          fontSize: 16,
          color: '#e2e8f0',
        }).setOrigin(0, 0.5);

        this.add.text(width / 2 - 65, height * 0.28 - 12, this.lastScore.toString(), {
          fontFamily: 'Arial',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#60a5fa',
        }).setOrigin(0, 0.5);
      }

      // En yüksek skor
      if (this.highScore > 0) {
        this.add.text(width / 2 + 10, height * 0.28 - 12, i18next.t('menu.highScore') + ":", {
          fontFamily: 'Arial',
          fontSize: 16,
          color: '#e2e8f0',
        }).setOrigin(0, 0.5);

        this.add.text(width / 2 + 85, height * 0.28 - 12, this.highScore.toString(), {
          fontFamily: 'Arial',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#f59e0b',
        }).setOrigin(0, 0.5);
      }
    }

    // Tuş açıklamaları başlığı
    this.add.text(width / 2, height * 0.36, i18next.t('menu.keyCommands') + ':', {
      fontFamily: 'Arial',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Tuş açıklamaları - daha görsel ve renkli
    const keyInfos = [
      { key: 'N', type: i18next.t('dataTypes.number'), color: '#60a5fa' },
      { key: 'S', type: i18next.t('dataTypes.string'), color: '#84cc16' },
      { key: 'B', type: i18next.t('dataTypes.boolean'), color: '#f97316' },
      { key: 'F', type: i18next.t('dataTypes.float'), color: '#a855f7' },
      { key: 'O', type: i18next.t('dataTypes.object'), color: '#14b8a6' },
      { key: 'L', type: i18next.t('dataTypes.null'), color: '#94a3b8' },
      { key: 'U', type: i18next.t('dataTypes.undefined'), color: '#f43f5e' }
    ];

    // Tuş açıklamalarını yeniden düzenle - 4 sütun ve 2 satır şeklinde
    const startY = height * 0.42;
    const rowHeight = 40;
    const colWidth = width / 4;
    
    keyInfos.forEach((info, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      
      const x = colWidth * col + colWidth / 2;
      const y = startY + row * rowHeight;
      
      // Tuş kutusu
      const keyBox = this.add.rectangle(x - 40, y, 30, 30, this.hexToInt(info.color))
        .setOrigin(0.5)
        .setStrokeStyle(2, 0xffffff);
      
      // Tuş harfi
      this.add.text(keyBox.x, keyBox.y, info.key, {
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff'
      }).setOrigin(0.5);
      
      // Tür adı
      this.add.text(x + 5, y, ': ' + info.type, {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#ffffff'
      }).setOrigin(0, 0.5);
    });

    // Oyuna başlama açıklaması
    this.add.text(width / 2, height * 0.60, i18next.t('menu.keyboardInfo'), {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Başla butonu
    const buttonStyle = {
      fontFamily: 'Arial',
      fontSize: 22,
      color: '#ffffff',
      backgroundColor: '#4a5568',
      padding: {
        x: 30,
        y: 15
      }
    };

    // Daha büyük ve dikkat çekici bir başla butonu
    const startButton = this.add.text(width / 2, height * 0.70, i18next.t('menu.startGame'), buttonStyle)
      .setOrigin(0.5)
      .setPadding(15)
      .setStyle({ backgroundColor: '#3b82f6' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => startButton.setStyle({ backgroundColor: '#2563eb' }))
      .on('pointerout', () => startButton.setStyle({ backgroundColor: '#3b82f6' }));
      
    // Oyun bilgisi - eslint uyarısını gidermek için değişkeni kullanıyorum
    // eslint-disable-next-line no-unused-vars
    const gameInfoText = this.add.text(width / 2, height * 0.85, i18next.t('menu.gameInfo'), {
      fontFamily: 'Arial',
      fontSize: 16,
      align: 'center',
      color: '#e2e8f0'
    }).setOrigin(0.5);
  }

  // Skorları localStorage'dan yükleme
  loadScores() {
    // Yüksek skor
    const storedHighScore = localStorage.getItem('typeDefenderHighScore');
    this.highScore = storedHighScore ? parseInt(storedHighScore) : 0;
    
    // Son skor
    const storedLastScore = localStorage.getItem('typeDefenderLastScore');
    this.lastScore = storedLastScore ? parseInt(storedLastScore) : 0;
  }

  // HEX renk kodunu Phaser'ın integer renk formatına çevirir
  hexToInt(hexColor) {
    // # işaretini kaldır
    hexColor = hexColor.replace('#', '');
    // Integer değerine çevir
    return parseInt(hexColor, 16);
  }

  startGame() {
    // Normal zorluk seviyesi ile başla (tüm mekanizmaları korumak için)
    this.scene.start('GameScene', { difficulty: 2, currentLevel: 1 });
  }
} 
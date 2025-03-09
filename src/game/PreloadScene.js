import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Yükleme ekranı oluştur
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Yükleniyor...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    // Yükleme olaylarını dinle
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      this.scene.start('MenuScene');
    });
    
    // Görünmeyen bir pixel ve kutu oluştur (placeholder olarak kullanmak için)
    this.createPlaceholders();
    
    // Logo dosyası
    this.load.svg('logo', '/assets/images/logo.svg');
  }

  // Placeholder görsel oluşturma
  createPlaceholders() {
    // Tek pixel placeholder
    const pixel = this.textures.createCanvas('pixel', 1, 1);
    pixel.context.fillStyle = '#ffffff';
    pixel.context.fillRect(0, 0, 1, 1);
    pixel.refresh();

    // Kutu placeholder
    const box = this.textures.createCanvas('box', 80, 80);
    box.context.fillStyle = '#ffffff';
    box.context.fillRect(0, 0, 80, 80);
    box.refresh();
  }
} 
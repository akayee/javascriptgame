import Phaser from 'phaser';
import i18next from 'i18next';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    
    // Oyun ile ilgili değişkenler
    this.score = 0;
    this.lives = 3;
    this.currentLevel = 1;
    this.targetScore = 100; // Geçiş için hedef skor
    this.consecutiveCorrect = 0;
    this.dataTypes = [];
    this.fallingObjects = [];
    this.spawnTimer = null;
    this.levelText = null;
    this.scoreText = null;
    this.livesText = null;
    this.correctSound = null;
    this.wrongSound = null;
    this.typesToSpawn = [];
    this.gameSpeed = 0;
    this.keyButtons = {}; // Arayüz tuş butonları

    // Veri tipleri için örnek değerler
    this.typeExamples = {
      number: ["123", "42", "777", "0", "999"],
      string: ['"Hello"', '"Good"', '"JavaScript"', '"Oyun"', '"Türkçe"'],
      boolean: ["true", "false"],
      float: ["3.14", "2.71", "9.99", "0.5", "1.23"],
      object: ["{ }", '{ id: 1 }', '{ ad: "Ali" }', '{ x: 5, y: 10 }'],
      null: ["null"],
      undefined: ["undefined"]
    };

    // Veri tipleri için renkler
    this.typeColors = {
      number: 0x60a5fa,
      string: 0x84cc16,
      boolean: 0xf97316,
      float: 0xa855f7,
      object: 0x14b8a6,
      null: 0x94a3b8,
      undefined: 0xf43f5e
    };

    // Her seviyede görünecek tipler
    this.levelTypes = {
      1: ['number', 'string', 'boolean'],
      2: ['number', 'string', 'boolean', 'float', 'object'],
      3: ['number', 'string', 'boolean', 'float', 'object', 'null', 'undefined']
    };

    // Her seviyede her tip için kaç tane oluşturulacak minimum sayılar
    this.minTypeCounts = {};
  }

  init(data) {
    // Menüden gelen zorluk seviyesi
    this.difficulty = data.difficulty || 2;
    this.currentLevel = data.currentLevel || 1;
    
    // Seviyeye göre hedef skoru ayarla
    this.setupTargetScore();
    
    // Düzeye göre oyun hızını ve oluşturulacak veri türlerini ayarlama
    this.setupDifficulty();
    
    // Değişkenleri sıfırla
    this.score = 0;
    this.lives = 3;
    this.consecutiveCorrect = 0;
    this.fallingObjects = [];
    this.keyButtons = {};

    // Her tip için minimum görünme sayılarını sıfırla
    this.resetTypeMinCounts();
  }

  // Her tip için minimum oluşturma sayılarını ayarla
  resetTypeMinCounts() {
    this.minTypeCounts = {};
    
    // Bu seviyedeki her veri tipi için minimum 1 tane oluştur
    this.levelTypes[this.currentLevel].forEach(type => {
      this.minTypeCounts[type] = 1;
    });
  }

  setupTargetScore() {
    // Zorluk seviyesine ve mevcut seviye numarasına göre hedef skoru belirle
    switch (this.difficulty) {
      case 1: // Kolay
        this.targetScore = 120 * this.currentLevel;
        break;
      case 2: // Orta
        this.targetScore = 150 * this.currentLevel;
        break;
      case 3: // Zor
        this.targetScore = 200 * this.currentLevel;
        break;
      default:
        this.targetScore = 150 * this.currentLevel;
    }
  }

  setupDifficulty() {
    // Seviyelere göre uygun veri türlerini ayarla
    this.typesToSpawn = [...this.levelTypes[this.currentLevel]];

    // Zorluk seviyesine göre oyun hızını ve oluşturma aralığını ayarla
    switch (this.currentLevel) {
      case 1: // 1. Seviye - Başlangıç (N, S, B)
        this.gameSpeed = 90; // Daha yavaş hız
        this.spawnInterval = 2000; // Daha uzun aralık
        break;
      case 2: // 2. Seviye - İstenen 5 tip (N, S, B, F, O)
        this.gameSpeed = 120; // Daha yavaş hız
        this.spawnInterval = 1800; // Daha uzun aralık
        break;
      case 3: // 3. Seviye - Tüm tipler (N, S, B, F, O, L, U)
        this.gameSpeed = 150; // Daha yavaş hız
        this.spawnInterval = 1500; // Daha uzun aralık
        break;
      default:
        this.typesToSpawn = ['number', 'string', 'boolean'];
        this.gameSpeed = 90;
        this.spawnInterval = 2000;
    }
  }

  create() {
    // Arka plan
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0f172a)
      .setOrigin(0, 0);
    
    // UI oluşturma
    this.createUI();
    
    // Tuş butonlarını etkileşimli hale getir
    this.setupKeyButtons();
    
    // Oyun nesnelerini başlatma
    this.startGame();
    
    // Klavye tuşlarını dinleme
    this.setupKeyboardListeners();
  }

  createUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Üst bilgi çubuğu
    this.add.rectangle(0, 0, width, 40, 0x1e293b)
      .setOrigin(0, 0);
    
    // Skor, can ve seviye metinleri
    this.scoreText = this.add.text(20, 10, i18next.t('game.score') + ': 0', {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff'
    });
    
    this.livesText = this.add.text(width / 2, 10, i18next.t('game.lives') + ': 3', {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff'
    }).setOrigin(0.5, 0);
    
    this.levelText = this.add.text(width - 20, 10, `${i18next.t('game.level')}: ${this.currentLevel} / ${i18next.t('game.target')}: ${this.targetScore}`, {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff'
    }).setOrigin(1, 0);
    
    // Bu seviyede kullanılacak tipler için bilgi
    const activeTypes = this.levelTypes[this.currentLevel];
    
    // Kontrol tuşları için bilgi metni
    const keysInfo = [
      { key: 'N', type: 'number', color: '#60a5fa' },
      { key: 'S', type: 'string', color: '#84cc16' },
      { key: 'B', type: 'boolean', color: '#f97316' },
      { key: 'F', type: 'float', color: '#a855f7' },
      { key: 'O', type: 'object', color: '#14b8a6' },
      { key: 'L', type: 'null', color: '#94a3b8' },
      { key: 'U', type: 'undefined', color: '#f43f5e' }
    ];
    
    // Alt bilgi çubuğu - daha aşağıya al
    const bottomBarY = height - 50; // 40 yerine 50 kullan
    this.add.rectangle(0, bottomBarY, width, 50, 0x1e293b)
      .setOrigin(0, 0)
      .setDepth(10); // Z-index artışı
    
    // Sadece bu seviyede kullanılan tuşlar için butonlar oluştur
    const filteredKeysInfo = keysInfo.filter(info => 
      activeTypes.includes(info.type.toLowerCase())
    );
    
    // Tuş bilgileri - aynı zamanda tıklanabilir butonlar
    const keyWidth = width / filteredKeysInfo.length;
    filteredKeysInfo.forEach((info, index) => {
      const x = keyWidth * index + keyWidth / 2;
      const y = bottomBarY + 25; // Alt çubuğun ortası
      
      // Butonun arka planını oluştur ve etkileşimli yap - renkli kutular
      const buttonBg = this.add.rectangle(x, y, 40, 40, this.hexToInt(info.color), 0.8)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.checkHit(info.type.toLowerCase()))
        .setDepth(11); // Z-index artışı
      
      // Tuş butonunu oluştur (arka plandan sonra)
      const keyButton = this.add.text(x, y, info.key, {
        fontFamily: 'Arial',
        fontSize: 20,
        fontStyle: 'bold',
        color: '#ffffff'
      })
      .setOrigin(0.5)
      .setDepth(12); // Z-index artışı
      
      // Etkileşim efektleri
      buttonBg.on('pointerover', () => { 
        buttonBg.setFillStyle(this.hexToInt(info.color), 1);
        keyButton.setScale(1.2);
      });
      
      buttonBg.on('pointerout', () => { 
        buttonBg.setFillStyle(this.hexToInt(info.color), 0.8);
        keyButton.setScale(1);
      });
      
      // Tuş butonunu kaydeder
      this.keyButtons[info.key] = { text: keyButton, bg: buttonBg };
    });
  }
  
  // HEX renk kodunu Phaser'ın integer renk formatına çevirir
  hexToInt(hexColor) {
    // # işaretini kaldır
    hexColor = hexColor.replace('#', '');
    // Integer değerine çevir
    return parseInt(hexColor, 16);
  }
  
  // Tuş butonlarını ayarla
  setupKeyButtons() {
    // Bu metod, UI'de yarattığımız butonlara ek bir özellik eklenmesine gerek duyulmadığı için boş bırakılabilir
    // createUI içinde butonların tıklanabilirliği ve etkileşimleri zaten ayarlandı
  }

  startGame() {
    // Veri türlerini düzenli aralıklarla oluşturmak için bir zamanlayıcı başlat
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnDataType,
      callbackScope: this,
      loop: true
    });
  }

  setupKeyboardListeners() {
    // Tuş eşlemesi
    this.keyMapping = {
      'N': 'number',
      'S': 'string',
      'B': 'boolean',
      'F': 'float',
      'O': 'object',
      'L': 'null',
      'U': 'undefined'
    };
    
    // Tuşları dinle - sadece bu seviye için gerekli olanları
    const activeTypes = this.levelTypes[this.currentLevel];
    const keys = Object.keys(this.keyMapping).filter(key => 
      activeTypes.includes(this.keyMapping[key])
    );
    
    keys.forEach(key => {
      this.input.keyboard.on('keydown-' + key, () => {
        // Tuşa basıldığında butonun görsel olarak aktif olduğunu göster
        if (this.keyButtons[key]) {
          this.keyButtons[key].bg.setFillStyle(this.hexToInt(this.getColorForKey(key)), 1);
          this.keyButtons[key].text.setScale(1.2);
          
          // 200ms sonra normal haline döndür
          this.time.delayedCall(200, () => {
            this.keyButtons[key].bg.setFillStyle(this.hexToInt(this.getColorForKey(key)), 0.8);
            this.keyButtons[key].text.setScale(1);
          });
        }
        
        this.checkHit(this.keyMapping[key]);
      });
    });
  }

  // Tuş için renk kodu getir
  getColorForKey(key) {
    const colorMap = {
      'N': '#60a5fa',
      'S': '#84cc16',
      'B': '#f97316',
      'F': '#a855f7',
      'O': '#14b8a6',
      'L': '#94a3b8',
      'U': '#f43f5e'
    };
    
    return colorMap[key] || '#ffffff';
  }

  // Rastgele bir veri türü oluşturma
  spawnDataType() {
    if (this.lives <= 0) return;

    // Aktif tipler listesi
    const activeTypes = this.levelTypes[this.currentLevel];
    
    // Öncelikle, minimum sayıda görünmemiş tiplere öncelik ver
    const typesWithMinCount = Object.keys(this.minTypeCounts).filter(
      type => this.minTypeCounts[type] > 0
    );
    
    let dataType;
    if (typesWithMinCount.length > 0) {
      // Rastgele bir tip seç
      const randomIndex = Phaser.Math.Between(0, typesWithMinCount.length - 1);
      dataType = typesWithMinCount[randomIndex];
      // Bu tip için minimum sayıyı azalt
      this.minTypeCounts[dataType]--;
    } else {
      // Tüm tipler en az bir kere göründüyse, rastgele seç
      const randomIndex = Phaser.Math.Between(0, activeTypes.length - 1);
      dataType = activeTypes[randomIndex];
    }
    
    // Bu tipteki değişken için rastgele bir örnek değer seç
    let displayText;
    
    // Boolean türü için özel durum (50% şansla true/false)
    if (dataType === 'boolean') {
      displayText = Math.random() > 0.5 ? "true" : "false";
    } else {
      // Diğer türler için örnekler arasından rastgele seç
      const examples = this.typeExamples[dataType];
      displayText = examples[Phaser.Math.Between(0, examples.length - 1)];
    }
    
    // Rastgele bir x konumu
    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
    
    // Veri türü için bir kare arka plan oluştur ve merkezle
    const boxSize = 80;
    const box = this.add.rectangle(x, 50, boxSize, boxSize, this.typeColors[dataType], 0.9)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xffffff);
    
    // Fizik nesnesini oluştur - ancak görünmez yap
    const dataTypeObj = this.physics.add.sprite(x, 50, 'box');
    dataTypeObj.setAlpha(0); // Görünmez yap
    dataTypeObj.setDisplaySize(boxSize, boxSize);
    
    // Nesnenin veri türü bilgisini sakla
    dataTypeObj.dataType = dataType;
    dataTypeObj.box = box; // Kutuyu nesneye bağla
    dataTypeObj.displayValue = displayText; // Gösterilen değeri sakla
    
    // Fizik ayarları
    dataTypeObj.body.velocity.y = this.gameSpeed;
    
    // Kutuyu da nesneyle beraber hareket ettir (fizik olmayan objeler için)
    this.tweens.add({
      targets: box,
      y: this.cameras.main.height - 80, // Alt sınır
      duration: (this.cameras.main.height - 80 - 50) / this.gameSpeed * 1000, // Nesne ile aynı hızda
      ease: 'Linear'
    });
    
    // Nesneyi listede sakla
    this.fallingObjects.push(dataTypeObj);
    
    // Değişken değerini doğrudan kutunun içine yaz
    const textStyle = {
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      wordWrap: { width: boxSize - 10 }
    };
    
    // Metin oluştur ve kutuya bağla
    const valueText = this.add.text(x, 50, displayText, textStyle);
    valueText.setOrigin(0.5);
    
    // Çok uzun metinleri uygun şekilde küçült
    if (valueText.width > boxSize - 10) {
      const scale = (boxSize - 10) / valueText.width;
      valueText.setScale(scale);
    }
    
    // Metni nesneye bağla
    dataTypeObj.label = valueText;
    
    // Metni de kutunun hareketiyle birlikte hareket ettir
    this.tweens.add({
      targets: valueText,
      y: this.cameras.main.height - 80, // Alt sınır
      duration: (this.cameras.main.height - 80 - 50) / this.gameSpeed * 1000, // Nesne ile aynı hızda
      ease: 'Linear'
    });
  }

  getDataTypeDisplayName(type) {
    // Bu fonksiyon artık direkt olarak kullanılmıyor, typeExamples'dan değerler alınıyor
    switch(type) {
      case 'number': return '123';
      case 'string': return '"Hello"';
      case 'boolean': return 'true';
      case 'float': return '3.14';
      case 'object': return '{ }';
      case 'null': return 'null';
      case 'undefined': return 'undefined';
      default: return type;
    }
  }

  checkHit(pressedType) {
    let closestObject = null;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    
    // En yakın nesneyi bul (y koordinatına göre)
    for (let i = 0; i < this.fallingObjects.length; i++) {
      const obj = this.fallingObjects[i];
      if (obj.y < this.cameras.main.height - 80) {
        const distance = Math.abs(obj.y - (this.cameras.main.height - 80));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestObject = obj;
        }
      }
    }
    
    if (closestObject) {
      if (closestObject.dataType === pressedType) {
        this.handleCorrectHit(closestObject);
      } else {
        this.handleWrongHit(closestObject, pressedType);
      }
    }
  }

  handleCorrectHit(obj) {
    // Doğru tuşa basıldığında
    // Ses efekti çalmıyoruz
    
    // Art arda doğru sayısını artır
    this.consecutiveCorrect++;
    
    // Skor hesaplama
    let points = 10;
    
    // Bonus puanlar
    if (this.consecutiveCorrect >= 5) {
      points += 50;
      this.showFloatingText(obj.x, obj.y, '+50 ' + i18next.t('game.bonus') + '!', 0xfcd34d);
    }
    
    this.score += points;
    this.scoreText.setText(i18next.t('game.score') + ': ' + this.score);
    
    // Hedef skora ulaşıldı mı kontrol et
    this.checkLevelCompletion();
    
    // Animasyon ve puan gösterimi
    this.showFloatingText(obj.x, obj.y, '+' + points, 0x4ade80);
    
    // Nesneyi kaldır
    this.removeObject(obj);
  }

  // Seviye tamamlama kontrolü
  checkLevelCompletion() {
    if (this.score >= this.targetScore) {
      if (this.currentLevel < 3) {
        // Bir sonraki seviyeye geç
        this.currentLevel++;
        this.levelComplete();
      } else {
        // Oyun tamamen bitti
        this.gameComplete();
      }
    }
  }

  // Seviye tamamlandı
  levelComplete() {
    // Zamanlayıcıyı durdur
    if (this.spawnTimer) {
      this.spawnTimer.remove();
    }
    
    // Tüm nesneleri temizle
    this.fallingObjects.forEach(obj => {
      this.removeObject(obj);
    });
    
    // Seviye tamamlandı mesajı
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // eslint-disable-next-line no-unused-vars
    const completeBox = this.add.rectangle(width / 2, height / 2, width / 1.5, height / 2, 0x2563eb, 0.9)
      .setOrigin(0.5)
      .setStrokeStyle(4, 0x1d4ed8);
    
    // eslint-disable-next-line no-unused-vars
    const levelCompleteText = this.add.text(width / 2, height / 2 - 50, `SEVİYE ${this.currentLevel - 1} TAMAMLANDI!`, {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    
    // eslint-disable-next-line no-unused-vars
    const levelScoreText = this.add.text(width / 2, height / 2, `Skorunuz: ${this.score}`, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // eslint-disable-next-line no-unused-vars
    const levelNextText = this.add.text(width / 2, height / 2 + 50, `Seviye ${this.currentLevel} başlıyor...`, {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#bfdbfe'
    }).setOrigin(0.5);
    
    // 3 saniye sonra bir sonraki seviyeye geç
    this.time.delayedCall(3000, () => {
      this.scene.restart({ 
        difficulty: this.difficulty, 
        currentLevel: this.currentLevel 
      });
    }, [], this);
  }

  // Oyun tamamen bitti
  gameComplete() {
    // Oyun sonu ekranına geç
    this.endGame(true);
  }

  handleWrongHit(obj, pressedType) {
    // Yanlış tuşa basıldığında
    // Ses efekti çalmıyoruz
    
    // Art arda doğru sayacını sıfırla
    this.consecutiveCorrect = 0;
    
    // Can kaybı
    this.lives--;
    this.livesText.setText(i18next.t('game.lives') + ': ' + this.lives);
    
    // Skor azaltma
    this.score = Math.max(0, this.score - 5);
    this.scoreText.setText(i18next.t('game.score') + ': ' + this.score);
    
    // Animasyon ve puan gösterimi
    this.showFloatingText(obj.x, obj.y, '-5', 0xef4444);
    
    // İpucu göster
    this.showTypeHint(obj.dataType, pressedType);
    
    // Oyun bitti mi kontrolü
    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  showTypeHint(correctType, pressedType) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // İpucu metni oluştur
    const correctKey = Object.keys(this.keyMapping).find(key => this.keyMapping[key] === correctType);
    
    const hintText = this.add.text(width / 2, height / 2, 
      `Yanlış! Bu bir ${correctType} türü. ${correctKey} tuşu kullanmalıydın!`, {
      fontFamily: 'Arial',
      fontSize: 18,
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
    
    // 2 saniye sonra ipucunu kaldır
    this.time.delayedCall(2000, () => {
      hintText.destroy();
    });
  }

  showFloatingText(x, y, message, color) {
    const text = this.add.text(x, y, message, {
      fontFamily: 'Arial',
      fontSize: 24,
      fontStyle: 'bold',
      color: '#' + color.toString(16)
    }).setOrigin(0.5);
    
    // Animasyon
    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      }
    });
  }

  removeObject(obj) {
    // Arka plan kutusunu da yok et
    if (obj.box) {
      obj.box.destroy();
    }
    
    // Nesneden gelen etiket varsa onu da yok et
    if (obj.label) {
      obj.label.destroy();
    }
    
    // Nesneyi diziden çıkar
    const index = this.fallingObjects.indexOf(obj);
    if (index > -1) {
      this.fallingObjects.splice(index, 1);
    }
    
    // Nesneyi yok et
    obj.destroy();
  }

  endGame(completed) {
    // Zamanlayıcıyı durdur
    if (this.spawnTimer) {
      this.spawnTimer.remove();
    }
    
    // Tüm nesneleri temizle
    this.fallingObjects.forEach(obj => {
      this.removeObject(obj);
    });
    
    // GameOver sahnesine geç
    this.scene.start('GameOverScene', { 
      score: this.score, 
      level: this.currentLevel,
      difficulty: this.difficulty,
      completed: completed
    });
  }

  update() {
    // Ekranın altına ulaşan nesneleri kontrol et
    for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
      const obj = this.fallingObjects[i];
      
      // Nesne ve etiketin pozisyonunu güncelle
      if (obj.label) {
        obj.label.x = obj.x;
        // Metin kutunun içinde kalmalı, ayrı bir güncelleme yapmaya gerek yok
      }
      
      // Oyun alanının alt sınırını, alt çubuk üstü olarak ayarla
      const bottomLimit = this.cameras.main.height - 80; // Alt çubuğa çarpmadan daha da yukarı
      
      // Ekranın altına ulaştı mı?
      if (obj.y > bottomLimit) {
        // Yanlış cevap olarak değerlendir
        this.lives--;
        this.livesText.setText(i18next.t('game.lives') + ': ' + this.lives);
        this.consecutiveCorrect = 0;
        
        // Canlar bitti mi?
        if (this.lives <= 0) {
          this.endGame(false);
          return;
        }
        
        // Animasyon ve uyarı
        this.showFloatingText(obj.x, obj.y - 20, i18next.t('game.missed'), 0xef4444);
        
        // Nesneyi temizle
        this.removeObject(obj);
      }
    }
  }
} 
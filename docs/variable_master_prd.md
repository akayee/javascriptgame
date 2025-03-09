# Variable Master - JavaScript Değişken Türleri Oyunu PRD

## Ürün Özeti

"Variable Master", JavaScript'teki değişken türlerini (`const`, `let`, `var`) ve bu değişkenlerin özelliklerini, scope (kapsam) kurallarını öğretmeyi amaçlayan eğitici bir oyundur. Oyuncular, farklı değişken türlerinin davranışlarını görsel ve interaktif bir şekilde öğrenirler.

## Hedef Kitle

- Yazılıma yeni başlayanlar
- JavaScript öğrenmek isteyenler
- Değişken türlerini ve scope kavramını eğlenceli bir şekilde öğrenmek isteyenler
- 12 yaş ve üzeri kullanıcılar

## Temel Özellikler

Oyun, değişken türlerinin özellikleri ve davranışlarını öğretmek için üç seviyeden oluşur:

## Seviye 1: Değişken Tanımlama

### Görsel Unsurlar:
- **Const**: Mayın (kırmızı renkte)
- **Let**: Plastik kap (mavi renkte)
- **Var**: Balon (yeşil renkte)

### Oynanış:
- Ekranda farklı objelerin resimleri ve değerleri görünür (sayı, metin, boolean vb.)
- Kullanıcı bu değerleri sürükleyerek const, let veya var alanlarına bırakır
- Her değişken türü için belirlenmiş bir alan olacak

### Kurallar:
- Const boş bırakılırsa mayın patlar ve puan kaybedilir
- Let ve var boş bırakılabilir
- Doğru yerleştirmeler için puan kazanılır

### Bilgilendirme Ekranı İçeriği:
```
CONST: Değiştirilemez değişkenler. Mutlaka tanımlanırken değer verilmeli.
LET: Blok kapsamlı değişken. Daha sonra değiştirilebilir. Boş tanımlanabilir.
VAR: Fonksiyon kapsamlı değişken. Her yerden erişilebilir. Boş tanımlanabilir.
```

## Seviye 2: Değişken Değiştirme

### Görsel Unsurlar:
- Aynı objeler (mayın, plastik kap, balon) değerlerle birlikte gösterilir
- Sağ ve sol tarafta değer kutuları

### Oynanış:
- Kullanıcı değişkenleri istenilen sıralamaya getirmeli
- Değerleri değişkenlere sürükleyerek değiştirmeye çalışabilir

### Kurallar:
- Const değişkenine yeni değer atanmaya çalışılırsa mayın patlar
- Let ve var değerleri değiştirilebilir
- Ekranda "TypeError: Assignment to constant variable" gibi gerçek JavaScript hata mesajları görünür

### Bilgilendirme Ekranı İçeriği:
```
DEĞİŞKEN DEĞİŞTİRME:

CONST: Tanımlandıktan sonra değiştirilemez
LET: Tanımlandıktan sonra değeri değiştirilebilir
VAR: Tanımlandıktan sonra değeri değiştirilebilir

Görev: Değişkenleri sıraya dizin ve değerlerini değiştirmeyi deneyin!
```

## Seviye 3: Scope Kuleleri

### Görsel Tasarım:
- **İç İçe Geçmiş 3 Alan**: Merkezdeki en küçük alandan başlayarak dışa doğru genişleyen 3 katmanlı dairesel alanlar
  - **İç Alan**: En küçük, merkezdeki alan (Blok Scope)
  - **Orta Alan**: Orta büyüklükteki alan (Fonksiyon Scope)
  - **Dış Alan**: En büyük, dıştaki alan (Global Scope)

- **Değerler**: Farklı şekillerde (yıldız, üçgen, kare gibi) değerler gösterilecek. Her değer belirli bir sayıyı veya metni temsil eder.

### Oynanış:
1. Her turda alanların renkleri farklı olacak ve farklı değişken türlerini temsil edecek:
   - **1. Tur**: Kırmızı = const, Mavi = let, Yeşil = var
   - **2. Tur**: Yeşil = const, Kırmızı = let, Mavi = var
   - **3. Tur**: Mavi = const, Yeşil = let, Kırmızı = var

2. Kullanıcıya "Hangi değer hangi kapsamda erişilebilir?" sorusu sorulur.

3. Kullanıcı değerleri (şekilleri) sürükleyerek uygun alanlara yerleştirir.

### Kurallar:
- **var**: Function scope'a sahiptir. Global ve Function scope'larda (dış ve orta alan) tanımlanabilir.
- **let**: Block scope'a sahiptir. Tanımlandığı blok ve içindeki bloklarda erişilebilir.
- **const**: let gibi block scope'a sahiptir ama değeri değiştirilemez.

### Bilgilendirme Ekranı İçeriği:
```
SCOPE KURALLARI:

VAR: Function-scoped - Tanımlandığı fonksiyonun her yerinden erişilebilir
LET: Block-scoped - Sadece tanımlandığı blok ve alt bloklarından erişilebilir
CONST: Block-scoped - Let gibi davranır ama değeri değiştirilemez

Görev: Değerleri doğru alanlara yerleştirin!
```

## Teknik Gereksinimler

### Platform
- Web tabanlı (HTML, CSS, JavaScript)
- Tarayıcıda çalışacak şekilde tasarlanır

### Geliştirme Araçları
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla JS veya React)
- **Oyun Motoru**: Phaser.js veya benzeri bir 2D oyun kütüphanesi
- **Ses Efektleri**: Basit sesler (doğru ve yanlış eşleşmeler için)

## Kullanıcı Deneyimi (UX)

### Arayüz Tasarımı
- Basit ve renkli bir arayüz
- Değişken türlerinin görsel temsilleri net ve anlaşılır olmalı
- Her seviyenin başında açıklayıcı bilgiler gösterilmeli

### Ses ve Animasyon
- Doğru eşleşmelerde başarı sesi
- Yanlış eşleşmelerde hata sesi
- Const değiştirilmeye çalışıldığında patlama sesi ve animasyonu

## Değerlendirme Kriterleri

- **Öğrenme Çıktısı**: Oyuncuların JavaScript değişken türlerini ve scope kurallarını kavraması
- **Kullanıcı Memnuniyeti**: Oyunun eğlenceli ve öğretici bulunması
- **Etkileşim**: Oyuncuların sürükle-bırak mekanikleri ile aktif öğrenme sağlaması

## Başarı Ölçütleri

- Oyuncuların JavaScript değişken türleri arasındaki farkları doğru bir şekilde açıklayabilmesi
- Oyuncuların scope kurallarını anlaması ve uygulaması
- Oyundan sonra gerçek kod yazdıklarında değişken türlerini doğru kullanabilmeleri

## Yol Haritası (Roadmap)

### Sürüm 1.0 (MVP)
- Üç temel seviye ile ilk sürüm
- Basit puanlama sistemi
- Temel görsel ve ses efektleri

### Sürüm 2.0
- Dördüncü seviye: "Hoisting Challenge"
- Gelişmiş animasyonlar ve görsel efektler
- Detaylı puan ve ilerleme sistemi

### Sürüm 3.0
- Çok oyunculu rekabet modu
- Kod zorlukları ve zamanlı görevler
- Sosyal paylaşım özellikleri

## Sonuç

"Variable Master", JavaScript'in değişken türlerini ve scope kurallarını eğlenceli ve interaktif bir şekilde öğreten bir oyundur. Bu PRD, projenin temel çerçevesini çizer ve geliştirme sürecinde rehberlik eder. 
# Type Defender - JavaScript Veri Türlerini Öğreten Oyun

## 1. Ürün Adı

"Type Defender" (Tür Savunucusu)

## 2. Ürün Özeti

"Type Defender", JavaScript'teki temel veri türlerini (number, string, boolean, float, object, null, undefined gibi) öğretmeyi amaçlayan bir eğitici oyundur. Oyuncular, ekrandan gelen farklı veri türlerini doğru tuşlarla eşleştirerek puan kazanır. Her veri türünün benzersiz bir görsel temsili vardır, bu da oyuncuların türleri görsel olarak da tanımasını sağlar.

## 3. Hedef Kitle

- Yazılıma yeni başlayanlar
- JavaScript öğrenmek isteyenler
- Programlama temellerini eğlenceli bir şekilde öğrenmek isteyenler
- 12 yaş ve üzeri kullanıcılar

## 4. Temel Özellikler

### 4.1. Veri Türleri ve Görsel Temsilleri

Her veri türünün benzersiz bir görsel temsili olacak:
- **Number**: Sayı sembolü (örneğin, 123 yazan bir kutu)
- **String**: Tırnak işaretleri içinde metin (örneğin, "Merhaba")
- **Boolean**: true veya false yazan bir anahtar
- **Float**: Ondalıklı sayı (örneğin, 3.14)
- **Object**: Küçük bir JSON benzeri yapı (örneğin, { isim: "Ali" })
- **Null**: Boş bir kutu veya null yazan bir sembol
- **Undefined**: Soru işareti veya undefined yazan bir sembol

### 4.2. Tuşlar ve Eşleme

Oyuncunun klavyesinde her veri türü için bir tuş olacak:
- **N**: Number
- **S**: String
- **B**: Boolean
- **F**: Float
- **O**: Object
- **L**: Null
- **U**: Undefined

Oyuncu, ekrandan gelen veri türünü doğru tuşa basarak eşleştirmeye çalışır.

### 4.3. Oyun Mekaniği

- Ekranın üst kısmından farklı veri türleri aşağıya doğru kayar
- Oyuncu, doğru tuşa basarak veri türünü yakalar
- Her doğru eşleşme için puan kazanılır
- Yanlış tuşa basıldığında can kaybı olur (örneğin, 3 can hakkı)
- Zamanla veri türleri daha hızlı gelmeye başlar ve oyun zorlaşır

### 4.4. Puanlama Sistemi

- Her doğru eşleşme: +10 puan
- Her yanlış eşleşme: -5 puan
- Ardışık doğru eşleşmeler: Bonus puan (örneğin, 5 ardışık doğru için +50 puan)

### 4.5. Seviyeler

Oyun, zorluk seviyelerine ayrılır:
- **Seviye 1**: Yalnızca number, string, boolean
- **Seviye 2**: float, null, undefined eklenir
- **Seviye 3**: object ve daha karmaşık türler eklenir

Her seviyede veri türleri daha hızlı gelir ve daha fazla tür bir arada görünür.

### 4.6. Eğitici İpuçları

- Oyuncu yanlış tuşa bastığında, ekranda doğru veri türü hakkında kısa bir bilgi gösterilir (örneğin, "Bu bir string türüdür. Tırnak işaretleri içinde metinlerdir.")

## 5. Teknik Detaylar

### 5.1. Platform

- Web tabanlı (HTML, CSS, JavaScript kullanılarak geliştirilebilir)
- Tarayıcıda çalışacak şekilde tasarlanır

### 5.2. Geliştirme Araçları

- **Frontend**: HTML5, CSS3, JavaScript (React.js veya Vanilla JS)
- **Oyun Motoru**: Phaser.js (2D oyunlar için hafif bir kütüphane)
- **Ses Efektleri**: Basit sesler (doğru ve yanlış eşleşmeler için)

### 5.3. Veri Türü Mantığı

Veri türleri, JavaScript'in typeof operatörüne göre belirlenir.

Örnek:
```javascript
if (typeof gelenVeri === "number") {
  // Number türü
} else if (typeof gelenVeri === "string") {
  // String türü
}
```

## 6. Kullanıcı Deneyimi (UX)

### 6.1. Arayüz Tasarımı

- Basit ve renkli bir arayüz
- Veri türlerinin görsel temsilleri net ve anlaşılır olmalı
- Tuşların ne işe yaradığını gösteren bir klavye görseli

### 6.2. Ses ve Animasyon

- Doğru eşleşmelerde mutlu bir ses efekti
- Yanlış eşleşmelerde üzücü bir ses efekti
- Veri türlerinin ekranda kayarken animasyonlu olması

## 7. Başarı Ölçütleri

- **Kullanıcı Memnuniyeti**: Oyuncuların oyunu eğlenceli ve öğretici bulması
- **Öğrenme Çıktısı**: Oyuncuların JavaScript veri türlerini temel düzeyde öğrenmesi
- **Oynanabilirlik**: Oyuncuların oyunu tekrar tekrar oynamak istemesi

## 8. Roadmap (Yol Haritası)

### Sürüm 1.0 (MVP - Minimum Uygulanabilir Ürün)
- Temel veri türleri (number, string, boolean)
- Basit puanlama sistemi
- Temel arayüz ve ses efektleri

### Sürüm 2.0
- Tüm veri türleri (float, object, null, undefined)
- Seviyeler ve zorluk artışı
- Eğitici ipuçları

### Sürüm 3.0
- Çok oyunculu mod (iki oyuncu aynı anda yarışabilir)
- Lider tablosu (en yüksek puanları gösteren bir tablo)

## 9. Sonuç

"Type Defender", JavaScript veri türlerini eğlenceli ve etkileşimli bir şekilde öğreten bir oyun olacak. Bu PRD, projenin temel çerçevesini çiziyor ve geliştirme sürecinde rehberlik edecek. Başarılar dilerim! 🚀

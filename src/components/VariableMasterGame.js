import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/VariableMasterGame.css';

const VariableMasterGame = () => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({
    const: [],
    let: [],
    var: []
  });
  const [showExplosion, setShowExplosion] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [levelCompletionScore, setLevelCompletionScore] = useState(0);
  const [variableBoxes, setVariableBoxes] = useState([
    { id: 1, type: 'const', value: 1, canChange: false },
    { id: 2, type: 'let', value: 8, canChange: true },
    { id: 3, type: 'var', value: 7, canChange: true }
  ]);
  const [targetOrder, setTargetOrder] = useState("7-1-8");
  const [targetValues, setTargetValues] = useState({
    const: 1,  // CONST değeri sabit
    let: 2,    // LET için hedef değer
    var: 3     // VAR için hedef değer
  });
  const [selectedBox, setSelectedBox] = useState(null);
  const [draggedBox, setDraggedBox] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showDragHint, setShowDragHint] = useState(true);
  
  // Scope seviyesi için değişkenler
  const [scopeVariables, setScopeVariables] = useState([
    { id: 1, type: 'const', value: 1, correctScope: 'block' },
    { id: 2, type: 'let', value: 3, correctScope: 'block' },
    { id: 3, type: 'var', value: 5, correctScope: 'function' }
  ]);
  
  // Her scope alanında yerleştirilmiş değişkenler
  const [currentAnswers, setCurrentAnswers] = useState({
    global: [],   // Global scope'a yerleştirilen değişkenler
    function: [], // Function scope'a yerleştirilen değişkenler
    block: []     // Block scope'a yerleştirilen değişkenler
  });
  const [scopeLayout, setScopeLayout] = useState('normal'); // 'normal' veya 'reversed'
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Tanımlanabilecek JavaScript değerleri
  const jsValues = [
    { id: 1, type: 'string', value: '"Merhaba"', display: '"Merhaba"', needsInit: true },
    { id: 2, type: 'number', value: '42', display: '42', needsInit: true }
  ];
  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const levels = [
    {
      id: 1,
      name: t('variableMaster.levels.1.name'),
      description: t('variableMaster.levels.1.description'),
      instructions: t('variableMaster.levels.1.instructions')
    },
    {
      id: 2,
      name: t('variableMaster.levels.2.name'),
      description: t('variableMaster.levels.2.description'),
      instructions: t('variableMaster.levels.2.instructions')
    },
    {
      id: 3,
      name: t('variableMaster.levels.3.name'),
      description: t('variableMaster.levels.3.description'),
      instructions: t('variableMaster.levels.3.instructions')
    }
  ];

  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    resetGame();
  };

  const startLevel = (levelIndex) => {
    setCurrentLevel(levelIndex);
    setShowInstructions(true);
    resetGame();

    // 2. seviye için değişken değerlerini ve kutuları sıfırla
    if (levelIndex === 1) {
      // Hedef değerler - kullanıcının ulaşması gereken değerler
      const targetVals = {
        const: 1,  // CONST değeri sabit, değiştirilemiyor
        let: 2,    // LET için hedef değer
        var: 3     // VAR için hedef değer
      };
      setTargetValues(targetVals);
      
      // Başlangıç değerleri - LET ve VAR hedeften farklı değerlerde başlıyor
      const boxes = [
        { id: 1, type: 'const', value: 1, canChange: false },   // CONST zaten hedef değerde, değiştirilemez
        { id: 2, type: 'let', value: 8, canChange: true },     // LET farklı değerde başlıyor
        { id: 3, type: 'var', value: 7, canChange: true }      // VAR farklı değerde başlıyor
      ];
      setVariableBoxes(boxes);
      
      // Hedef değer sıralaması - CONST mutlaka içinde olmalı
      // Örnek: "3-1-2" -> "VAR hedef değeri - CONST değeri - LET hedef değeri"
      const possibleOrders = [
        `${targetVals.var}-${targetVals.const}-${targetVals.let}`, // VAR-CONST-LET hedef değerleri
        `${targetVals.let}-${targetVals.const}-${targetVals.var}`  // LET-CONST-VAR hedef değerleri
      ];
      const randomOrder = possibleOrders[Math.floor(Math.random() * possibleOrders.length)];
      setTargetOrder(randomOrder);
      
      // Sürükleme ipucunu göster
      setShowDragHint(true);
      
      // 5 saniye sonra ipucu gizlenecek
      setTimeout(() => {
        setShowDragHint(false);
      }, 5000);
    } else if (levelIndex === 0) {
      // İlk seviye için de sürükleme ipucunu göster
      setShowDragHint(true);
      setTimeout(() => {
        setShowDragHint(false);
      }, 5000);
    } else if (levelIndex === 2) {
      // Scope değişkenlerini sıfırla
      setScopeVariables([
        { id: 1, type: 'const', value: 1, correctScope: 'block' },
        { id: 2, type: 'let', value: 3, correctScope: 'block' },
        { id: 3, type: 'var', value: 5, correctScope: 'function' }
      ]);
      
      // Cevapları sıfırla
      setCurrentAnswers({
        global: [],
        function: [],
        block: []
      });
      
      // Normal düzen (dıştan içe: global -> function -> block)
      setScopeLayout('normal');
      
      // Sürükleme ipucunu göster
      setShowDragHint(true);
      setTimeout(() => {
        setShowDragHint(false);
      }, 5000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setDroppedItems({
      const: [],
      let: [],
      var: []
    });
    setShowExplosion(false);
    setShowMessage('');
  };

  // Kullanıcı etkileşimini izleme - kaldırıldı ve yeni çözüm kullanıldı
  useEffect(() => {
    // Oyun başladığında ipucu gösterimi
    if (gameStarted && !showInstructions && !levelCompleted) {
      // 5 saniye sonra ipucu gizlenecek
      const timer = setTimeout(() => {
        setShowDragHint(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [gameStarted, showInstructions, levelCompleted]);

  // Değer sürüklemeye başlandığında
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setShowDragHint(false);
  };

  // Sürüklenen değer bırakma alanının üzerine geldiğinde
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // CONST boş mu kontrolü yapan fonksiyon
  const checkConstEmpty = () => {
    if (droppedItems.const.length === 0) {
      // CONST boş bırakılmış, mayın patlamalı
      setShowExplosion(true);
      setScore(prevScore => Math.max(0, prevScore - 5));
      setShowMessage(t('variableMaster.messages.constEmpty'));
      setTimeout(() => {
        setShowExplosion(false);
        setShowMessage('');
      }, 1500);
      return false;
    }
    return true;
  };

  // Seviye tamamlandı mı kontrolü
  const checkLevelComplete = () => {
    // CONST kesinlikle dolu olmalı ve diğer kontroller yapılmalı
    if (checkConstEmpty()) {
      const completionScore = 20;
      setLevelCompletionScore(completionScore);
      setScore(prevScore => prevScore + completionScore);
      setLevelCompleted(true);
      setShowMessage(t('variableMaster.messages.levelComplete', { points: completionScore }));
      
      setTimeout(() => {
        setShowMessage('');
      }, 1500);
    }
  };

  // Değişken değerini değiştirmeyi dene
  const tryChangeValue = (boxId, newValue) => {
    const box = variableBoxes.find(box => box.id === boxId);
    
    // Değer geçerli bir sayı mı?
    if (isNaN(newValue) || newValue < 1 || newValue > 9) {
      setErrorMessage(t('variableMaster.messages.valueError'));
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    
    // CONST değiştirilemez
    if (box.type === 'const') {
      setErrorMessage(t('variableMaster.messages.constChanged'));
      setShowError(true);
      setShowExplosion(true);
      setScore(prevScore => Math.max(0, prevScore - 5));
      
      setTimeout(() => {
        setShowError(false);
        setShowExplosion(false);
      }, 2000);
      return;
    }
    
    // LET ve VAR değiştirilebilir
    if (box.canChange) {
      // Doğru hedef değere doğru mu değiştiriliyor?
      const targetValue = targetValues[box.type];
      const newValueInt = parseInt(newValue);
      
      setVariableBoxes(prevBoxes => 
        prevBoxes.map(item => 
          item.id === boxId ? { ...item, value: newValueInt } : item
        )
      );
      
      // Doğru değere değiştirildiyse puan ver
      if (newValueInt === targetValue) {
        setScore(prevScore => prevScore + 10);
        setShowMessage(t('variableMaster.messages.varChanged', { type: box.type.toUpperCase() }));
      } else {
        // Yanlış değere değiştirildiyse daha az puan
        setScore(prevScore => prevScore + 2);
        setShowMessage(t('variableMaster.messages.varChangedWrong', { type: box.type.toUpperCase() }));
      }
      
      setTimeout(() => setShowMessage(''), 1500);
    }
  };
  
  // Değişken kutusunun sürüklenmesi
  const handleBoxDragStart = (e, index) => {
    setDraggedBox(index);
  };
  
  const handleBoxDragOver = (e, index) => {
    e.preventDefault();
    if (draggedBox !== null && draggedBox !== index) {
      setDropTargetIndex(index);
    }
  };
  
  const handleBoxDragLeave = () => {
    setDropTargetIndex(null);
  };
  
  const handleBoxDrop = (e, index) => {
    e.preventDefault();
    if (draggedBox === null || draggedBox === index) return;
    
    // Kutuları yer değiştir
    setVariableBoxes(prevBoxes => {
      const newBoxes = [...prevBoxes];
      const temp = newBoxes[draggedBox];
      newBoxes[draggedBox] = newBoxes[index];
      newBoxes[index] = temp;
      return newBoxes;
    });
    
    setDraggedBox(null);
    setDropTargetIndex(null);
  };

  // İkinci seviye tamamlama kontrolü
  const checkLevelTwoComplete = () => {
    // Değişkenlerin hedef değerlere ulaşıp ulaşmadığını kontrol et
    const valuesCorrect = variableBoxes.every(box => {
      // CONST zaten doğru değerde olmalı
      if (box.type === 'const') return box.value === targetValues.const;
      
      // LET ve VAR hedef değerlere ulaşmış mı?
      return box.value === targetValues[box.type];
    });
    
    // Mevcut sıralamayı al - değerlere göre
    const currentOrder = variableBoxes.map(box => box.value).join('-');
    
    // Hem değerler doğru olmalı hem de sıralama doğru olmalı
    if (valuesCorrect && currentOrder === targetOrder) {
      const completionScore = 20;
      setLevelCompletionScore(completionScore);
      setScore(prevScore => prevScore + completionScore);
      setLevelCompleted(true);
      setShowMessage(t('variableMaster.messages.levelComplete', { points: completionScore }));
      
      setTimeout(() => {
        setShowMessage('');
      }, 1500);
    } else if (!valuesCorrect) {
      setErrorMessage(t('variableMaster.messages.valuesError'));
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    } else {
      setErrorMessage(t('variableMaster.messages.orderError', { order: targetOrder }));
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  // Sonraki seviyeye geçiş
  const goToNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel < levels.length) {
      setCurrentLevel(nextLevel);
      setLevelCompleted(false);
      resetGame();
      setShowInstructions(true);
    } else {
      // Tüm seviyeler tamamlandı - ana ekrana dönmeyi sağla
      setGameStarted(false);
      setCurrentLevel(0);
      setLevelCompleted(false);
      setScopeLayout('normal');
      setAttemptCount(0);
      resetGame();
    }
  };

  // Değeri bırakma alanına bıraktığımızda
  const handleDrop = (e, targetZone) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // Değer zaten başka bir yerde mi?
    const allItems = [...droppedItems.const, ...droppedItems.let, ...droppedItems.var];
    const isAlreadyDropped = allItems.some(item => item.id === draggedItem.id);
    
    if (isAlreadyDropped) {
      // Zaten yerleştirilmiş öğeyi bulup kaldırmak için
      const updatedItems = {
        const: droppedItems.const.filter(item => item.id !== draggedItem.id),
        let: droppedItems.let.filter(item => item.id !== draggedItem.id),
        var: droppedItems.var.filter(item => item.id !== draggedItem.id)
      };
      
      // Yeni alana ekle
      updatedItems[targetZone] = [...updatedItems[targetZone], draggedItem];
      setDroppedItems(updatedItems);
    } else {
      // İlk kez bir alana yerleştiriliyor
      setDroppedItems({
        ...droppedItems,
        [targetZone]: [...droppedItems[targetZone], draggedItem]
      });

      // Doğru yerleştirme için puanları arttır
      if (targetZone === 'const' || targetZone === 'let' || targetZone === 'var') {
        setScore(prevScore => prevScore + 10);
        setShowMessage(t('variableMaster.messages.varPlaced', { type: targetZone.toUpperCase(), scope: targetZone }));
        setTimeout(() => setShowMessage(''), 1500);
      }
    }
    
    setDraggedItem(null);
  };

  // Değişkeni scope alanına yerleştir
  const placeScopeVariable = (variableId, scopeType) => {
    // Değişkeni bul
    const id = parseInt(variableId);
    const variable = scopeVariables.find(v => v.id === id);
    
    if (!variable) return;
    
    // Normal düzen için erişim kontrolü
    if (scopeLayout === 'normal') {
      // CONST sadece kırmızı alanda (block) görüntülenebilir
      if (variable.type === 'const' && scopeType !== 'block') {
        setErrorMessage(t('variableMaster.messages.constError'));
        setShowError(true);
        setTimeout(() => setShowError(false), 2500);
        return;
      }
      
      // LET mavi ve kırmızı alanda görüntülenebilir
      if (variable.type === 'let' && scopeType === 'global') {
        setErrorMessage(t('variableMaster.messages.letError'));
        setShowError(true);
        setTimeout(() => setShowError(false), 2500);
        return;
      }
      
      // VAR her alanda görüntülenebilir
      // VAR için kısıtlama yok
    } else {
      // İkinci aşama (ters düzen) için erişim kontrolü
      // VAR her alanda görüntülenebilir
      // Bu aşamada kısıtlama yok
      
      // LET mavi ve kırmızı alanda görüntülenebilir
      if (variable.type === 'let' && scopeType === 'global') {
        setErrorMessage(t('variableMaster.messages.letErrorReversed'));
        setShowError(true);
        setTimeout(() => setShowError(false), 2500);
        return;
      }
      
      // CONST yeşil, mavi ve kırmızı alandan erişilebilir
      // CONST için bu aşamada kısıtlama yok
    }
    
    // Değişkeni scope'a yerleştir
    const updatedAnswers = { ...currentAnswers };
    updatedAnswers[scopeType] = [...updatedAnswers[scopeType], { ...variable }];
    setCurrentAnswers(updatedAnswers);
    
    // Puan ver
    setScore(prevScore => prevScore + 5);
    
    // Scope türünü Türkçe olarak belirle
    let scopeName = '';
    if (scopeType === 'global') {
      scopeName = t('variableMaster.scopeAreas.green');
    } else if (scopeType === 'function') {
      scopeName = t('variableMaster.scopeAreas.blue');
    } else if (scopeType === 'block') {
      scopeName = t('variableMaster.scopeAreas.red');
    }
    
    setShowMessage(t('variableMaster.messages.varPlaced', { type: variable.type.toUpperCase(), scope: scopeName }));
    setTimeout(() => setShowMessage(''), 1500);
  };
  
  // Değişkeni scope'dan çıkar
  const removeScopeVariable = (variableId, scopeType, index) => {
    // Scope'dan değişkeni çıkar - şimdi index kullanıyoruz
    const updatedAnswers = { ...currentAnswers };
    // İndex ile birlikte silme - aynı tür birden fazla değişken olabilir
    updatedAnswers[scopeType] = updatedAnswers[scopeType].filter((_, i) => i !== index);
    setCurrentAnswers(updatedAnswers);
  };
  
  // Scope seviyesini kontrol et
  const checkScopeLevel = () => {
    let isCorrect = true;
    let errorMsg = '';
    
    if (scopeLayout === 'normal') {
      // Normal düzende kontrol:
      
      // 1. VAR - Her alana yerleştirilmiş mi?
      const varInGlobal = currentAnswers.global.some(item => item.id === 3);
      const varInFunction = currentAnswers.function.some(item => item.id === 3);
      const varInBlock = currentAnswers.block.some(item => item.id === 3);
      
      // 2. LET - Mavi ve kırmızı alanda mı?
      const letInFunction = currentAnswers.function.some(item => item.id === 2);
      const letInBlock = currentAnswers.block.some(item => item.id === 2);
      
      // 3. CONST - Kırmızı alanda mı?
      const constInBlock = currentAnswers.block.some(item => item.id === 1);
      
      if (!varInGlobal || !varInFunction || !varInBlock) {
        isCorrect = false;
        errorMsg = t('variableMaster.messages.varError');
      } else if (!letInFunction || !letInBlock) {
        isCorrect = false;
        errorMsg = t('variableMaster.messages.letErrorScope');
      } else if (!constInBlock) {
        isCorrect = false;
        errorMsg = t('variableMaster.messages.constErrorScope');
      }
    } else {
      // Ters düzen (ikinci aşama) kontrolü:
      
      // 1. VAR - Her alana yerleştirilmiş mi?
      const varInGlobal = currentAnswers.global.some(item => item.id === 3);
      const varInFunction = currentAnswers.function.some(item => item.id === 3);
      const varInBlock = currentAnswers.block.some(item => item.id === 3);
      
      // 2. LET - Mavi ve kırmızı alanda mı?
      const letInFunction = currentAnswers.function.some(item => item.id === 2);
      const letInBlock = currentAnswers.block.some(item => item.id === 2);
      
      // 3. CONST - Her alana yerleştirilmiş mi? (değişiklik burada)
      const constInGlobal = currentAnswers.global.some(item => item.id === 1);
      const constInFunction = currentAnswers.function.some(item => item.id === 1);
      const constInBlock = currentAnswers.block.some(item => item.id === 1);
      
      if (!varInGlobal || !varInFunction || !varInBlock) {
        isCorrect = false;
        errorMsg = t('variableMaster.messages.varError');
      } else if (!letInFunction || !letInBlock) {
        isCorrect = false;
        errorMsg = t('variableMaster.messages.letErrorScope');
      } else if (!constInGlobal || !constInFunction || !constInBlock) {
        isCorrect = false;
        errorMsg = t('variableMaster.messages.constErrorScopeReversed');
      }
    }
    
    if (isCorrect) {
      // Başarılı - puan ver
      const completionScore = 20;
      setLevelCompletionScore(completionScore);
      setScore(prevScore => prevScore + completionScore);
      
      // Deneme sayısını artır
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      if (newAttemptCount === 1) {
        // İlk deneme başarılı, şimdi düzeni değiştir
        // Modal göster
        setModalMessage(t('variableMaster.stageCompleted'));
        setShowModal(true);
        
        // 3 saniye sonra modalı kapat ve ikinci aşamaya geç
        setTimeout(() => {
          setShowModal(false);
          
          setScopeLayout('reversed');
          
          // Tüm değişkenleri sıfırla
          setScopeVariables(prevVars => 
            prevVars.map(v => ({ ...v, placed: false }))
          );
          
          // Cevapları sıfırla
          setCurrentAnswers({
            global: [],
            function: [],
            block: []
          });
          
          setShowMessage(t('variableMaster.messages.secondStage'));
          setTimeout(() => {
            setShowMessage(t('variableMaster.messages.secondStageNote'));
            setTimeout(() => setShowMessage(''), 2500);
          }, 4000);
        }, 3000);
      } else {
        // İkinci deneme de başarılı, seviyeyi tamamla
        setLevelCompleted(true);
        setShowMessage(t('variableMaster.messages.levelComplete', { points: completionScore }));
        setTimeout(() => {
          setShowMessage('');
        }, 1500);
      }
    } else {
      // Hatalı - mesaj göster
      setErrorMessage(errorMsg);
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
    }
  };

  return (
    <div className="variable-master-container">
      {!gameStarted ? (
        <div className="start-screen">
          <h1 className="game-title">{t('variableMaster.title')}</h1>
          <div className="subtitle-box">
            <h2 className="game-subtitle">{t('variableMaster.subtitle')}</h2>
          </div>
          
          <div className="level-selection">
            <h3>{t('variableMaster.selectLevel')}</h3>
            <div className="level-buttons">
              {levels.map((level, index) => (
                <button 
                  key={level.id}
                  className="level-button"
                  onClick={() => startLevel(index)}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="cta-button">
            <button 
              className="btn start-button"
              onClick={startGame}
            >
              {t('variableMaster.startGame')}
            </button>
          </div>
          
          <div className="home-link">
            <Link to="/" className="btn back-button">{t('variableMaster.backToHome')}</Link>
          </div>
        </div>
      ) : (
        <div className="game-screen">
          {showInstructions ? (
            <div className="instructions-overlay">
              <h2>{levels[currentLevel].name}</h2>
              <p>{levels[currentLevel].description}</p>
              <pre className="instruction-text">{levels[currentLevel].instructions}</pre>
              <button 
                className="btn continue-button"
                onClick={() => setShowInstructions(false)}
              >
                {t('variableMaster.continue')}
              </button>
            </div>
          ) : (
            <>
              <div className="game-header">
                <h2>{levels[currentLevel].name}</h2>
                <div className="score-display">{t('variableMaster.score')}: {score}</div>
                <button 
                  className="btn info-button"
                  onClick={() => setShowInstructions(true)}
                >
                  ?
                </button>
              </div>
              
              {showMessage && (
                <div className="message-overlay">
                  {showMessage}
                </div>
              )}
              
              {currentLevel === 0 && !levelCompleted && (
                <div className="level-one-container">
                  {showDragHint && (
                    <div className="drag-hint">
                      <span>{t('variableMaster.dragHints.level1')}</span>
                    </div>
                  )}
                
                  <div className="variable-containers">
                    <div className={`variable-container const-container ${showExplosion ? 'exploding' : ''}`}>
                      <h3>CONST</h3>
                      <div className="variable-visual">
                        <div className="mine-icon"></div>
                      </div>
                      <div 
                        className="drop-zone const-zone"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'const')}
                      >
                        {droppedItems.const.map(item => (
                          <div 
                            key={item.id} 
                            className={`draggable-value ${item.type}-value`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                          >
                            {item.display}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="variable-container let-container">
                      <h3>LET</h3>
                      <div className="variable-visual">
                        <div className="container-icon"></div>
                      </div>
                      <div 
                        className="drop-zone let-zone"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'let')}
                      >
                        {droppedItems.let.map(item => (
                          <div 
                            key={item.id} 
                            className={`draggable-value ${item.type}-value`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                          >
                            {item.display}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="variable-container var-container">
                      <h3>VAR</h3>
                      <div className="variable-visual">
                        <div className="balloon-icon"></div>
                      </div>
                      <div 
                        className="drop-zone var-zone"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'var')}
                      >
                        {droppedItems.var.map(item => (
                          <div 
                            key={item.id} 
                            className={`draggable-value ${item.type}-value`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                          >
                            {item.display}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="values-container">
                    {jsValues.map(item => {
                      // Öğe zaten bir değişken kutusuna bırakıldı mı?
                      const isDropped = [...droppedItems.const, ...droppedItems.let, ...droppedItems.var]
                        .some(droppedItem => droppedItem.id === item.id);
                      
                      if (isDropped) return null;
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`draggable-value ${item.type}-value ${showDragHint ? 'hint-animation' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                        >
                          {item.display}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {currentLevel === 1 && !levelCompleted && (
                <div className="level-two-container">
                  <div className="variable-editor">
                    <p className="level-info">
                      {t('variableMaster.levelInfo.level2')}
                      <br />
                      <strong>{t('variableMaster.levelInfo.targetOrder', { order: targetOrder })}</strong>
                      <br />
                      <strong>{t('variableMaster.levelInfo.targetValues', { constVal: targetValues.const, letVal: targetValues.let, varVal: targetValues.var })}</strong>
                    </p>
                    
                    {showDragHint && (
                      <div className="drag-hint">
                        <span>{t('variableMaster.dragHints.level2')}</span>
                      </div>
                    )}
                    
                    <div className="variable-boxes-container">
                      {variableBoxes.map((box, index) => (
                        <div 
                          key={box.id}
                          className={`variable-box-draggable ${box.type}-box ${dropTargetIndex === index ? 'drop-target' : ''} ${box.type === 'const' && showExplosion ? 'exploding' : ''}`}
                          draggable
                          onDragStart={(e) => handleBoxDragStart(e, index)}
                          onDragOver={(e) => handleBoxDragOver(e, index)}
                          onDragLeave={handleBoxDragLeave}
                          onDrop={(e) => handleBoxDrop(e, index)}
                        >
                          <div className="variable-header">
                            <h3>{box.type.toUpperCase()}</h3>
                            <div className="variable-visual">
                              <div className={`${box.type}-icon`}></div>
                            </div>
                            <div className="drag-handle">
                              <span className="drag-icon">↔</span>
                            </div>
                          </div>
                          
                          <div className="variable-value">
                            <span>{box.value}</span>
                          </div>
                          
                          <div className="variable-content">
                            <div className="code-input">
                              <label>{t('variableMaster.variables.newValue')}</label>
                              <input 
                                type="number" 
                                min="1" 
                                max="9"
                                placeholder="1-9 arası"
                                disabled={!box.canChange}
                                onChange={(e) => setSelectedBox({
                                  id: box.id,
                                  value: e.target.value
                                })}
                              />
                              <button 
                                className="btn change-button"
                                onClick={() => selectedBox && selectedBox.id === box.id ? 
                                  tryChangeValue(box.id, selectedBox.value) : null}
                                disabled={!box.canChange}
                              >
                                {t('variableMaster.variables.change')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {currentLevel === 2 && !levelCompleted && (
                <div className="level-three-container">
                  <div className="scope-layout-info">
                    {scopeLayout === 'normal' ? (
                      <p className="layout-text">{t('variableMaster.scopeInfo.normal')}</p>
                    ) : (
                      <p className="layout-text">{t('variableMaster.scopeInfo.reversed')}</p>
                    )}
                  </div>
                  
                  {showDragHint && (
                    <div className="drag-hint">
                      <span>{t('variableMaster.dragHints.level3')}</span>
                    </div>
                  )}
                  
                  <div className="scope-variables">
                    {scopeVariables.map(variable => (
                      <div 
                        key={variable.id} 
                        className={`scope-variable ${
                          scopeLayout === 'normal' 
                            ? `${variable.type}-variable` 
                            : variable.id === 1 
                              ? 'const-variable-reversed' 
                              : variable.id === 2 
                                ? 'let-variable-reversed' 
                                : 'var-variable-reversed'
                        }`}
                        draggable="true"
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify({
                            type: 'scopeVariable',
                            id: variable.id
                          }));
                        }}
                      >
                        <div className="variable-type">{variable.type.toUpperCase()}</div>
                        <div className="variable-value">{variable.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="scope-areas">
                    <div 
                      className={`scope-area global-scope ${scopeLayout === 'reversed' ? 'reversed' : ''}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                        if (data.type === 'scopeVariable') {
                          placeScopeVariable(data.id, 'global');
                        }
                      }}
                    >
                      <h3>{t('variableMaster.scopeAreas.green')}</h3>
                      
                      <div className="placed-variables">
                        {currentAnswers.global.map((variable, index) => (
                          <div 
                            key={`global-${variable.id}-${index}`}
                            className={`scope-variable ${
                              scopeLayout === 'normal' 
                                ? `${variable.type}-variable placed` 
                                : variable.id === 1 
                                  ? 'const-variable-reversed placed' 
                                  : variable.id === 2 
                                    ? 'let-variable-reversed placed' 
                                    : 'var-variable-reversed placed'
                            }`}
                            onClick={() => removeScopeVariable(variable.id, 'global', index)}
                          >
                            <div className="variable-type">{variable.type.toUpperCase()}</div>
                            <div className="variable-value">{variable.value}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div 
                        className={`scope-area function-scope ${scopeLayout === 'reversed' ? 'reversed' : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                          if (data.type === 'scopeVariable') {
                            placeScopeVariable(data.id, 'function');
                          }
                        }}
                      >
                        <h3>{t('variableMaster.scopeAreas.blue')}</h3>
                        
                        <div className="placed-variables">
                          {currentAnswers.function.map((variable, index) => (
                            <div 
                              key={`function-${variable.id}-${index}`}
                              className={`scope-variable ${
                                scopeLayout === 'normal' 
                                  ? `${variable.type}-variable placed` 
                                  : variable.id === 1 
                                    ? 'const-variable-reversed placed' 
                                    : variable.id === 2 
                                      ? 'let-variable-reversed placed' 
                                      : 'var-variable-reversed placed'
                              }`}
                              onClick={() => removeScopeVariable(variable.id, 'function', index)}
                            >
                              <div className="variable-type">{variable.type.toUpperCase()}</div>
                              <div className="variable-value">{variable.value}</div>
                            </div>
                          ))}
                        </div>
                        
                        <div 
                          className={`scope-area block-scope ${scopeLayout === 'reversed' ? 'reversed' : ''}`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                            if (data.type === 'scopeVariable') {
                              placeScopeVariable(data.id, 'block');
                            }
                          }}
                        >
                          <h3>{t('variableMaster.scopeAreas.red')}</h3>
                          
                          <div className="placed-variables">
                            {currentAnswers.block.map((variable, index) => (
                              <div 
                                key={`block-${variable.id}-${index}`}
                                className={`scope-variable ${
                                  scopeLayout === 'normal' 
                                    ? `${variable.type}-variable placed` 
                                    : variable.id === 1 
                                      ? 'const-variable-reversed placed' 
                                      : variable.id === 2 
                                        ? 'let-variable-reversed placed' 
                                        : 'var-variable-reversed placed'
                                }`}
                                onClick={() => removeScopeVariable(variable.id, 'block', index)}
                              >
                                <div className="variable-type">{variable.type.toUpperCase()}</div>
                                <div className="variable-value">{variable.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="scope-controls">
                    <button 
                      className="btn check-button"
                      onClick={checkScopeLevel}
                    >
                      {t('variableMaster.check')}
                    </button>
                  </div>
                </div>
              )}
              
              {levelCompleted && (
                <div className="level-complete-container">
                  <div className="level-complete-box">
                    <h2>{t('variableMaster.levelCompleted')}</h2>
                    <p>{t('variableMaster.completedLevel', { levelName: levels[currentLevel].name })}</p>
                    <p>{t('variableMaster.earnedPoints', { points: levelCompletionScore })}</p>
                    <p>{t('variableMaster.totalPoints', { score: score })}</p>
                    
                    {currentLevel === 2 && (
                      <div className="scope-example">
                        <h3>{t('variableMaster.scopeSummary.title')}</h3>
                        <div className="scope-rules-summary">
                          <p><strong>VAR:</strong> {t('variableMaster.scopeSummary.var')}</p>
                          <p><strong>LET:</strong> {t('variableMaster.scopeSummary.let')}</p>
                          <p><strong>CONST:</strong> {t('variableMaster.scopeSummary.const')}</p>
                          <p><strong>{t('variableMaster.scopeSummary.note')}</strong></p>
                        </div>
                        
                        <h3>{t('variableMaster.scopeSummary.exampleTitle')}</h3>
                        <pre>
{`functionx { // Yeşil Alan (Global Scope)
  var x = 5  // Her yerden erişilebilir
  functiony { // Mavi Alan (Function Scope)
    let y = 3  // Mavi ve Kırmızı alandan erişilebilir
    functionz { // Kırmızı Alan (Block Scope)
      const z = 1  // Sadece Kırmızı alandan erişilebilir
      
      console.log(x); // 5 - VAR her alandan erişilebilir
      console.log(y); // 3 - LET tanımlandığı ve alt alanlardan erişilebilir
      console.log(z); // 1 - CONST tanımlandığı alandan erişilebilir
    }
    
    console.log(x); // 5 - VAR her alandan erişilebilir
    console.log(y); // 3 - LET tanımlandığı alandan erişilebilir
    // console.log(z); // Hata! z tanımlanmamış - CONST üst alanlardan erişilemez
  }
  
  console.log(x); // 5 - VAR kendi alanından erişilebilir
  // console.log(y); // Hata! y tanımlanmamış - LET üst alanlardan erişilemez
  // console.log(z); // Hata! z tanımlanmamış - CONST üst alanlardan erişilemez
}`}
                        </pre>
                      </div>
                    )}
                    
                    <button 
                      className="btn next-level-button"
                      onClick={goToNextLevel}
                    >
                      {currentLevel < levels.length - 1 ? t('variableMaster.nextLevel') : t('variableMaster.finish')}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="game-controls">
                <button 
                  className="btn back-button"
                  onClick={() => setGameStarted(false)}
                >
                  {t('variableMaster.back')}
                </button>
                
                {currentLevel === 0 && !levelCompleted && (
                  <button 
                    className="btn check-button"
                    onClick={checkLevelComplete}
                  >
                    {t('variableMaster.check')}
                  </button>
                )}
                
                {currentLevel === 1 && !levelCompleted && (
                  <button 
                    className="btn check-button"
                    onClick={checkLevelTwoComplete}
                  >
                    {t('variableMaster.check')}
                  </button>
                )}
              </div>
              
              {showError && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}

              {showModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2>{t('variableMaster.stageCompleted')}</h2>
                    <p>{modalMessage}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VariableMasterGame; 
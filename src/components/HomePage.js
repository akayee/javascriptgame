import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'tr';

  const changeLanguage = () => {
    const newLang = currentLanguage === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="game-title">{t('homepage.title')}</h1>
        <div className="subtitle-box">
          <h2 className="game-subtitle">{t('homepage.subtitle')}</h2>
        </div>
        
        {/* Dil değiştirme butonu */}
        <div 
          className="language-switch" 
          onClick={changeLanguage}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#1e293b',
            padding: '5px 15px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            position: 'relative',
            padding: '2px'
          }}>
            <span style={{ 
              padding: '0 10px', 
              color: '#fff',
              fontWeight: currentLanguage === 'tr' ? 'bold' : 'normal',
              backgroundColor: currentLanguage === 'tr' ? '#3b82f6' : 'transparent',
              borderRadius: '15px',
              transition: 'all 0.3s ease'
            }}>
              TR
            </span>
            <span style={{ 
              padding: '0 10px', 
              color: '#fff',
              fontWeight: currentLanguage === 'en' ? 'bold' : 'normal',
              backgroundColor: currentLanguage === 'en' ? '#3b82f6' : 'transparent',
              borderRadius: '15px',
              transition: 'all 0.3s ease'
            }}>
              EN
            </span>
          </div>
        </div>
      </div>
      
      <div className="games-container">
        <div className="game-card">
          <div className="game-thumbnail type-defender-thumbnail">
            <div className="game-overlay">
              <h3>Type Defender</h3>
              <p>{t('homepage.typeDefenderDesc')}</p>
            </div>
          </div>
          <Link to="/type-defender" className="btn glow-button">{t('homepage.play')}</Link>
        </div>
        
        <div className="game-card">
          <div className="game-thumbnail variable-master-thumbnail">
            <div className="game-overlay">
              <h3>Variable Master</h3>
              <p>{t('homepage.variableMasterDesc')}</p>
            </div>
          </div>
          <Link to="/variable-master" className="btn glow-button">{t('homepage.play')}</Link>
        </div>
      </div>
      
      <div className="game-info-container">
        <div className="info-card description-card">
          <h3>{t('homepage.aboutGames')}</h3>
          <p>
            {t('homepage.aboutDesc')}
          </p>
          <p>
            <strong>Type Defender:</strong> {t('homepage.typeDefenderLongDesc')}
          </p>
          <p>
            <strong>Variable Master:</strong> {t('homepage.variableMasterLongDesc')}
          </p>
        </div>
        
        <div className="info-card key-commands-card">
          <h3>{t('homepage.keyCommands')}</h3>
          <div className="key-grid">
            <div className="key-item number-key"><span className="key">N</span> {t('dataTypes.number')}</div>
            <div className="key-item string-key"><span className="key">S</span> {t('dataTypes.string')}</div>
            <div className="key-item boolean-key"><span className="key">B</span> {t('dataTypes.boolean')}</div>
            <div className="key-item float-key"><span className="key">F</span> {t('dataTypes.float')}</div>
            <div className="key-item object-key"><span className="key">O</span> {t('dataTypes.object')}</div>
            <div className="key-item null-key"><span className="key">L</span> {t('dataTypes.null')}</div>
            <div className="key-item undefined-key"><span className="key">U</span> {t('dataTypes.undefined')}</div>
          </div>
        </div>
        
        <div className="info-card difficulty-card">
          <h3>{t('homepage.difficultyLevels')}</h3>
          <div className="difficulty-levels">
            <div className="difficulty easy">
              <h4>{t('homepage.easy')}</h4>
              <p>{t('homepage.easyDesc')}</p>
            </div>
            <div className="difficulty medium">
              <h4>{t('homepage.medium')}</h4>
              <p>{t('homepage.mediumDesc')}</p>
            </div>
            <div className="difficulty hard">
              <h4>{t('homepage.hard')}</h4>
              <p>{t('homepage.hardDesc')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="home-footer">
        <p>{t('homepage.footer')}</p>
      </footer>
    </div>
  );
};

export default HomePage; 
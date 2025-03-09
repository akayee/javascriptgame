import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GameSelectionPage.css';

const GameSelectionPage = () => {
  return (
    <div className="game-selection-container">
      <div className="hero-section">
        <h1 className="main-title">JavaScript Oyunları</h1>
        <div className="subtitle-box">
          <h2 className="main-subtitle">JavaScript'i Oyun Oynayarak Öğrenin</h2>
        </div>
      </div>
      
      <div className="games-container">
        <div className="game-card">
          <div className="game-thumbnail type-defender-thumbnail">
            <div className="game-overlay">
              <h3>Type Defender</h3>
              <p>JavaScript veri tiplerini öğreten eğlenceli oyun</p>
            </div>
          </div>
          <Link to="/type-defender" className="btn glow-button">OYNA</Link>
        </div>
        
        <div className="game-card">
          <div className="game-thumbnail variable-master-thumbnail">
            <div className="game-overlay">
              <h3>Variable Master</h3>
              <p>JavaScript değişken türlerini ve scope kurallarını öğreten interaktif oyun</p>
            </div>
          </div>
          <Link to="/variable-master" className="btn glow-button">OYNA</Link>
        </div>
      </div>
      
      <footer className="selection-footer">
        <p>JavaScript Öğrenme Araçları - &copy; 2023</p>
      </footer>
    </div>
  );
};

export default GameSelectionPage; 
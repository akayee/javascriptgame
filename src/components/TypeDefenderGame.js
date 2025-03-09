import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Phaser from 'phaser';
import { GameScene } from '../game/GameScene';
import { PreloadScene } from '../game/PreloadScene';
import { MenuScene } from '../game/MenuScene';
import { GameOverScene } from '../game/GameOverScene';

const TypeDefenderGame = () => {
  const gameContainerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainerRef.current,
        backgroundColor: '#282c34',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 100 },
            debug: false
          }
        },
        scene: [PreloadScene, MenuScene, GameScene, GameOverScene]
      };

      // Oyun örneğini oluştur
      gameRef.current = new Phaser.Game(config);
    }

    // Temizleme fonksiyonu
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-page">
      <div className="game-wrapper">
        <div className="game-container" ref={gameContainerRef}></div>
        <div className="game-controls">
          <Link to="/" className="btn btn-secondary back-button">Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
};

export default TypeDefenderGame; 
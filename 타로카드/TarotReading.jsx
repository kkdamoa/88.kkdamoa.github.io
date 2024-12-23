// TarotReading.jsx
import React, { useState } from 'react';
import tarotData from './tarot-data';
import './TarotReading.css';

function TarotReading() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const selectCards = () => {
    const shuffled = [...tarotData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setSelectedCards(selected);
    setIsReading(true);
    
    // 카드 뒤집기 애니메이션 후 해석 표시
    setTimeout(() => {
      setShowInterpretation(true);
    }, 3000);
  };

  return (
    <div className="tarot-container">
      {!isReading ? (
        <button className="start-button" onClick={selectCards}>
          타로 카드 선택하기
        </button>
      ) : (
        <>
          <div className="cards-container">
            {selectedCards.map((card, index) => (
              <div 
                key={card.id} 
                className={`tarot-card ${isReading ? 'flip' : ''}`}
                style={{animationDelay: `${index * 0.5}s`}}
              >
                <div className="card-inner">
                  <div className="card-front"></div>
                  <div className="card-back">
                    <h3>{card.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {showInterpretation && (
            <div className="interpretation-container">
              {selectedCards.map((card, index) => (
                <div key={card.id} className="interpretation fade-in">
                  <h3>{['과거', '현재', '미래'][index]}: {card.name}</h3>
                  <p>{card.meanings.love.upright}</p>
                  <p>{card.keywords.join(', ')}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TarotReading;
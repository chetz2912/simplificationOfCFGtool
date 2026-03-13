import React from 'react';

function NavigationControls({ steps, currentStep, onStepChange, onReset, isAutoPlaying, onToggleAutoPlay, onShowResults }) {
  const stepNames = [
    'Original Grammar',
    'Remove Useless Symbols',
    'Eliminate Null Productions',
    'Remove Unit Productions'
  ];

  return (
    <div className="nav-controls">
      <div className="step-buttons">
        {stepNames.map((name, index) => (
          <button
            key={index}
            className={`step-btn ${currentStep === index ? 'active' : ''}`}
            onClick={() => onStepChange(index)}
            disabled={isAutoPlaying}
          >
            {index === 0 ? 'Original' : `Step ${index}`}
            <br />
            <small>{name}</small>
          </button>
        ))}
      </div>

      <div className="auto-play-controls">
        <button
          className={`auto-play-btn ${isAutoPlaying ? 'playing' : ''}`}
          onClick={onToggleAutoPlay}
          disabled={currentStep >= steps.length}
        >
          {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto Play'}
        </button>

        <button
          className="results-btn"
          onClick={onShowResults}
          disabled={steps.length === 0}
        >
          📊 Show Results
        </button>

        <button className="home-btn" onClick={onReset}>
          🏠 Home
        </button>

        <button className="reset-btn" onClick={onReset}>
          New Grammar
        </button>
      </div>
    </div>
  );
}

export default NavigationControls;

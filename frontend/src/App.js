import React, { useState, useEffect } from 'react';
import './styles/main.css';
import GrammarInput from './components/GrammarInput';
import StepVisualizer from './components/StepVisualizer';
import NavigationControls from './components/NavigationControls';
import ResultsComparison from './components/ResultsComparison';

function App() {
  const [grammar, setGrammar] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGrammarSubmit = async (grammarData) => {
    setIsLoading(true);
    setError(null);
    setIsAutoPlaying(false);

    try {
      const response = await fetch('https://simplificationofcfgtool-1.onrender.com/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grammarData),
      });

      const data = await response.json();

      if (data.success) {
        setGrammar(grammarData);
        setSteps(data.steps);
        setCurrentStep(0);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleReset = () => {
    setGrammar(null);
    setSteps([]);
    setCurrentStep(0);
    setError(null);
    setIsAutoPlaying(false);
  };

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // 2 second delay between steps

      return () => clearTimeout(timer);
    } else if (isAutoPlaying && currentStep >= steps.length) {
      setIsAutoPlaying(false);
      setShowResults(true); // Show results when auto-play completes
    }
  }, [isAutoPlaying, currentStep, steps.length]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const showAnimationView = () => {
    setShowResults(false);
  };

  const showResultsView = () => {
    setShowResults(true);
    setIsAutoPlaying(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Grammar Simplification Tool</h1>
        <p>Visualize context-free grammar simplification step by step</p>
        {isAutoPlaying && (
          <div className="auto-play-indicator">
            🎬 Auto-playing through steps...
          </div>
        )}
      </header>

      <main className="app-main">
        {!grammar ? (
          <div className="input-section">
            <GrammarInput onSubmit={handleGrammarSubmit} isLoading={isLoading} />
            {error && <div className="error-message animate-fade-in">{error}</div>}
          </div>
        ) : showResults ? (
          <div className="results-section">
            <ResultsComparison
              originalGrammar={grammar}
              finalGrammar={steps.length > 0 ? steps[steps.length - 1].grammar : grammar}
              steps={steps}
              onBackToAnimation={showAnimationView}
              onHome={handleReset}
            />
          </div>
        ) : (
          <div className="visualization-section">
            <NavigationControls
              steps={steps}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              onReset={handleReset}
              isAutoPlaying={isAutoPlaying}
              onToggleAutoPlay={toggleAutoPlay}
              onShowResults={showResultsView}
            />
            <StepVisualizer
              steps={steps}
              currentStep={currentStep}
              originalGrammar={grammar}
              isAutoPlaying={isAutoPlaying}
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built for understanding formal language theory</p>
      </footer>
    </div>
  );
}

export default App;

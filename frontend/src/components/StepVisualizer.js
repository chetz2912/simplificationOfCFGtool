import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function StepVisualizer({ steps, currentStep, originalGrammar, isAutoPlaying }) {
  const getCurrentGrammar = () => {
    if (currentStep === 0) {
      return originalGrammar;
    }
    return steps[currentStep - 1]?.grammar || originalGrammar;
  };

  const getStepDescription = () => {
    if (currentStep === 0) {
      return 'Original grammar as entered by the user.';
    }
    return steps[currentStep - 1]?.description || '';
  };

  const formatGrammar = (grammar) => {
    if (!grammar) return '';

    let output = `Nonterminals: ${grammar.nonterminals.join(', ')}\n`;
    output += `Terminals: ${grammar.terminals.join(', ')}\n`;
    output += `Start: ${grammar.start_symbol}\n\n`;
    output += 'Productions:\n';

    Object.entries(grammar.productions).forEach(([nt, prods]) => {
      prods.forEach(prod => {
        const rhs = prod.length === 0 ? 'ε' : prod.join(' ');
        output += `  ${nt} → ${rhs}\n`;
      });
    });

    return output;
  };

  const currentGrammar = getCurrentGrammar();
  const stepDescription = getStepDescription();

  return (
    <div className="step-visualizer">
      <TransitionGroup>
        <CSSTransition
          key={currentStep}
          timeout={500}
          classNames="step-transition"
        >
          <div>
            {stepDescription && (
              <div className="step-description">
                <strong>Step {currentStep}:</strong> {stepDescription}
              </div>
            )}

            <div className="grammar-display">
              <div className="grammar-title">
                {currentStep === 0 ? 'Original Grammar' : `After ${steps[currentStep - 1]?.step}`}
              </div>
              <pre className="grammar-content">
                {formatGrammar(currentGrammar)}
              </pre>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>

      {currentStep > 0 && currentStep < steps.length + 1 && (
        <div className="progress-indicator">
          <div className="progress-bar">
            <div
              className={`progress-fill ${isAutoPlaying ? 'auto-playing' : ''}`}
              style={{ width: `${(currentStep / (steps.length + 1)) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Step {currentStep} of {steps.length + 1}
          </div>
        </div>
      )}
    </div>
  );
}

export default StepVisualizer;

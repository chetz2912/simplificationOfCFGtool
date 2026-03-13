import React from 'react';

function ResultsComparison({ originalGrammar, finalGrammar, steps, onBackToAnimation, onHome }) {
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

  const getSimplificationSummary = () => {
    const summary = [];
    if (steps.length >= 1) summary.push("✓ Removed useless symbols");
    if (steps.length >= 2) summary.push("✓ Eliminated ε-productions");
    if (steps.length >= 3) summary.push("✓ Removed unit productions");
    return summary;
  };

  return (
    <div className="results-comparison">
      <div className="results-header">
        <h2>🎉 Simplification Complete!</h2>
        <p>Your context-free grammar has been successfully simplified through {steps.length} algorithmic steps.</p>

        <div className="simplification-summary">
          <h3>Applied Transformations:</h3>
          <ul>
            {getSimplificationSummary().map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grammar-comparison">
        <div className="grammar-column">
          <div className="grammar-card original">
            <h3>📝 Original Grammar</h3>
            <pre className="grammar-content">
              {formatGrammar(originalGrammar)}
            </pre>
          </div>
        </div>

        <div className="comparison-arrow">
          <div className="arrow">⟹</div>
          <div className="steps-count">{steps.length} Steps</div>
        </div>

        <div className="grammar-column">
          <div className="grammar-card simplified">
            <h3>✨ Simplified Grammar</h3>
            <pre className="grammar-content">
              {formatGrammar(finalGrammar)}
            </pre>
          </div>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="steps-summary">
          <h3>Step-by-Step Changes:</h3>
          <div className="steps-timeline">
            {steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <div className="step-title">{step.step}</div>
                  <div className="step-description">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="back-to-animation-container">
        <button className="home-btn" onClick={onHome}>
          🏠 Home
        </button>
        <button className="back-to-animation-btn" onClick={onBackToAnimation}>
          🔄 Back to Step-by-Step Animation
        </button>
      </div>
    </div>
  );
}

export default ResultsComparison;
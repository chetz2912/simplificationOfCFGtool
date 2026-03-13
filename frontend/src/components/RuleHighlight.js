import React from 'react';

function RuleHighlight({ rule, isHighlighted }) {
  return (
    <div className={`rule-highlight ${isHighlighted ? 'highlighted' : ''}`}>
      <span className="rule-lhs">{rule.lhs}</span>
      <span className="rule-arrow">→</span>
      <span className="rule-rhs">
        {rule.rhs.map((symbol, index) => (
          <span
            key={index}
            className={`rule-symbol ${rule.highlightedSymbols?.includes(index) ? 'symbol-highlighted' : ''}`}
          >
            {symbol}
          </span>
        ))}
      </span>
    </div>
  );
}

export default RuleHighlight;

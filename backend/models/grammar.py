class Grammar:
    def __init__(self, nonterminals, terminals, start_symbol, productions):
        """
        Initialize a context-free grammar.

        Args:
            nonterminals: Set of nonterminal symbols
            terminals: Set of terminal symbols
            start_symbol: The start symbol
            productions: Dict mapping nonterminals to list of productions.
                        Each production is a list of symbols (terminals/nonterminals/ε)
        """
        self.nonterminals = set(nonterminals)
        self.terminals = set(terminals)
        self.start_symbol = start_symbol
        self.productions = productions  # dict: str -> list[list[str]]

    def __str__(self):
        """String representation of the grammar for display."""
        result = f"Nonterminals: {sorted(self.nonterminals)}\n"
        result += f"Terminals: {sorted(self.terminals)}\n"
        result += f"Start: {self.start_symbol}\n"
        result += "Productions:\n"
        for nt, prods in sorted(self.productions.items()):
            for prod in prods:
                rhs = ' '.join(prod) if prod else 'ε'
                result += f"  {nt} → {rhs}\n"
        return result

    def to_dict(self):
        """Convert grammar to dictionary for JSON serialization."""
        return {
            'nonterminals': sorted(self.nonterminals),
            'terminals': sorted(self.terminals),
            'start_symbol': self.start_symbol,
            'productions': {nt: prods for nt, prods in self.productions.items()}
        }

    @classmethod
    def from_dict(cls, data):
        """Create grammar from dictionary representation."""
        return cls(
            data['nonterminals'],
            data['terminals'],
            data['start_symbol'],
            data['productions']
        )

"""
Utility functions for grammar processing and validation.
"""

def validate_grammar_data(data):
    """
    Validate grammar data from API request.

    Args:
        data: Dictionary with grammar data

    Returns:
        (is_valid, error_message)
    """
    required_fields = ['nonterminals', 'terminals', 'start_symbol', 'productions']

    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"

    # Check types
    if not isinstance(data['nonterminals'], list):
        return False, "nonterminals must be a list"
    if not isinstance(data['terminals'], list):
        return False, "terminals must be a list"
    if not isinstance(data['start_symbol'], str):
        return False, "start_symbol must be a string"
    if not isinstance(data['productions'], dict):
        return False, "productions must be a dictionary"

    # Check start symbol is in nonterminals
    if data['start_symbol'] not in data['nonterminals']:
        return False, "start_symbol must be in nonterminals"

    # Check productions reference valid symbols
    all_symbols = set(data['nonterminals']) | set(data['terminals']) | {'ε'}
    for nt, prods in data['productions'].items():
        if nt not in data['nonterminals']:
            return False, f"Production left side '{nt}' is not a nonterminal"
        if not isinstance(prods, list):
            return False, f"Productions for '{nt}' must be a list"
        for prod in prods:
            if not isinstance(prod, list):
                return False, f"Each production must be a list"
            for symbol in prod:
                if symbol not in all_symbols:
                    return False, f"Unknown symbol '{symbol}' in production"

    return True, None

def format_grammar_text(grammar_dict):
    """
    Format grammar dictionary as readable text.

    Args:
        grammar_dict: Grammar in dictionary format

    Returns:
        String representation
    """
    lines = []
    lines.append(f"Nonterminals: {', '.join(sorted(grammar_dict['nonterminals']))}")
    lines.append(f"Terminals: {', '.join(sorted(grammar_dict['terminals']))}")
    lines.append(f"Start: {grammar_dict['start_symbol']}")
    lines.append("Productions:")

    for nt in sorted(grammar_dict['productions'].keys()):
        for prod in grammar_dict['productions'][nt]:
            rhs = ' '.join(prod) if prod else 'ε'
            lines.append(f"  {nt} → {rhs}")

    return '\n'.join(lines)

def is_terminal(symbol, terminals):
    """Check if a symbol is a terminal."""
    return symbol in terminals

def is_nonterminal(symbol, nonterminals):
    """Check if a symbol is a nonterminal."""
    return symbol in nonterminals

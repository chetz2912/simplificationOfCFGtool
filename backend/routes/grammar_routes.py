from flask import Blueprint, request, jsonify
from models.grammar import Grammar
from services.simplification import SimplificationService
from services.utils import validate_grammar_data

grammar_bp = Blueprint('grammar', __name__)

@grammar_bp.route('/simplify', methods=['POST'])
def simplify_grammar():
    """
    Simplify a context-free grammar.

    Expected JSON payload:
    {
        "nonterminals": ["S", "A", "B"],
        "terminals": ["a", "b"],
        "start_symbol": "S",
        "productions": {
            "S": [["A", "B"], ["a"]],
            "A": [["a"], ["ε"]],
            "B": [["b"]]
        }
    }
    """
    try:
        data = request.get_json()

        # Validate input data
        is_valid, error_msg = validate_grammar_data(data)
        if not is_valid:
            return jsonify({'success': False, 'error': error_msg}), 400

        # Create grammar object
        grammar = Grammar(
            nonterminals=data['nonterminals'],
            terminals=data['terminals'],
            start_symbol=data['start_symbol'],
            productions=data['productions']
        )

        # Simplify the grammar
        steps, final_grammar = SimplificationService.simplify_grammar(grammar)

        return jsonify({
            'success': True,
            'steps': steps,
            'final_grammar': final_grammar.to_dict()
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@grammar_bp.route('/examples', methods=['GET'])
def get_examples():
    """Return sample grammars for testing."""
    examples = {
        'simple': {
            'nonterminals': ['S', 'A'],
            'terminals': ['a', 'b'],
            'start_symbol': 'S',
            'productions': {
                'S': [['A', 'A'], ['b']],
                'A': [['a'], ['ε']]
            }
        },
        'with_units': {
            'nonterminals': ['S', 'A', 'B'],
            'terminals': ['a', 'b'],
            'start_symbol': 'S',
            'productions': {
                'S': [['A']],
                'A': [['B']],
                'B': [['a'], ['b']]
            }
        }
    }

    return jsonify(examples)

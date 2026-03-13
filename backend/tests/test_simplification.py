import unittest
from models.grammar import Grammar
from services.simplification import SimplificationService

class TestSimplification(unittest.TestCase):

    def test_remove_useless_symbols(self):
        """Test removal of useless symbols."""
        # Grammar with useless symbols
        grammar = Grammar(
            nonterminals=['S', 'A', 'B', 'C'],
            terminals=['a', 'b'],
            start_symbol='S',
            productions={
                'S': [['A'], ['a']],
                'A': [['B']],
                'B': [['b']],
                'C': [['c']]  # C is useless (c not in terminals, and C not reachable)
            }
        )

        new_grammar, desc = SimplificationService.remove_useless_symbols(grammar)

        # Should only keep S, A, B
        self.assertEqual(new_grammar.nonterminals, {'S', 'A', 'B'})
        self.assertEqual(new_grammar.terminals, {'a', 'b'})
        self.assertEqual(new_grammar.start_symbol, 'S')

    def test_eliminate_null_productions(self):
        """Test elimination of ε-productions."""
        grammar = Grammar(
            nonterminals=['S', 'A'],
            terminals=['a', 'b'],
            start_symbol='S',
            productions={
                'S': [['A', 'A'], ['b']],
                'A': [['a'], ['ε']]
            }
        )

        new_grammar, desc = SimplificationService.eliminate_null_productions(grammar)

        # A should be nullable, new productions should be generated
        self.assertIn('A', desc)  # A should be identified as nullable
        # S should have new productions: AA, A, b (from removing A's)
        s_prods = new_grammar.productions['S']
        self.assertIn(['b'], s_prods)
        self.assertIn(['A'], s_prods)  # From AA with one A removed

    def test_remove_unit_productions(self):
        """Test removal of unit productions."""
        grammar = Grammar(
            nonterminals=['S', 'A', 'B'],
            terminals=['a', 'b'],
            start_symbol='S',
            productions={
                'S': [['A']],
                'A': [['B']],
                'B': [['a'], ['b']]
            }
        )

        new_grammar, desc = SimplificationService.remove_unit_productions(grammar)

        # S should have B's productions directly
        s_prods = new_grammar.productions['S']
        self.assertIn(['a'], s_prods)
        self.assertIn(['b'], s_prods)

    def test_full_simplification(self):
        """Test the complete simplification process."""
        # Grammar with all types of issues
        grammar = Grammar(
            nonterminals=['S', 'A', 'B', 'C'],
            terminals=['a', 'b'],
            start_symbol='S',
            productions={
                'S': [['A'], ['C']],  # C is useless
                'A': [['B'], ['ε']],  # Unit and ε productions
                'B': [['a'], ['b']],
                'C': [['c']]  # Useless
            }
        )

        steps, final_grammar = SimplificationService.simplify_grammar(grammar)

        # Should have 3 steps
        self.assertEqual(len(steps), 3)

        # Final grammar should be simplified
        self.assertEqual(final_grammar.nonterminals, {'S', 'A', 'B'})
        self.assertEqual(final_grammar.terminals, {'a', 'b'})

if __name__ == '__main__':
    unittest.main()

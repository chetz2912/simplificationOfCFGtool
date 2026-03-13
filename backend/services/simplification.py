from models.grammar import Grammar

class SimplificationService:
    @staticmethod
    def simplify_grammar(grammar):
        """
        Simplify a context-free grammar through three steps:
        1. Remove useless symbols
        2. Eliminate null productions
        3. Remove unit productions

        Returns: (steps_list, final_grammar)
        """
        steps = []
        current_grammar = grammar

        # Step 1: Remove useless symbols
        current_grammar, step_desc = SimplificationService.remove_useless_symbols(current_grammar)
        steps.append({
            'step': 'Remove Useless Symbols',
            'description': step_desc,
            'grammar': current_grammar.to_dict()
        })

        # Step 2: Eliminate null productions
        current_grammar, step_desc = SimplificationService.eliminate_null_productions(current_grammar)
        steps.append({
            'step': 'Eliminate Null Productions',
            'description': step_desc,
            'grammar': current_grammar.to_dict()
        })

        # Step 3: Remove unit productions
        current_grammar, step_desc = SimplificationService.remove_unit_productions(current_grammar)
        steps.append({
            'step': 'Remove Unit Productions',
            'description': step_desc,
            'grammar': current_grammar.to_dict()
        })

        return steps, current_grammar

    @staticmethod
    def remove_useless_symbols(grammar):
        """
        Remove useless symbols from the grammar.
        A symbol is useless if it's not generating or not reachable from start.
        """
        # Step 1: Find generating symbols (can derive terminal strings)
        generating = set()
        changed = True
        while changed:
            changed = False
            for nt in grammar.nonterminals:
                if nt in generating:
                    continue
                # Check if any production can derive terminals
                for prod in grammar.productions.get(nt, []):
                    if all(symbol in generating or symbol in grammar.terminals or symbol == 'ε' for symbol in prod):
                        generating.add(nt)
                        changed = True
                        break

        # Step 2: Find reachable symbols (reachable from start symbol)
        reachable = set([grammar.start_symbol])
        changed = True
        while changed:
            changed = False
            for nt in list(reachable):
                if nt in grammar.productions:
                    for prod in grammar.productions[nt]:
                        for symbol in prod:
                            if symbol in grammar.nonterminals and symbol not in reachable:
                                reachable.add(symbol)
                                changed = True

        # Step 3: Keep only symbols that are both generating and reachable
        useful_nonterminals = generating.intersection(reachable)

        # Filter productions to only include useful symbols
        useful_productions = {}
        for nt in useful_nonterminals:
            useful_productions[nt] = []
            for prod in grammar.productions[nt]:
                if all(s in useful_nonterminals or s in grammar.terminals or s == 'ε' for s in prod):
                    useful_productions[nt].append(prod)

        # Update start symbol if it was removed
        new_start = grammar.start_symbol if grammar.start_symbol in useful_nonterminals else None

        new_grammar = Grammar(
            useful_nonterminals,
            grammar.terminals,
            new_start,
            useful_productions
        )

        description = f"Removed useless symbols. Generating: {sorted(generating)}, Reachable: {sorted(reachable)}, Useful: {sorted(useful_nonterminals)}"
        return new_grammar, description

    @staticmethod
    def eliminate_null_productions(grammar):
        """
        Eliminate ε-productions by finding nullable symbols and generating new productions.
        """
        # Step 1: Find nullable symbols (can derive ε)
        nullable = set()
        changed = True
        while changed:
            changed = False
            for nt in grammar.nonterminals:
                if nt in nullable:
                    continue
                for prod in grammar.productions.get(nt, []):
                    if prod == ['ε'] or all(symbol in nullable for symbol in prod):
                        nullable.add(nt)
                        changed = True
                        break

        # Step 2: Generate new productions without ε
        new_productions = {}
        for nt in grammar.nonterminals:
            new_productions[nt] = []
            for prod in grammar.productions.get(nt, []):
                if prod == ['ε']:
                    continue  # Skip ε productions
                # Generate all combinations by optionally removing nullable symbols
                combinations = SimplificationService._generate_nullable_combinations(prod, nullable)
                new_productions[nt].extend(combinations)

        # Remove duplicates and empty productions (except for start if it was nullable)
        for nt in new_productions:
            unique_prods = set(tuple(p) for p in new_productions[nt] if p or nt == grammar.start_symbol)
            new_productions[nt] = [list(p) for p in unique_prods]

        new_grammar = Grammar(
            grammar.nonterminals,
            grammar.terminals,
            grammar.start_symbol,
            new_productions
        )

        description = f"Eliminated ε-productions. Nullable symbols: {sorted(nullable)}"
        return new_grammar, description

    @staticmethod
    def _generate_nullable_combinations(prod, nullable):
        """
        Generate all combinations of a production by optionally removing nullable symbols.
        """
        if not prod:
            return [[]]

        first = prod[0]
        rest = prod[1:]

        # Recurse on rest
        rest_combinations = SimplificationService._generate_nullable_combinations(rest, nullable)

        result = []
        # Include first symbol
        for combo in rest_combinations:
            result.append([first] + combo)

        # If first is nullable, also exclude it
        if first in nullable:
            for combo in rest_combinations:
                result.append(combo)

        return result

    @staticmethod
    def remove_unit_productions(grammar):
        """
        Remove unit productions (A → B) by replacing them with B's productions.
        """
        # Step 1: Find all unit pairs (A → B where B is nonterminal)
        unit_pairs = set()
        for nt, prods in grammar.productions.items():
            for prod in prods:
                if len(prod) == 1 and prod[0] in grammar.nonterminals:
                    unit_pairs.add((nt, prod[0]))

        # Step 2: Compute transitive closure of unit relations
        units = {nt: set([nt]) for nt in grammar.nonterminals}
        changed = True
        while changed:
            changed = False
            for a, b in unit_pairs:
                if not units[b].issubset(units[a]):
                    units[a].update(units[b])
                    changed = True

        # Step 3: Generate new productions
        new_productions = {}
        for nt in grammar.nonterminals:
            new_productions[nt] = []
            # For each symbol that nt can reach via units
            for unit in units[nt]:
                # Add all non-unit productions of that symbol
                for prod in grammar.productions.get(unit, []):
                    if not (len(prod) == 1 and prod[0] in grammar.nonterminals):
                        new_productions[nt].append(prod)

        # Remove duplicates
        for nt in new_productions:
            unique_prods = set(tuple(p) for p in new_productions[nt])
            new_productions[nt] = [list(p) for p in unique_prods]

        new_grammar = Grammar(
            grammar.nonterminals,
            grammar.terminals,
            grammar.start_symbol,
            new_productions
        )

        description = f"Removed unit productions. Unit pairs found: {sorted(unit_pairs)}"
        return new_grammar, description

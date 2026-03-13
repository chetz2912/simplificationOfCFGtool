# Grammar Simplification Tool - Backend

A Flask API for simplifying context-free grammars through three main steps:
1. Remove useless symbols
2. Eliminate ε-productions
3. Remove unit productions

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/simplify
Simplify a context-free grammar.

**Request Body:**
```json
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
```

**Response:**
```json
{
  "success": true,
  "steps": [
    {
      "step": "Remove Useless Symbols",
      "description": "Removed useless symbols. Generating: {...}, Reachable: {...}, Useful: {...}",
      "grammar": {...}
    },
    ...
  ],
  "final_grammar": {...}
}
```

### GET /api/examples
Returns sample grammars for testing.

### GET /health
Health check endpoint.

## Running Tests

```bash
python -m unittest tests.test_simplification -v
```

## Project Structure

```
backend/
├── app.py                 # Flask application setup
├── models/
│   └── grammar.py         # Grammar data model
├── routes/
│   └── grammar_routes.py  # API endpoints
├── services/
│   ├── simplification.py  # Core simplification algorithms
│   └── utils.py           # Utility functions
└── tests/
    └── test_simplification.py  # Unit tests
```
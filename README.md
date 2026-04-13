# Grammar Simplification Tool

A web application that demonstrates the process of simplifying context-free grammars. The tool shows how to remove useless symbols, eliminate null productions, and remove unit productions, with each step clearly visualized.

## Features

- **Interactive Grammar Input**: Enter grammars through a user-friendly web interface
- **Step-by-Step Visualization**: See how the grammar evolves through each simplification step
- **Three Main Algorithms**:
  - Remove useless symbols (generating and reachable)
  - Eliminate ε-productions (nullable symbols)
  - Remove unit productions (A → B)
- **REST API**: Backend provides JSON API for grammar simplification
- **Educational**: Perfect for students learning formal language theory

## Architecture

### Backend (Python/Flask)
- **Models**: Grammar data structure and representation
- **Services**: Core simplification algorithms
- **API**: REST endpoints for grammar operations
- **Tests**: Unit tests for algorithm verification

### Frontend (React)
- **Components**: Input forms, step visualization, grammar display
- **API Integration**: Communicates with backend via HTTP requests
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo
https://simplification-of-cf-gtool.vercel.app/
-Frontend - Vercel 
-Backend - Railway

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r ../requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000` to use the application.

## API Usage

### Simplify Grammar
```bash
curl -X POST http://localhost:5000/api/simplify \
  -H "Content-Type: application/json" \
  -d '{
    "nonterminals": ["S", "A"],
    "terminals": ["a", "b"],
    "start_symbol": "S",
    "productions": {
      "S": [["A", "A"], ["b"]],
      "A": [["a"], ["ε"]]
    }
  }'
```

## Example Grammar

**Input Grammar:**
```
Nonterminals: S, A
Terminals: a, b
Start: S
Productions:
  S → A A
  S → b
  A → a
  A → ε
```

**After Simplification:**
```
Nonterminals: S, A
Terminals: a, b
Start: S
Productions:
  S → A A
  S → A
  S → b
  A → a
```

## Development

- **Backend Tests**: `python -m unittest backend/tests/test_simplification.py -v`
- **Frontend Tests**: `npm test` (when implemented)
- **API Documentation**: See `backend/README.md`

## Technologies

- **Backend**: Python, Flask, Flask-CORS
- **Frontend**: React, JavaScript, CSS
- **Testing**: unittest, Jest (planned)
- **Build Tools**: npm, pip

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

# Grammar Simplification Tool - Frontend

A React-based frontend for the grammar simplification tool with interactive visualizations and animations.

## Features

- **Interactive Grammar Input**: User-friendly form for entering CFGs
- **Step-by-Step Visualization**: Animated transitions between simplification steps
- **Minimalistic Design**: Clean, modern UI with smooth animations
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Feedback**: Loading states and error handling

## Technology Stack

- **React 18**: Modern React with hooks
- **CSS3**: Custom animations and responsive design
- **Axios**: HTTP client for API communication
- **Create React App**: Development build system

## Component Structure

```
src/
├── App.js                    # Main application component
├── index.js                  # React entry point
├── components/
│   ├── GrammarInput.js       # Grammar input form
│   ├── StepVisualizer.js     # Step-by-step display
│   ├── NavigationControls.js # Step navigation buttons
│   └── RuleHighlight.js      # Individual rule highlighting
├── api/
│   └── grammarAPI.js         # API communication functions
└── styles/
    └── main.css              # Main stylesheet with animations
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
npm install
npm start
```

### Available Scripts
- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Create production build

## API Integration

The frontend communicates with the Flask backend via REST API:

- `POST /api/simplify` - Simplify grammar
- `GET /api/examples` - Get sample grammars
- `GET /health` - Health check

## Design Principles

- **Minimalistic**: Clean design with ample white space
- **Interactive**: Smooth animations and hover effects
- **Accessible**: Proper contrast and keyboard navigation
- **Responsive**: Mobile-first design approach
- **Educational**: Clear visual feedback for learning

## Animations

- Fade-in transitions for content changes
- Slide animations for headers and cards
- Loading spinners for async operations
- Progress bars for step navigation
- Hover effects on interactive elements
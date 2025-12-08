# Cryptobro Frontend (Angular)

Angular 21 application for cryptocurrency price tracking with Zard UI components and Tailwind CSS.

## Features

- Real-time cryptocurrency price display
- Search functionality for cryptocurrencies
- Detailed coin information pages
- Breadcrumb navigation with search context
- Responsive design with Tailwind CSS
- Dark mode support
- Zard UI components
- TypeScript support
- Comprehensive test coverage

## Technology Stack

- **Framework**: [Angular 21](https://angular.dev) with Standalone Components
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [Zard UI](https://zardui.com)
- **Testing**: Vitest with Testing Library
- **Type Safety**: TypeScript with strict type checking
- **HTTP Client**: Angular HttpClient with RxJS Observables

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8000` (or configured URL)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment configuration:**
   ```bash
   cp .env.example .env
   ```

   The frontend expects the backend API at:
   ```env
   NG_APP_API_BASE_URL=http://localhost:8000/api
   ```

   Update this if your backend is running on a different host/port.

3. **Start the development server:**
   ```bash
   npm run start
   ```

   The frontend will be available at `http://localhost:4200`

## Development Commands

```bash
# Development server with hot reload
npm run start

# Build for production
npm run build

# Watch mode for development
npm run watch

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm run test:coverage

# Type checking
npm run ng exec -- @angular/cli:extract-i18n
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Testing

The frontend uses Vitest with Testing Library for unit testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm run test:coverage
```

**Test Structure:**
- `src/app/services/` - Service tests for API integration
- `src/app/pages/` - Component tests for pages

**Test Coverage:**
- `CoinGeckoService` - API integration tests
- Page components - UI rendering and interaction tests

## Project Structure

```
front-end-ng/
├── src/
│   ├── app/
│   │   ├── models/          # TypeScript interfaces and data models
│   │   │   └── coin.model.ts
│   │   ├── services/        # API and business logic services
│   │   │   └── coin-gecko.service.ts
│   │   ├── pages/           # Routed page components
│   │   │   ├── home.component.ts
│   │   │   ├── coin-detail.component.ts
│   │   │   └── search.component.ts
│   │   ├── components/      # Reusable components
│   │   │   ├── header.component.ts
│   │   │   └── mode-toggle.component.ts
│   │   ├── shared/          # Shared components and utilities
│   │   │   └── components/
│   │   │       ├── loading-spinner/
│   │   │       ├── breadcrumb/
│   │   │       ├── card/
│   │   │       └── table/
│   │   ├── app.ts          # Root application component
│   │   ├── app.routes.ts   # Route configuration
│   │   └── app.config.ts   # Application configuration
│   ├── index.html
│   ├── main.ts
│   └── styles.css          # Global Tailwind styles
├── angular.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Pages

| Route              | Component               | Description                       |
|--------------------|-------------------------|-----------------------------------|
| `/`                | `home.component.ts`     | Homepage with top 10 coins        |
| `/search`          | `search.component.ts`   | Search results for cryptocurrencies |
| `/coins/{symbol}`  | `coin-detail.component.ts` | Detailed coin information      |

## API Integration

The frontend communicates with the backend via services. The `CoinGeckoService` provides methods for fetching cryptocurrency data:

```typescript
import { CoinGeckoService } from '../services/coin-gecko.service'

export class YourComponent implements OnInit {
  constructor(private coinGeckoService: CoinGeckoService) {}

  ngOnInit() {
    this.coinGeckoService.getCoins().subscribe(coins => {
      console.log(coins)
    })
  }
}
```

### Available Methods

- `getCoins()` - Fetch top 10 cryptocurrencies
- `getCoinBySymbol(symbol)` - Get coin details by symbol
- `getCoinById(id)` - Get coin by ID
- `searchCoins(query)` - Search for cryptocurrencies

The API base URL is configured via the `NG_APP_API_BASE_URL` environment variable.

## Component System

The frontend uses [Zard UI](https://zardui.com) components with [Tailwind CSS](https://tailwindcss.com) styling.

### Available Components

- **Layout**: Card, Table, Breadcrumb
- **Navigation**: Header with search and theme toggle
- **Feedback**: Loading Spinner
- **Customizable**: Styled with Tailwind CSS and CSS variables

### Custom Components

- **LoadingSpinnerComponent** - Reusable loading indicator with customizable message
- **HeaderComponent** - Navigation header with search functionality
- **ModeToggleComponent** - Dark mode toggle

## Styling

The frontend uses [Tailwind CSS](https://tailwindcss.com) for styling with custom CSS variables for theming:

- **Dark Mode**: Built-in with CSS variable system
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Custom Theme**: Modify colors in `src/styles.css`

### Customizing the Theme

Edit the CSS variables in the `src/styles.css` file:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.6% 11.2%;
  /* ... more variables */
}
```

## Environment Variables

| Variable                  | Description                    | Default                          |
|---------------------------|--------------------------------|----------------------------------|
| `NG_APP_API_BASE_URL`     | Backend API base URL           | `http://localhost:8000/api`      |

## Browser Support

The frontend supports:
- Safari 12.1+
- iOS 12+
- Modern Chrome, Firefox, Edge

## Continuous Integration

The project uses GitHub Actions for automated testing and quality checks.

**Workflow:** `.github/workflows/frontend-ci.yml`
- Runs on push to `main` and feature branches
- Only triggers on changes to `front-end-ng/` directory
- Tests on Node.js 18.x and 20.x
- Includes:
  - Unit and component tests
  - TypeScript type checking
  - Production build verification

**Status Check:**
All CI checks must pass before merging to main.

## Performance

The application implements several performance optimizations:

- **Standalone Components**: Efficient component encapsulation
- **Tree Shaking**: Angular's built-in optimization removes unused code
- **Lazy Loading**: Route-based code splitting
- **Change Detection**: OnPush strategy for optimal performance
- **API Caching**: Backend implements caching (60s for coins, 5min for search)

## Troubleshooting

### Port Already in Use

If port 4200 is already in use:
```bash
ng serve --port 4201
```

### API Connection Issues

1. Ensure backend is running on `http://localhost:8000`
2. Check `NG_APP_API_BASE_URL` in `.env`
3. Verify CORS is enabled on backend
4. Check browser console for specific errors

### TypeScript Errors

Clear Angular cache and rebuild:
```bash
rm -rf .angular
npm run start
```

### Module Resolution Issues

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Notes

### Using Angular CLI

```bash
npm run ng -- <command>
```

### Creating Components

Components in this project use Angular's standalone component pattern:

```typescript
import { Component } from '@angular/core'

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: []
})
export class ExampleComponent {}
```

## Documentation

- [Angular Documentation](https://angular.dev)
- [Zard UI Documentation](https://zardui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vitest Documentation](https://vitest.dev)
- [RxJS Documentation](https://rxjs.dev)

## Contributing

Please see [../CLAUDE.md](../CLAUDE.md) for development guidelines and git workflow.

## License

This project is part of the Cryptobro monorepo.

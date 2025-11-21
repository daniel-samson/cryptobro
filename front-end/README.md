# Cryptobro Frontend

Nuxt 3 application for cryptocurrency price tracking with shadcn/vue components and Tailwind CSS.

## Features

- Real-time cryptocurrency price display
- Search functionality for cryptocurrencies
- Detailed coin information pages
- Breadcrumb navigation with search context
- Responsive design with Tailwind CSS
- Dark mode support
- shadcn/vue UI components
- TypeScript support
- Comprehensive test coverage

## Technology Stack

- **Framework**: [Nuxt 3](https://nuxt.com) with Vue 3 Composition API
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [shadcn/vue](https://www.shadcn-vue.com)
- **Testing**: Vitest with Vue Test Utils
- **Type Safety**: TypeScript with full type checking

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
   NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

   Update this if your backend is running on a different host/port.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `.output/` directory. To run the production build locally:

```bash
npm run preview
```

For production deployments, use the Node.js server directly:
```bash
node .output/server/index.mjs
```

## Testing

The frontend uses Vitest with Vue Test Utils for unit testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# View test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Structure:**
- `tests/unit/` - Component and composable unit tests
- `tests/unit/composables/` - API integration tests

**Test Coverage:**
- `useCoinGecko` composable - API integration tests
- `HomePage` component - UI rendering and interaction tests

## Project Structure

```
front-end/
├── components/          # Vue components
│   └── ui/             # shadcn/vue UI components
│       ├── Button.vue
│       ├── Card.vue
│       ├── Table.vue
│       ├── Breadcrumb.vue
│       └── ...
├── pages/              # Nuxt pages (auto-routed)
│   ├── index.vue       # Homepage with top coins
│   ├── search.vue      # Search results page
│   └── coins/
│       └── [symbol].vue # Coin detail page
├── layouts/            # Nuxt layouts
│   └── default.vue     # Default layout with header/footer
├── app/
│   ├── composables/    # Reusable Vue composables
│   │   └── useCoinGecko.ts # API integration
│   ├── utils/          # Utility functions
│   └── app.vue         # Root app component
├── assets/
│   └── css/            # Global styles and Tailwind directives
├── tests/              # Test files (unit tests)
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── vitest.config.ts    # Vitest configuration
├── tsconfig.json       # TypeScript configuration
└── .env.example        # Environment variables template
```

## Pages

| Route              | Component               | Description                       |
|--------------------|-------------------------|-----------------------------------|
| `/`                | `pages/index.vue`       | Homepage with top 10 coins        |
| `/search`          | `pages/search.vue`      | Search results for cryptocurrencies |
| `/coins/{symbol}`  | `pages/coins/[symbol].vue` | Detailed coin information      |

## API Integration

The frontend communicates with the backend via composables. The `useCoinGecko` composable provides methods for fetching cryptocurrency data:

```typescript
import { useCoinGecko } from '@/app/composables/useCoinGecko'

export default defineComponent({
  setup() {
    const { getCoins, getCoinById, searchCoins } = useCoinGecko()

    const coins = ref([])

    onMounted(async () => {
      try {
        coins.value = await getCoins()
      } catch (error) {
        console.error('Failed to fetch coins:', error)
      }
    })

    return { coins }
  }
})
```

### Available Methods

- `getCoins()` - Fetch top 10 cryptocurrencies
- `getCoinBySymbol(symbol)` - Get coin details by symbol
- `searchCoins(query)` - Search for cryptocurrencies

The API base URL is configured via the `NUXT_PUBLIC_API_BASE_URL` environment variable and can be changed without rebuilding.

## Component System

The frontend uses [shadcn/vue](https://www.shadcn-vue.com) components built on [Radix Vue](https://www.radix-vue.com) primitives:

### Available Components

- **Layout**: Card, Table, Breadcrumb
- **Forms**: Button, Input, Select
- **Accessible**: Built on WCAG 2.1 Level AA standards
- **Customizable**: Styled with Tailwind CSS and CSS variables
- **Type-Safe**: Full TypeScript support with class-variance-authority (CVA)

All components are auto-imported and available in pages and layouts without explicit imports.

### Adding New Components

Components from shadcn/vue are copied into `components/ui/` and can be customized as needed. They're not installed as dependencies, giving you full control over the component code.

## Styling

The frontend uses [Tailwind CSS](https://tailwindcss.com) for styling with custom CSS variables for theming:

- **Dark Mode**: Built-in with CSS variable system
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Custom Theme**: Modify colors in `assets/css/globals.css`

### Customizing the Theme

Edit the CSS variables in the `assets/css/globals.css` file:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.6% 11.2%;
    /* ... more variables */
  }
}
```

## Environment Variables

| Variable                      | Description                    | Default                          |
|-------------------------------|--------------------------------|----------------------------------|
| `NUXT_PUBLIC_API_BASE_URL`    | Backend API base URL           | `http://localhost:8000/api`      |

## Browser Support

The frontend supports:
- Safari 12.1+
- iOS 12+
- Modern Chrome, Firefox, Edge

See `.browserslistrc` for detailed browser targeting configuration.

## Continuous Integration

The project uses GitHub Actions for automated testing and quality checks.

**Workflow:** `.github/workflows/frontend-ci.yml`
- Runs on push to `main`, `develop`, and `feature/**` branches
- Only triggers on changes to `front-end/` directory
- Tests on Node.js 18.x and 20.x
- Includes:
  - Unit and component tests
  - TypeScript type checking
  - Code linting
  - Security vulnerability audit
  - Production build verification

**Status Check:**
All CI checks must pass before merging to main.

## Performance

The application implements several performance optimizations:

- **Auto-imports**: Components, composables, and utilities are auto-imported
- **Code splitting**: Automatic route-based code splitting
- **Image optimization**: Lazy loading for cryptocurrency images
- **API caching**: Backend implements caching (60s for coins, 5min for search)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```bash
PORT=3001 npm run dev
```

### API Connection Issues

1. Ensure backend is running on `http://localhost:8000`
2. Check `NUXT_PUBLIC_API_BASE_URL` in `.env`
3. Verify CORS is enabled on backend
4. Check browser console for specific errors

### TypeScript Errors

Clear Nuxt cache and rebuild:
```bash
rm -rf .nuxt
npm run dev
```

### Module Resolution Issues

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Documentation

- [Nuxt 3 Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [shadcn/vue Documentation](https://www.shadcn-vue.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

Please see [../CLAUDE.md](../CLAUDE.md) for development guidelines and git workflow.

## License

This project is part of the Cryptobro monorepo.

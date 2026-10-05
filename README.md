# Trade Pulse

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Zgoubnight/tradepulse-professional-trading-journal)

Trade Pulse is a modern, full-stack trading dashboard application powered by Cloudflare Workers and Pages. It features a responsive React frontend with a sleek shadcn/ui design system, real-time data handling, dark mode support, and a scalable Hono-based API backend. Built for performance and scalability, it leverages Cloudflare's edge network for lightning-fast global delivery.

## ✨ Key Features

- **Responsive Design**: Mobile-first UI with Tailwind CSS and shadcn/ui components
- **Dark/Light Theme**: Automatic system preference detection with manual toggle
- **Modern Architecture**: React 18, TypeScript, TanStack Query for data fetching
- **API-First Backend**: Hono routes for custom APIs, CORS-enabled
- **Error Handling**: Client and server-side error reporting
- **Sidebar Layout**: Collapsible navigation with search and quick links
- **Animations & Effects**: Smooth transitions, gradients, and Tailwind animations
- **Production-Ready**: Bundled with Vite, optimized for Cloudflare deployment
- **Developer Experience**: Hot reload, TypeScript strict mode, ESLint

## 🛠️ Technology Stack

| Frontend | Backend | Tools & Utils | Deployment |
|----------|---------|---------------|------------|
| React 18 | Hono | TypeScript, Tailwind CSS, shadcn/ui | Cloudflare Workers/Pages |
| Vite | Cloudflare KV/D1 (extensible) | TanStack Query, Zod, Zustand | Wrangler |
| Lucide Icons | - | Framer Motion, Sonner | Bun |
| React Router | - | Immer | - |

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Node.js (optional, Bun preferred)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd trade-pulse-j9uldlkor-wilnfxukph2

# Install dependencies
bun install
```

### Local Development
```bash
# Start the development server (frontend + worker proxy)
bun dev

# Open http://localhost:3000 (or $PORT)
```

The dev server runs Vite for the React app and proxies `/api/*` requests to the local worker (via Wrangler under the hood).

### Type Generation
```bash
# Generate Cloudflare bindings types
bun run cf-typegen
```

## 📚 Usage

### Frontend Development
- Edit pages in `src/pages/`
- Add components in `src/components/`
- Use shadcn/ui components from `@/components/ui/*`
- API calls via `fetch('/api/your-route')` – automatically proxied

### Backend Development
- Add custom API routes in `worker/userRoutes.ts`
- Core worker entrypoint auto-loads user routes (hot-reload friendly)
- Extend `Env` interface in `worker/core-utils.ts` for bindings (KV, D1, R2, etc.)

Example API route in `worker/userRoutes.ts`:
```typescript
app.get('/api/trades', async (c) => {
  // Fetch from KV/D1/etc via c.env
  return c.json({ trades: [] });
});
```

### Custom Pages/Routes
Update `src/main.tsx` router configuration:
```typescript
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/dashboard', element: <DashboardPage /> },
]);
```

## ☁️ Deployment

Deploy to Cloudflare Pages with integrated Workers in one command:

```bash
# Build and deploy
bun run deploy
```

This runs `vite build` for static assets and `wrangler deploy` for the Worker.

### Manual Deployment Steps
1. **Static Assets**: `bun build` → Upload `dist/` to Cloudflare Pages
2. **Worker**: `wrangler deploy` (binds ASSETS to Pages assets)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Zgoubnight/tradepulse-professional-trading-journal)

Configure `wrangler.jsonc` for custom bindings (KV, D1, DOs):
```jsonc
{
  "kv_namespaces": [{ "binding": "MY_KV", "id": "xxx" }]
}
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`bun dev`)
3. Commit changes (`git commit -m 'feat: add X'`)
4. Push and open a PR

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Questions? Open an issue.

Built with ❤️ on Cloudflare.
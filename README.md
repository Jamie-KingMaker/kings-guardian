# King's Guard RG Intelligence Dashboard

**Status**: Refactored to API-first architecture with mock-to-real backend support ✅

Internal RG dashboard for responsible gaming player monitoring with standardized API contracts and mock-first development workflow.

## 🏗️ Architecture Overview

This project has been refactored from hardcoded data to a clean API-first architecture:

- **Service Classes** (`src/api/services/`) — All data fetching goes through standardized service interfaces
- **HTTP Client** (`src/api/client.js`) — Unified HTTP layer with AbortController for request deduplication
- **Mock API** (`src/mocks/` + MSW) — Complete mock backend intercepting fetch requests during development
- **React Components** (`src/views/`) — Components consume services, agnostic to mock/real backend
- **Environment Toggle** (`VITE_USE_MOCK=true/false`) — Switch between mock and real API at startup

### Request Flow

```
Component.jsx
    ↓
  Service (PlayerService, etc.)
    ↓
  API Client (with AbortController)
    ↓
  MSW (if VITE_USE_MOCK=true) OR Real Backend
    ↓
  Standardized Response: { data, meta } or { error: { code, message, details } }
```

## 📦 Key Features

✅ **No Hardcoded Data** — All player, interaction, and dashboard data flows through API  
✅ **Standardized Error Handling** — Consistent error envelope across all endpoints  
✅ **Request Deduplication** — AbortController automatically cancels stale requests on rapid filter changes  
✅ **Loading States** — Skeletons appear on every data load event  
✅ **AI Safety** — Frontend sanitizes all AI-generated content (markdown → plaintext)  
✅ **Mock-to-Real** — Same code works with mock or real backend (toggle via `.env`)  
✅ **Type Safety** — Standardized enums for all domains (risk, status, interaction type, etc.)

## 🚀 Quick Start

### Development (with mocks)

```bash
npm install
npm run dev
# Open http://localhost:5173
# VITE_USE_MOCK=true by default — uses intercepted fetch via MSW
```

### Production Ready

Update `.env`:

```dotenv
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.production.com
```

**No component changes needed** — all services remain the same.

## 📋 Standardized Enums

| Field | Values |
|-------|--------|
| **risk** | `low`, `medium`, `high`, `critical` |
| **status** (player) | `outreach`, `reopened`, `flagged`, `under-review`, `monitor`, `null` |
| **type** (interaction) | `phone_call`, `sms`, `email`, `in_app`, `support_ticket` |
| **outcome** (interaction) | `completed`, `failed`, `pending`, `null` |
| **range** (date) | `7d`, `14d`, `30d`, `90d`, `ytd` |
| **page** | `0, 1, 2, ...` (0-based pagination) |

## 🔌 API Endpoints

All endpoints return structure: `{ data, meta }` on success or `{ error: { code, message, details } }` on failure.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/dashboard/summary` | GET | Risk distribution, trend data, stats |
| `/api/v1/players` | GET | Paginated player list with filters |
| `/api/v1/players/:id` | GET | Single player detail + insights |
| `/api/v1/players/:id/status` | PATCH | Update player workflow status |
| `/api/v1/interactions` | GET | Interaction log with filters + stats |
| `/api/v1/interactions` | POST | Create new interaction record |
| `/api/v1/ai/insights` | POST | Generate AI morning brief callouts |
| `/api/v1/ai/chat` | POST | AI copilot chat endpoint |

## 🗂️ Project Structure

```
src/
├── api/
│   ├── client.js              # HTTP client + AbortController
│   ├── index.js               # Service exports
│   └── services/
│       ├── DashboardService.js
│       ├── PlayerService.js
│       ├── InteractionService.js
│       └── AIService.js
├── components/                # Reusable UI components
│   ├── atoms/                 # Basic components (icons, pills, etc)
│   ├── shells/                # Layout components (sidebar, top bar)
│   └── skeletons/             # Loading placeholders
├── config/
│   ├── brands.js              # Frontend config (colors, logos)
│   ├── constants.js           # UI constants, button styles
│   └── i18n.js                # Translations/labels
├── mocks/
│   ├── browser.js             # MSW setup
│   ├── handlers/              # Mock endpoint implementations
│   └── data/                  # Fixture data generators
├── utils/
│   ├── sanitize.js            # AI content sanitization
│   ├── format.js              # Number/date formatting
│   └── dateRange.js           # Date range utilities
└── views/
    ├── Home/                  # Dashboard
    ├── PlayerList/            # Player table + filters
    ├── PlayerDetail/          # Single player view
    ├── InteractionLog/        # Interaction history + logging
    └── PopulationRisk/        # Population breakdown view
```

## 💡 Component Patterns

### Fetching Data with Loading States

```jsx
import {ApiError, playerService} from '@/api/index.js';
import {TableRowSkeleton} from '@/components/skeletons/index.js';

function MyComponent() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    playerService.getPlayers({ brand, risk: filter })
      .then(res => {
        setRows(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof ApiError ? err.body?.error?.message : 'Error');
        setLoading(false);
      });
  }, [brand, filter]);

  if (loading) return Array(10).map((_, i) => <TableRowSkeleton key={i} />);
  if (error) return <div style={{ color: '#DC2626' }}>{error}</div>;
  return <div>{rows.map(
          ()=> {
              // ...
          }
  )}</div>;
}
```

### AI Content Sanitization

```jsx
import { sanitizeInsights } from '@/utils/sanitize.js';

function InsightsList({ rawInsights }) {
  const insights = sanitizeInsights(rawInsights);
  return (
    <ul>
      {insights.map((text, i) => (
        <li key={i}>{text}</li> 
      ))}
    </ul>
  );
}
```

## 🔐 Security & Best Practices

✅ **No XSS** — AI responses sanitized to plaintext before rendering  
✅ **Secrets Safe** — `VITE_CLAUDE_API_KEY` never sent to browser (server-side only)  
✅ **Error Safe** — No sensitive data leaked in error messages  
✅ **Type Validation** — All endpoints validate query params + request bodies  
✅ **AbortController** — Prevents race conditions on rapid filter changes  

## 🧪 Testing

### Verify Mock API Works

```bash
npm run dev
# Open DevTools Console
fetch('/api/v1/players?brand=betking&page=0&limit=10')
  .then(r => r.json())
  .then(d => console.log(d))
# Should see: { data: [...], meta: { total, page, limit, fetchedAt } }
```

### Test Error Handling

```bash
fetch('/api/v1/players?range=invalid')
  .then(r => r.json())
  .then(d => console.log(d))
# Should see: { error: { code, message, details } }
```

### Test AbortController Deduplication

Rapid filter changes in UI → old requests cancelled in Network tab.

## 📚 Documentation

Detailed guides available in project root:

- **`README_PHASE_1.md`** — Project status and overview
- **`API_REFACTORING_GUIDE.md`** — Comprehensive implementation guide
- **`CODE_PATTERNS.md`** — Before/after code examples
- **`PHASE_1_CHECKLIST.md`** — Verification checklist
- **`IMPLEMENTATION_SUMMARY.md`** — Architecture deep-dive

## 🔄 Switching Backends

### From Mock to Real

1. Update `.env`:
   ```dotenv
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=https://your-api-server.com
   ```

2. Ensure backend implements same endpoint contracts (see API Endpoints section above)

3. **Zero component code changes needed** — all services remain the same

## 🛠️ Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## 📝 Notes

- This setup uses **React 18** + **Vite** for fast development
- **MSW (Mock Service Worker)** intercepts fetch requests during mock mode
- **AbortController** prevents race conditions on rapid API calls
- **Service classes** provide abstraction layer for easy real backend integration
- Response shapes are standardized globally — easy to refactor mock responses into real backend contracts

---

**Last Updated**: May 6, 2026  
**Status**: ✅ Phase 2 Complete — All components updated with error handling and standardized enums


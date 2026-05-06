# AI Assistant Instructions for Kings Guardian Project

## Project Overview
**Kings Guardian** is a Vite React-based RG Intelligence dashboard for responsible gaming monitoring across sports betting platforms (BetKing, SuperSportBet).

**Tech Stack:**
- React ^18.3.1
- Vite ^5.4.19
- Mock Service Worker (MSW) ^2.7.0
- Node.js/ES modules

---

## Directory Structure & Purpose

### Root Level Files
Only keep essential files in the root directory:

```
/Users/philipvella/work/kings-guardian/
├── package.json              # Project dependencies & scripts
├── package-lock.json         # Locked dependency versions
├── vite.config.js           # Vite build configuration
├── index.html               # Main HTML entry point
├── README.md                # Project documentation
├── .env                     # Environment variables (local)
├── .env.example             # Template for environment variables
├── .gitignore               # Git ignore configuration
├── .github/                 # GitHub workflows & config
├── .git/                    # Git repository
├── public/                  # Static assets served as-is
├── server/                  # Development server configuration
├── src/                     # Source code (main project code)
└── logo-*.svg              # Logo assets
```

### src/ Directory Structure
```
src/
├── main.jsx                 # React entry point
├── App.jsx                  # Root React component
├── styles.css              # Global styles
├── api/                    # API communication layer
│   ├── client.js           # HTTP client setup
│   ├── index.js            # API exports
│   └── services/           # API service modules
│       ├── AIService.js
│       ├── DashboardService.js
│       ├── InteractionService.js
│       └── PlayerService.js
├── components/             # Reusable React components
│   ├── DateRangePicker.jsx
│   ├── atoms/              # Small, basic components
│   ├── shells/             # Layout/structural components
│   └── skeletons/          # Loading state components
├── config/                 # Configuration files
│   ├── brands.js          # Brand/platform configuration
│   ├── constants.js       # App constants
│   └── i18n.js            # Internationalization
├── mocks/                 # Mock Service Worker (MSW) setup
│   ├── browser.js         # MSW browser setup
│   ├── data/              # Mock data generators
│   └── handlers/          # API request handlers
├── utils/                 # Utility functions
│   ├── dateRange.js
│   ├── format.js
│   └── sanitize.js
└── views/                 # Page-level components
    ├── Home/
    ├── InteractionLog/
    ├── PlayerDetail/
    ├── PlayerList/
    └── PopulationRisk/
```

---

## File Management Best Practices

### ❌ DELETE THESE TYPES OF FILES FROM ROOT

1. **Old/Duplicate Component Files** (in root, when modern versions exist in `src/`)
   - `components.jsx`, `home.jsx`, `player-list.jsx`, etc.

2. **Build Artifacts & Cache**
   - `dist/` - Can be regenerated with `npm run build`
   - `node_modules/` - Can be reinstalled with `npm install`

3. **IDE & Environment Specific**
   - `.idea/` - JetBrains IDE config
   - `.venv/` - Python virtual environments (not needed for JS projects)

4. **Temporary Generated Files**
   - Any auto-generated files from build tools

### ✅ KEEP IN ROOT

- Source configuration files (`.gitignore`, `.env`, `.env.example`)
- Build configuration (`vite.config.js`)
- Package management (`package.json`, `package-lock.json`)
- Documentation (`README.md`)
- Version control (`.git/`, `.github/`)
- Entry points (`index.html`)
- Project folders (`src/`, `public/`, `server/`)

---

## Development Workflow

### Starting Development
```bash
npm install        # Install dependencies
npm run dev        # Start development server
```

### Building for Production
```bash
npm run build      # Create optimized build in dist/
npm run preview    # Preview production build locally
```

### Available Scripts
- `npm run dev` - Start Vite dev server with HMR
- `npm run debug` - Start dev server with debug output
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run msw:init` - Initialize Mock Service Worker

---

## Code Organization Principles

1. **Components**
   - Keep components modular and single-responsibility
   - Place small, reusable UI elements in `atoms/`
   - Place layout/structural components in `shells/`
   - Place loading states in `skeletons/`

2. **API Layer**
   - All API calls go through `src/api/services/`
   - Keep backend communication centralized
   - Services should be named: `{Feature}Service.js`

3. **Configuration**
   - Brand/platform configs in `config/brands.js`
   - App-wide constants in `config/constants.js`
   - Internationalization in `config/i18n.js`

4. **Utilities**
   - Pure, reusable utility functions in `utils/`
   - Name utilities by their purpose: `dateRange.js`, `format.js`, `sanitize.js`

5. **Views**
   - Page-level components in `views/`
   - Organize by feature/page name with `index.jsx`
   - Include related sub-components

6. **Mocks**
   - Use MSW for API mocking in development
   - Handlers organized by feature in `handlers/`
   - Mock data generators in `data/`

---

## When Editing Files

1. **Before making changes**, read the file first to understand context
2. **Use semantic search** for unfamiliar codebases to understand relationships
3. **Group related edits** into batches rather than multiple separate changes
4. **Validate changes** with error checking after updates
5. **Keep imports organized** at the top of files
6. **Follow existing code style** in the project

---

## Important Notes

- This is a **Vite + React** project, not Next.js or other frameworks
- Project uses **ES modules** (`"type": "module"` in package.json)
- **Mock Service Worker (MSW)** is used for API mocking in development
- Keep the root directory clean - only essential files should be there
- All component/logic code should be in `src/`, not in root

---

## For Future AI Assistants

When working on this project:

1. **Always check the directory structure first** before making changes
2. **Clean up unnecessary files** from the root if they appear (build artifacts, node_modules, IDE configs)
3. **Organize new code** according to the src/ structure guidelines
4. **Ask if unsure** about file placement - this structure is deliberate
5. **Validate your work** by checking for errors after edits
6. **Read this file** if you're ever unsure about conventions or organization

---

**Last Updated:** May 6, 2026


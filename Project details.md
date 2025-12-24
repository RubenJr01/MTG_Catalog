# MTG Card Scanner Web Application

## Project Overview
A web application for scanning, cataloging, and managing Magic: The Gathering card collections with user authentication, card scanning via camera/upload, collection management, and deck building.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Angular 17+ | SPA framework |
| **UI Library** | Angular Material | Component library |
| **Backend** | Node.js + Express | REST API server |
| **Language** | TypeScript | Full-stack type safety |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | TypeORM or Prisma | Database abstraction |
| **Card Data** | Scryfall API | MTG card database (free) |
| **OCR** | Tesseract.js | Card text recognition |
| **Auth** | JWT + bcrypt | Secure authentication |

---

## Architecture Diagram

```
+----------------------------------------------------------+
|                    Angular Frontend                       |
|  +----------+  +----------+  +------------+  +---------+ |
|  |   Auth   |  | Scanner  |  | Collection |  |  Deck   | |
|  |  Module  |  |  Module  |  |   Module   |  | Builder | |
|  +----------+  +----------+  +------------+  +---------+ |
+----------------------------+-----------------------------+
                             | HTTP/REST API
+----------------------------v-----------------------------+
|                    Express.js Backend                     |
|  +----------+  +----------+  +------------+  +---------+ |
|  |   Auth   |  |  Cards   |  | Collection |  |  Decks  | |
|  |  Routes  |  |  Routes  |  |   Routes   |  | Routes  | |
|  +----------+  +----------+  +------------+  +---------+ |
+----------+----------------------------------+------------+
           |                                  |
      +----v-----+                      +-----v-----+
      |PostgreSQL|                      | Scryfall  |
      |    DB    |                      |    API    |
      +----------+                      +-----------+
```

---

## Database Schema

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR | Unique |
| password_hash | VARCHAR | bcrypt hashed |
| username | VARCHAR | Display name |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### UserCards (Collection)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK to Users |
| scryfall_id | VARCHAR | Scryfall card reference |
| quantity | INTEGER | Number of copies |
| condition | ENUM | NM, LP, MP, HP, DMG |
| foil | BOOLEAN | Foil version |
| notes | TEXT | User notes |
| acquired_date | DATE | When obtained |
| acquired_price | DECIMAL | Purchase price |

### Decks
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK to Users |
| name | VARCHAR | Deck name |
| format | VARCHAR | Standard, Modern, Commander, etc. |
| description | TEXT | |

### DeckCards
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| deck_id | UUID | FK to Decks |
| scryfall_id | VARCHAR | Scryfall card reference |
| quantity | INTEGER | Copies in deck |
| is_sideboard | BOOLEAN | Main deck vs sideboard |

---

## Core Features

### 1. User Authentication
- User registration with email/password
- Login with JWT token generation
- Refresh token mechanism for session persistence
- Password hashing with bcrypt (12+ salt rounds)
- Protected routes with auth guards

### 2. Card Scanner
- Camera capture using WebRTC API
- Image upload with drag-and-drop
- OCR text extraction via Tesseract.js
- Card name matching against Scryfall API
- User confirmation of matched cards
- Bulk scanning mode

### 3. Collection Management
- Add cards to personal collection
- Track quantity, condition, foil status
- Filter by color, set, type, rarity
- Sort by name, price, date added
- Collection value calculation (using Scryfall prices)
- Search within collection

### 4. Deck Builder
- Create and manage multiple decks
- Search cards from Scryfall
- Format validation (60 cards for Standard, etc.)
- Mana curve visualization
- Deck statistics (land ratio, CMC distribution)
- Export to text/MTGO format
- Highlight cards missing from collection

---

## Project Structure

```
mtg-scanner/
|
+-- client/                      # Angular frontend
|   +-- src/
|   |   +-- app/
|   |   |   +-- core/            # Shared services & guards
|   |   |   |   +-- services/
|   |   |   |   |   +-- auth.service.ts
|   |   |   |   |   +-- scryfall.service.ts
|   |   |   |   +-- interceptors/
|   |   |   |   |   +-- auth.interceptor.ts
|   |   |   |   +-- guards/
|   |   |   |       +-- auth.guard.ts
|   |   |   |
|   |   |   +-- auth/            # Login/Register
|   |   |   |   +-- login/
|   |   |   |   +-- register/
|   |   |   |
|   |   |   +-- scanner/         # Card scanning
|   |   |   |   +-- camera/
|   |   |   |   +-- upload/
|   |   |   |   +-- ocr.service.ts
|   |   |   |
|   |   |   +-- collection/      # Collection views
|   |   |   |   +-- collection-list/
|   |   |   |   +-- card-detail/
|   |   |   |   +-- collection.service.ts
|   |   |   |
|   |   |   +-- decks/           # Deck builder
|   |   |       +-- deck-list/
|   |   |       +-- deck-editor/
|   |   |       +-- deck.service.ts
|   |   |
|   |   +-- environments/
|   +-- angular.json
|   +-- package.json
|
+-- server/                      # Node.js backend
|   +-- src/
|   |   +-- index.ts             # Entry point
|   |   +-- routes/
|   |   |   +-- auth.routes.ts
|   |   |   +-- collection.routes.ts
|   |   |   +-- deck.routes.ts
|   |   +-- controllers/
|   |   +-- models/
|   |   |   +-- User.ts
|   |   |   +-- UserCard.ts
|   |   |   +-- Deck.ts
|   |   |   +-- DeckCard.ts
|   |   +-- middleware/
|   |   |   +-- auth.middleware.ts
|   |   +-- services/
|   |       +-- scryfall.service.ts
|   +-- package.json
|   +-- tsconfig.json
|
+-- docker-compose.yml           # PostgreSQL container
+-- README.md
```

---

## Implementation Steps

### Step 1: Project Initialization
- Create monorepo with `/client` and `/server` folders
- `ng new client --routing --style=scss`
- `ng add @angular/material`
- Initialize Express with TypeScript in `/server`
- Set up ESLint and Prettier
- Create docker-compose.yml for PostgreSQL

### Step 2: Database Setup
- Configure PostgreSQL connection
- Create database migrations for all tables
- Set up connection pooling

### Step 3: Authentication System
- Registration endpoint with bcrypt
- Login endpoint with JWT generation
- Refresh token mechanism
- Angular auth service with HTTP interceptor
- Login/Register components
- Route guards for protected pages

### Step 4: Scryfall Integration
- Scryfall API service (card search, autocomplete)
- Local caching for frequently accessed cards
- Rate limiting handling (10 req/sec)

### Step 5: Card Scanner
- Camera component (WebRTC getUserMedia)
- Image upload with drag-and-drop
- Tesseract.js OCR integration
- Card matching UI
- User confirmation flow

### Step 6: Collection Management
- CRUD API endpoints
- Collection grid/list views
- Filters and sorting
- Bulk import from scanner
- Price display from Scryfall

### Step 7: Deck Builder
- Deck CRUD operations
- Card search and add
- Format validation
- Stats visualization
- Export functionality

### Step 8: Polish & Deployment
- Loading states and error handling
- Responsive design
- Unit tests
- CI/CD pipeline
- Production deployment

---

## External APIs

### Scryfall API (https://scryfall.com/docs/api)
- **Free to use** - No authentication required
- **Rate limit**: 10 requests per second
- **Key endpoints**:
  - `/cards/search?q={query}` - Search cards
  - `/cards/autocomplete?q={query}` - Name autocomplete
  - `/cards/{id}` - Get card by ID
- **Data includes**: Card images, prices, legality, all printings

---

## Security Considerations

- Password hashing with bcrypt (12+ rounds)
- JWT with short expiry (15 min) + refresh tokens
- Parameterized queries via ORM (prevents SQL injection)
- CORS whitelist for frontend domain only
- Rate limiting on API endpoints
- Server-side input validation
- HTTPS in production

---

## Development Tools

- **VS Code** - IDE
- **Docker Desktop** - PostgreSQL container
- **Postman/Insomnia** - API testing
- **Angular DevTools** - Browser extension
- **pgAdmin** - Database management

---

## Useful Links

- Angular Docs: https://angular.io/docs
- Scryfall API: https://scryfall.com/docs/api
- Tesseract.js: https://tesseract.projectnaptha.com/
- TypeORM: https://typeorm.io/
- Prisma: https://www.prisma.io/docs
- Express: https://expressjs.com/
- JWT: https://jwt.io/

---

*Generated: December 2024*

---

# Getting Started Guide

## Current State

You already have a basic Angular client scaffolded at `/client`, but:
- Routes are empty
- No Angular Material installed yet
- No folder structure for modules
- No `/server` folder exists

---

## Setting Up the Skeleton

### Step 1: Install Angular Material

From within your `/client` directory, run:

```bash
ng add @angular/material
```

This will prompt you to choose a theme, set up typography, and configure animations. Angular Material provides pre-built UI components (buttons, cards, dialogs, tables, etc.).

**Documentation**: https://material.angular.io/guide/getting-started

---

### Step 2: Create the Angular Folder Structure

Use the Angular CLI to generate your modules and components. Based on your project structure:

```bash
# Core module (services, guards, interceptors)
ng generate module core

# Feature modules
ng generate module auth --routing
ng generate module scanner --routing
ng generate module collection --routing
ng generate module decks --routing
```

Then generate components within each module:

```bash
# Auth components
ng generate component auth/login
ng generate component auth/register

# Scanner components
ng generate component scanner/camera
ng generate component scanner/upload

# Collection components
ng generate component collection/collection-list
ng generate component collection/card-detail

# Deck components
ng generate component decks/deck-list
ng generate component decks/deck-editor
```

Generate services:

```bash
ng generate service core/services/auth
ng generate service core/services/scryfall
ng generate service scanner/ocr
ng generate service collection/collection
ng generate service decks/deck
```

**Documentation**: https://angular.dev/cli/generate

---

### Step 3: Set Up the Express Server

Create the server folder and initialize:

```bash
mkdir server
cd server
npm init -y
npm install express typescript ts-node @types/node @types/express cors dotenv
npm install -D nodemon
npx tsc --init
```

Create the folder structure manually:

```
server/
├── src/
│   ├── index.ts           # Entry point
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── services/
├── package.json
└── tsconfig.json
```

**Documentation**:
- Express: https://expressjs.com/en/starter/installing.html
- TypeScript with Node: https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html

---

### Step 4: Set Up PostgreSQL with Docker

Create a `docker-compose.yml` in your project root:

```yaml
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: mtg_user
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: mtg_scanner
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Run with: `docker-compose up -d`

**Documentation**: https://hub.docker.com/_/postgres

---

### Step 5: Choose and Set Up Your ORM

You have two options:

**Option A - TypeORM** (more traditional, decorator-based):
```bash
cd server
npm install typeorm pg reflect-metadata
```
Docs: https://typeorm.io/

**Option B - Prisma** (modern, schema-first):
```bash
cd server
npm install prisma @prisma/client
npx prisma init
```
Docs: https://www.prisma.io/docs/getting-started

Prisma is recommended for new projects - the developer experience is excellent, migrations are simpler, and the generated client provides excellent type safety.

---

## Key Documentation to Read

### Angular (Frontend)
| Topic | Link |
|-------|------|
| **Angular Tutorial** | https://angular.dev/tutorials/learn-angular |
| **Routing & Navigation** | https://angular.dev/guide/routing |
| **HTTP Client** | https://angular.dev/guide/http |
| **Angular Material** | https://material.angular.io/components/categories |
| **Standalone Components** (Angular 17+) | https://angular.dev/guide/components |

### Backend
| Topic | Link |
|-------|------|
| **Express.js Guide** | https://expressjs.com/en/guide/routing.html |
| **JWT Authentication** | https://jwt.io/introduction |
| **bcrypt for passwords** | https://www.npmjs.com/package/bcrypt |
| **Prisma Quickstart** | https://www.prisma.io/docs/getting-started/quickstart |

### Project-Specific APIs
| Topic | Link |
|-------|------|
| **Scryfall API** | https://scryfall.com/docs/api |
| **Tesseract.js** | https://github.com/naptha/tesseract.js |
| **WebRTC getUserMedia** | https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia |

---

## Recommended Learning Path

1. **First**: Get comfortable with Angular standalone components and routing. Follow the official Angular tutorial.

2. **Second**: Set up a basic Express server that returns JSON. Test it with Postman or curl.

3. **Third**: Connect PostgreSQL via Prisma. Create your first migration for the `Users` table.

4. **Fourth**: Implement authentication (register/login) end-to-end. This touches frontend forms, HTTP client, backend routes, password hashing, and JWT.

5. **Fifth**: Build the Scryfall integration - this is a good "read-only" feature to practice API consumption without auth complexity.

6. **Sixth**: Add collection management (CRUD operations).

7. **Last**: Implement the scanner (most complex - involves camera access and OCR).

---

## Pro Tips

- **Start simple**: Get a "hello world" working end-to-end (Angular → Express → DB) before adding complexity.
- **Use environment variables**: Store secrets in `.env` files (never commit them).
- **Respect Scryfall's rate limits**: 10 requests/second max. Consider caching responses.
- **Use Angular's `HttpInterceptor`** to automatically attach JWT tokens to requests.
- **Test your API** with Postman/Insomnia before connecting the frontend.

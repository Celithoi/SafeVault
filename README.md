SafeVault — Frontend

Frontend for SafeVault, a zero-knowledge password manager built as a full-stack portfolio project. This package contains the client application; the API lives in a separate backend/ package (NestJS + Prisma + PostgreSQL).

Overview

SafeVault lets users store and organize sensitive credentials with a zero-knowledge architecture — encryption happens client-side (AES-256 + Argon2), so the server never has access to plaintext data.

This frontend currently covers:


Public landing page with an authentication flow (login/signup) handled through a single modal, no dedicated /login or /register routes
Authenticated app shell (/app) with Dashboard, Folders, Profile, and Settings pages
Fully responsive layout


Backend integration is the next milestone — the UI is functionally complete and ready to be wired to real endpoints.

Tech Stack


React 18 + TypeScript
Vite — dev server and build tool
Tailwind CSS — styling
React Router — client-side routing


Project Structure

src/
├── components/     # Reusable UI building blocks (Button, Input, Header, AuthModal, ...)
├── layouts/        # Route-level layouts (PublicLayout, AppLayout)
├── pages/          # Route-level pages (LandingPage, DashboardPage, FoldersPage, ...)
├── routes/         # React Router configuration
├── hooks/          # Custom hooks
├── services/       # API client / integration layer
├── types/          # Shared TypeScript types
├── styles/         # Global styles
└── assets/         # Static assets

Getting Started

bash# Install dependencies
npm install

# Start the dev server
npm run dev

The app runs at http://localhost:5173 by default.

Available Scripts

CommandDescriptionnpm run devStarts the Vite dev server with HMRnpm run buildType-checks and builds for productionnpm run previewServes the production build locallynpm run lintRuns ESLint

Authentication Flow

Login and signup are handled by a single AuthModal component rather than dedicated pages:


Clicking Entrar or Criar Conta in the header opens the modal on the corresponding tab
The Hero section's email input feeds directly into the signup tab, pre-filling the email field
The modal closes on outside click, ESC, or successful submission
No routing is involved — this keeps the auth experience fast and avoids full page reloads for a flow that doesn't need shareable URLs


Roadmap


 Connect authentication forms to the backend API
 Session/token handling
 Encrypt/decrypt flow for stored credentials (client-side, zero-knowledge)
 Folder and item management wired to real data


Status

Frontend UI: feature-complete for this phase.
Backend: not yet started — see the root repository README for the full project scope.

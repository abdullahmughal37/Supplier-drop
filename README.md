# SupplierDrop — Product Sourcing SaaS

A working SaaS built on the SupplierDrop design system: merchants browse a product
catalog and **source products over WhatsApp**; admins manage the catalog, users, and
sourcing pipeline.

Built with **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS ·
Firebase (Auth + Firestore + Storage) · lucide-react · papaparse**.

---

## Quick start (demo mode — zero setup)

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no Firebase keys configured the app runs in
**demo mode**: everything works, data lives in your browser's localStorage.

| Demo account | Email | Password |
|---|---|---|
| Admin | `admin@demo.supplierdrop.com` | `Admin123!` |
| Merchant | `merchant@demo.supplierdrop.com` | `Merchant123!` |

You can also sign up new (merchant) accounts freely. To reset demo data, clear the
site's localStorage (DevTools → Application → Local Storage → delete `sd_*` keys).

## Going live with Firebase

1. **Create a Firebase project** at https://console.firebase.google.com (free Spark plan works).
2. **Enable products**
   - *Authentication* → Sign-in method → enable **Email/Password** and **Google**.
   - *Firestore Database* → Create database (production mode).
   - *Storage* → Get started (production mode).
3. **Register a Web app** (Project settings → Your apps → Web), copy the config into
   `.env.local` (template in [.env.local.example](.env.local.example)):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. **Deploy the security rules** (this is what actually protects your data):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use <your-project-id>
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
5. **Bootstrap your first admin** — sign up normally in the app, then in the Firebase
   console open *Firestore → users → (your uid)* and change `role` from `merchant`
   to `admin`. From then on you can promote/demote users from the in-app Admin → Users
   page. (Self-signup as admin is impossible by design — the rules reject it.)
6. Restart `npm run dev` — the app auto-switches from demo mode to Firebase.

## Configure WhatsApp sourcing

Admin → **Settings**:

- **WhatsApp number** — international format, digits only (e.g. `15551234567`,
  `923001234567`). This is the number that receives sourcing messages.
- **Message template** — supports `{product}`, `{sku}`, `{price}`, `{merchant}`, `{note}`.

When a merchant taps **Source on WhatsApp** on a product page, the app logs a sourcing
request (visible to the merchant under *My Requests* and to admins under *Requests*)
and opens `wa.me/<number>` with the filled-in template.

## Features

**Merchant** (`/dashboard`)
- Overview: live stats + sourcing activity chart + new arrivals
- Products: searchable, category-filtered catalog
- Product detail: gallery, pricing, margin, supplier, stock, full description,
  optional note, **Source on WhatsApp**
- My Requests: track request status (`new → contacted → quoted → closed`)
- Settings: profile, password reset, data mode

**Admin** (`/admin`)
- Overview: products / merchants / requests stats, demand chart, newest merchants
- Products: add/edit/delete, photo upload (max 8), show/hide toggle,
  **CSV bulk import** (button downloads a template; `images` column takes
  `;`-separated URLs), search
- Users: list with per-user request counts, promote/demote admin, suspend/reactivate
  (guard rails: you can't change your own role/status)
- Requests: full pipeline with status filters
- Settings: WhatsApp number + message template with live preview

## Security model

Client-side route guards are **UX only** — real enforcement is server-side in
[firestore.rules](firestore.rules) and [storage.rules](storage.rules), deny-by-default:

- Sign-up can only create your **own** user doc, always as `role: merchant`,
  `status: active`. Self-promotion is rejected by rules.
- Users can only edit cosmetic fields on themselves (`name`, `photoURL`,
  `lastActiveAt`) — never `role`/`status`. Admins can only change `role`/`status`
  of **other** users (no self-demotion/lockout, no profile impersonation).
- Products: merchants can only read `active == true`; all writes are admin-only and
  schema-validated (name/description lengths, price ≥ 0, ≤ 8 images).
- Sourcing requests: created only by active users as themselves with status `new`;
  merchants read their own, admins read all; only admins may update — and only the
  `status` field, to a whitelisted value.
- Settings: readable by active users (needed for the wa.me link), writable by admins,
  length-validated.
- Storage: `products/` images readable when signed in; writes admin-only,
  image/* content type, < 5 MB. Everything else denied.
- Suspended users are blocked in-app immediately and can't create requests (rules
  check `status == 'active'`).

Also: `.env*` is git-ignored; Firebase web keys are public by design — the rules are
the trust boundary. For production, additionally enable **App Check** (below) and
restrict the API key to your domains.

## Optional: App Check (recommended for production)

Blocks non-browser/bot traffic from reaching Firestore/Storage at all:

1. Firebase console → **App Check** → register your web app with **reCAPTCHA v3**.
2. Put the site key in `.env.local` as `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`.
3. Once traffic shows as verified, flip Firestore and Storage to **Enforce**.

The app auto-initializes App Check whenever that env var is present (`lib/firebase.ts`).

## Optional: email notifications for new sourcing requests

So your team hears about requests without watching WhatsApp:

1. Upgrade the Firebase project to the **Blaze** plan (functions requirement; free tier included).
2. Install the official **Trigger Email from Firestore** extension (Firebase console →
   Extensions), point it at collection `mail`, and give it your SMTP credentials
   (SendGrid/Mailgun/Gmail).
3. Deploy the included function: `cd functions && npm install && cd .. && firebase deploy --only functions`.
4. In the app: Admin → Settings → **Notification emails** — add the addresses.

Every new sourcing request then queues an email via `functions/index.js`
(`notifyOnSourcingRequest`). The `mail` collection is locked to server-only access in
the rules.

## Project structure

```
app/
  page.tsx                 Marketing home (from design handoff)
  signin/ · signup/        Real auth (email/password + Google), role-based redirect
  dashboard/               Merchant area (guarded)
    products/ · products/[id]/ · requests/ · settings/
  admin/                   Admin area (guarded, role=admin)
    products/ · users/ · requests/ · settings/
components/
  ui.tsx                   Logo, GoogleIcon, AuthBrandPanel (handoff)
  shell.tsx                Shared dashboard shell + shared UI helpers
  merchant-shell.tsx · admin-shell.tsx
  guard.tsx                RequireAuth (+ suspended screen)
lib/
  types.ts                 Domain types + wa.me link builder
  firebase.ts              Env-driven Firebase init
  auth-context.tsx         Session + live profile (role) context
  auth-helpers.ts          Post-auth routing, friendly error messages
  services/
    data-service.ts        DataService interface (single seam to persistence)
    firebase-service.ts    Production impl (Auth/Firestore/Storage)
    demo-service.ts        localStorage impl (auto-used when no Firebase env)
firestore.rules · storage.rules · firestore.indexes.json · firebase.json
```

## CSV import format

Header row (get it from Admin → Products → **CSV template**):

```
name,description,price,suggestedRetail,margin,rating,shipping,supplier,category,sku,stock,images,active
```

- `name` and a numeric `price` are required per row; bad rows are skipped and reported.
- `images`: `;`-separated `https://` URLs. `active`: `true`/`false` (default `true`).

## Deployment

Any Next.js host works (Vercel is the least friction). Set the six
`NEXT_PUBLIC_FIREBASE_*` env vars in the host's dashboard, and add your production
domain to Firebase *Authentication → Settings → Authorized domains*.

## Scaling note

Long lists (catalog, admin tables) render incrementally with "Show more" buttons, so
the DOM stays fast. The Firestore listeners still stream the whole collection; if the
catalog grows past a few thousand products, switch `watchProducts` to cursor-based
`limit()/startAfter()` queries inside `lib/services/firebase-service.ts` — the UI
already goes through that single seam, so nothing else changes.

# RecipeHub Client

The frontend for **RecipeHub** — a premium recipe sharing platform built with Vite, React, Tailwind CSS, DaisyUI, and Firebase authentication.

## 🚀 Live Demo

| Environment | URL |
|-------------|-----|
| Frontend (Vercel) | https://recipehub-client.vercel.app |
| Backend API (Vercel) | https://recipehub-server.vercel.app |

## 🔐 Admin Credentials (for graders)

| Field | Value |
|-------|-------|
| Email | `admin@recipehub.com` |
| Password | `Admin@1234` |

> Login at the live URL above with these credentials to access the Admin Dashboard.



- **Vite 6** + **React 18**
- **Tailwind CSS 3** + **DaisyUI 4** (custom themes: `recipelight`, `recipedark`)
- **React Router 7** (`createBrowserRouter`)
- **TanStack React Query 5**
- **Firebase** (Google sign-in)
- **Axios** with `withCredentials: true` for httpOnly JWT cookies
- **Stripe Elements** for payments
- **Framer Motion**, **React Hot Toast**, **SweetAlert2**, **React Hook Form**

## Project Structure

```
src/
├── components/         # Reusable UI (Navbar, Footer, Loader, RecipeCard, ThemeToggle)
├── hooks/              # useTheme
├── layouts/            # MainLayout, DashboardLayout
├── pages/
│   ├── public/         # Home, BrowseRecipes, RecipeDetails, Login, Register, NotFound, PaymentSuccess
│   ├── dashboard/      # Overview, MyRecipes, AddRecipe, MyFavorites, MyPurchased, Profile
│   └── admin/          # AdminOverview, ManageUsers, ManageRecipes, Reports, Transactions
├── providers/          # AuthProvider
├── routes/             # PrivateRoute, AdminRoute, router
└── utils/              # api (axios), firebase.config
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev            # http://localhost:5173
npm run build          # production build
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000`) |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_STRIPE_PREMIUM_PRICE_ID` | Stripe price ID for premium membership |
| `VITE_IMGBB_KEY` | ImgBB API key for recipe image uploads |

## Features

- 🔍 Browse, search, filter, sort, and paginate recipes
- ❤️ Like, favorite, rate, and report recipes
- 🔐 Email/password + Google sign-in (Firebase)
- 💳 Stripe Checkout for premium recipe purchases and membership
- 👨‍🍳 Author dashboard: add / edit / delete recipes
- 🛡️ Admin dashboard: users, recipes, reports, transactions
- 🌗 Dark / light theme toggle (persisted in localStorage)
- 📱 Fully responsive (mobile-first)
- ✨ Framer Motion animations throughout

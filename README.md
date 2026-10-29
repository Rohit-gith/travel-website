# Wanderly - Tours & Travel Website

A production-style tours & travel website built with **React 18**, **Vite**, **Tailwind CSS 3** and **Redux Toolkit**.

## Features

- Home page with hero search, popular tours, features and testimonials
- Tours listing with search, category filter, price slider and sorting (Redux selectors)
- Tour details with highlights, day-wise itinerary and booking form with validation
- Wishlist and bookings persisted in `localStorage`
- Fully responsive layout, sticky navbar with mobile menu

## Getting started

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build in /dist
npm run preview  # preview the production build
```

## Folder structure

```
travel-website/
├── public/                  # Static files served as-is (favicon etc.)
├── src/
│   ├── app/                 # Redux store setup + typed-style hooks
│   │   ├── store.js
│   │   └── hooks.js
│   ├── components/          # Reusable UI, grouped by purpose
│   │   ├── common/          # Generic building blocks (Button, Container, Rating...)
│   │   ├── layout/          # Navbar, Footer, Layout shell
│   │   ├── home/            # Sections used only on the home page
│   │   ├── tours/           # TourCard, TourFilters
│   │   └── booking/         # BookingForm
│   ├── constants/           # App-wide constants (nav links, contact info)
│   ├── data/                # Static seed data (replace with API later)
│   ├── features/            # Redux slices, one folder per feature
│   │   ├── tours/           # tours list, filters, selectors
│   │   ├── wishlist/        # saved tours
│   │   └── booking/         # bookings
│   ├── pages/               # One file per route
│   ├── routes/              # Route definitions
│   ├── utils/               # Helpers (formatting, localStorage)
│   ├── App.jsx
│   ├── main.jsx             # Entry point (Provider + Router)
│   └── index.css            # Tailwind layers + shared classes
├── index.html
├── tailwind.config.js       # Theme: brand colours, fonts
├── postcss.config.js
├── vite.config.js           # "@" alias -> src
└── package.json
```

## Conventions

- Import using the `@` alias: `import Button from '@/components/common/Button'`.
- **One feature = one folder** in `src/features` containing its slice and selectors.
- Components stay presentational; data logic lives in slices/selectors.
- Pages only compose components; they contain no styling primitives of their own.

## Adding a new page

1. Create `src/pages/MyPage.jsx`.
2. Register it in `src/routes/AppRoutes.jsx`.
3. Add a link in `src/constants/index.js` (`NAV_LINKS`) if it should appear in the menu.

## Connecting a real backend

Replace the static data in `src/data/tours.js` with an API call using `createAsyncThunk` inside
`src/features/tours/toursSlice.js`. Set the base URL in `.env` (`VITE_API_BASE_URL`).

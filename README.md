# 🧠 Psychologist Services

A modern web application for browsing, filtering, and booking appointments with professional psychologists.

---

## ✨ Features

- **Home Page** — Welcoming hero section with animated floating elements, company slogan and a CTA link to the Psychologists page
- **Psychologists Page** — Browse all psychologists with sorting options:
  - Alphabetical (A → Z / Z → A)
  - Price (Low → High / High → Low)
  - Popularity / Rating (Low → High / High → Low)
  - Load more pagination (3 cards per page)
- **Favorites Page** — Private page showing psychologists saved by the logged-in user
- **Authentication** — Register & login with email/password via Firebase Auth
- **Appointment Booking** — Modal form to book a session with any psychologist
- **Responsive Design** — Fully responsive from 320px to 1440px+ screens

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Auth & Database | Firebase (Auth + Realtime DB) |
| Forms & Validation | React Hook Form + Yup |
| Styling | CSS Modules |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header/             # Navigation bar with auth controls
│   ├── PsychologistCard/   # Card with read more, favorites & booking
│   ├── FilterDropdown/     # Sorting dropdown
│   ├── AuthModal/          # Login & register modal
│   └── AppointmentModal/   # Appointment booking modal
├── pages/
│   ├── Home/               # Landing page with hero section
│   ├── Psychologists/      # Full list with sorting & pagination
│   └── Favorites/          # User's saved psychologists (private)
├── context/
│   └── FavoritesContext/   # Global favorites state
├── firebase/
│   ├── config.js           # Firebase initialization
│   ├── auth.js             # Auth functions
│   └── database.js         # Database read/write functions
└── data/
    └── psychologists.js    # Local fallback data
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/canberkyildiz25/Psychologist-Services.git
cd Psychologist-Services
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

- Go to [Firebase Console](https://console.firebase.google.com) and create a project
- Enable **Email/Password** authentication
- Create a **Realtime Database** (Test mode)
- Import `psychologists.json` to the database root
- Copy your Firebase config keys

### 4. Configure environment variables

Create a `.env` file in the project root (use `.env.example` as a template):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Set Firebase Database Rules

In Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "psychologists": {
      ".read": true,
      ".write": false
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder. Deploy to **Netlify**, **Vercel**, or any static host.

> **Note:** Add your `.env` variables to your hosting platform's environment settings before deploying.

---

## 🔒 Security

- `.env` is in `.gitignore` — Firebase keys are never committed to git
- Firebase Rules restrict user data to authenticated owners only
- Psychologist data is publicly readable but not writable from the client

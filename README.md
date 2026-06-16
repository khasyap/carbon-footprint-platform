# EcoCarbon | Carbon Footprint Tracker

EcoCarbon is a smart, dynamic personal carbon footprint manager designed to help individuals monitor, understand, and reduce their daily environmental impact. Built with a full-stack JavaScript architecture, it connects carbon calculators with personalized AI recommendations and gamification mechanics.

---

## 1. Chosen Vertical & Focus
- **Vertical**: Climate Action & Personal Sustainability
- **Target Persona**: Individuals looking to build eco-friendly habits and audit their carbon footprint through quantitative logs and qualitative AI coaching.

---

## 2. Approach & Core Logic

### A. Carbon Calculator Math
Emissions are calculated in real-time on the client and logged securely in the database using standard conversion parameters (expressed in kg CO₂):
- **Transport**:
  - `Car`: 0.20 kg CO₂ per km
  - `Motorcycle`: 0.10 kg CO₂ per km
  - `Public Transport`: 0.05 kg CO₂ per km
  - `Bike` / `Walk`: 0.00 kg CO₂ per km
- **Home Energy (Electricity)**: 0.85 kg CO₂ per kWh
- **Food Habits**:
  - `Meat Heavy`: 3.0 kg CO₂ per log
  - `Balanced`: 1.5 kg CO₂ per log
  - `Vegetarian`: 0.7 kg CO₂ per log
  - `Vegan`: 0.4 kg CO₂ per log
- **Waste generated**: 0.50 kg CO₂ per kg of waste

### B. AI Sustainability Coach (Gemini 2.5 Flash)
- Analyzes user's historical emissions (grouped by transport, energy, food, waste).
- Prompts Gemini to return a structured JSON mapping:
  - 3-4 specific actionable recommendations.
  - Difficulty ratings (Easy, Medium, Hard).
  - Target savings metrics (kg CO₂ reduction per month).
  - Encouraging coaching summaries.
- Features a safe mock fallback if no API key is specified.

### C. Gamification & Budgets
- **Green Points**: Earned when logging low carbon activities and completing challenges (e.g. +10 points for a log, +15 for green transport, +100 for joining/completing "No Plastic Week").
- **Badges**: Awarded dynamically at points milestones:
  - 🌱 *Green Beginner* (1 point)
  - 📉 *Carbon Saver* (105 points)
  - 🛡️ *Eco Warrior* (500 points)
  - 🏆 *Sustainability Champion* (1000 points)
- **Carbon Budgets**: Allow users to configure target budget emission ceilings, calculating actual consumed ratios dynamically from records.

---

## 3. Alignment with Core Evaluation Criteria (High-Impact Areas)

### 🌟 Smart, Dynamic Assistant & User Context Decision Making
* **Context-Aware Analytics**: The AI Coach analyzes the user's latest 10 emission records. If the user's transport emissions are high, Gemini prioritizes transit modifications. If food values are high, it shifts focus to plant-based diets.
* **Structured Response Contracts**: Express backend requests a strict JSON schema contract from Gemini 2.5 Flash, allowing the frontend to render recommendations dynamically in individual graphic tiles with specific difficulty tags and offset calculators instead of dumping unformatted text blocks.

### 💻 Code Quality (Readability & Structure)
* **MVC & Modular Segregation**: Separates routing controllers, database Mongoose model schemas, configuration connectors, and calculator utilities in the backend.
* **Component Reusability**: Frontend uses custom React hooks (`useCarbon`, `useGoals`) to manage API integration state separately from UI components, keeping views clean and readable.

### 🔒 Security (Safe & Responsible Implementation)
* **Password Hashing**: Uses `bcryptjs` with pre-save hooks on the `User` schema.
* **JWT Request Protection**: Protected API endpoints enforce JWT verification middleware.
* **Credential Safe Guarding**: Excluded `.env` keys from repositories using `.gitignore` to maintain strict secrets safety.

### ⚡ Efficiency (Resource Optimization)
* **React Fast Refresh Fixes**: Watches primitive inputs individually in the calculator form (`watch('transportType')`) instead of returning a new object reference on every keystroke, which eliminates infinite re-render cycles.
* **Database Aggregation**: Compiles monthly summaries using Mongoose aggregation pipelines (`CarbonRecord.aggregate`) rather than sorting and aggregating arrays in Node server memory.

### ♿ Accessibility & Universal Design
* **HTML5 Semantic Outlines**: Built layouts using `<main>`, `<header>`, `<aside>`, `<nav>`, `<table>`, `<form>`, `<label>` tags.
* **Responsive Visual Scopes**: Handled text wrapping, dark mode background variables, flex grids, and scrollbars for multiple screen widths.

---

## 4. Tech Stack & Repository Layout

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Recharts (Charts), Axios, React Hook Form
- **Backend**: Node.js, Express.js, Mongoose (MongoDB Atlas)
- **AI Service**: Gemini 2.5 Flash API

```
carbon-footprint-platform/
├── frontend/             # Next.js 15 Client React Application
│   ├── src/
│   │   ├── app/          # App Router Pages (login, dashboard, calculator, goals, etc)
│   │   ├── components/   # UI elements (charts, navbar, sidebar, loader)
│   │   ├── context/      # AuthContext session provider
│   │   └── services/     # Axios API request clients
├── backend/              # Node/Express API Server
│   ├── src/
│   │   ├── config/       # Mongoose & Gemini clients
│   │   ├── controllers/  # Route event handlers
│   │   ├── models/       # Schemas (User, Activity, Goal, Challenge)
│   │   └── services/     # Gemini and Carbon calculators
```

---

## 5. How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (default fallback: `mongodb://127.0.0.1:27017/carbon_footprint`)

### Backend Setup
1. Navigate to `backend/` and write a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
2. Install dependencies and start:
   ```bash
   npm install
   npm run start
   ```

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

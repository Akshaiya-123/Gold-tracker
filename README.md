# Gold & Silver Tracker (India) – Frontend 🥇🥈

A production-quality fintech web application for tracking live gold and silver prices across India, monitoring intraday price fluctuations, visualizing historical market movements, and managing automated price alerts via Email and SMS.

This repository is the **dedicated Frontend Application** built with Next.js (React.js), Tailwind CSS, and custom financial UI components.

---

## 🏛️ Project Structure

```
gold-tracker/
├── .env.example                     # Environment variables template
├── .env.local                       # Local frontend environment configuration
├── package.json                     # Frontend dependencies & Next.js scripts
├── README.md                        # Project documentation
│
└── src/                             # Next.js Frontend Application
    ├── app/
    │   ├── globals.css              # Fintech color tokens, gradients & custom scrollbars
    │   ├── layout.js                # Root layout with ToastProvider & Meta tags
    │   └── page.js                  # Main dashboard state & application orchestrator
    ├── components/
    │   ├── icons.jsx                # Reusable stroke-based SVG icons
    │   ├── ui/                      # Primitive UI components
    │   │   ├── Badge.jsx            # Status & commodity badges
    │   │   ├── Button.jsx           # Primary navy, gold accent, outline & danger buttons
    │   │   ├── Card.jsx             # Fintech card containers
    │   │   ├── Modal.jsx            # Accessible dialogs with Escape & backdrop
    │   │   ├── Skeleton.jsx         # Loading skeletons
    │   │   └── Toast.jsx            # Global toast notifications context
    │   ├── layout/                  # Main layout components
    │   │   ├── Header.jsx           # Top navbar with live time, unread popover & user pill
    │   │   ├── Sidebar.jsx          # Desktop sidebar & mobile navigation drawer
    │   │   └── Footer.jsx           # Regulatory & IBJA benchmark source attribution
    │   ├── dashboard/               # Main dashboard widgets
    │   │   ├── PriceCard.jsx        # 24K, 22K, 18K Gold & Silver cards
    │   │   ├── InteractiveChart.jsx # Multi-timeframe SVG area charts with crosshair
    │   │   ├── MarketSummary.jsx    # Open, High, Low, Current & Intraday range
    │   │   ├── RecentAlertsCard.jsx # Triggered alerts preview
    │   │   └── JewelleryCalculator.jsx # Weight, making charge % & 3% GST breakdown
    │   ├── alerts/                  # Price alert management
    │   │   ├── AlertList.jsx        # Active/Triggered filters, toggle & delete modal
    │   │   └── AlertModal.jsx       # Alert creation form with validation
    │   ├── notifications/           # Notification center
    │   │   ├── NotificationList.jsx # Dispatched alerts log with delivery status
    │   │   └── TestNotificationModal.jsx # Test SMS/Email dispatch simulator
    │   ├── history/                 # Historical price tracking
    │   │   └── PriceHistoryTable.jsx# Tabular view with filters & CSV export
    │   ├── watchlist/               # Purchase goal targets
    │   │   └── WatchlistView.jsx    # Target buying prices for jewellery & bars
    │   ├── settings/                # User & system preferences
    │   │   └── SettingsView.jsx     # Channels, sensitivity & polling rates
    │   └── profile/                 # User credentials
    │       └── ProfileView.jsx      # Name, phone, email & password update
    └── lib/                         # Application utilities & data layer
        ├── api.js                   # Unified backend API & resilient storage client
        ├── constants.js             # IBJA benchmarks, purity factors & INR formatters
        ├── mockData.js              # Realistic market data & historical curves
        └── storage.js               # Browser local storage persistence
```

---

## ✨ Features

1. **Live Bullion Dashboard**:
   - 24K, 22K, 18K Gold prices per gram.
   - 999 Fine Silver prices per gram, 10 grams (Tola), and kilogram.
   - Price change, percentage diff, and up/down movement indicators.
2. **Interactive Price Charts**:
   - 24-hour, 7-day, 30-day, 6-month, and 1-year views.
   - Interactive SVG crosshair, area gradients, and tooltip data.
3. **Smart Price Alerts**:
   - Create, edit, toggle, and delete price alerts (Gold / Silver, Purity, Above / Below condition, Target price).
   - Email and SMS channel selections.
   - Single-click reactivation for triggered alerts.
4. **Smart Notification Center**:
   - In-app notification center, unread counters, mark as read, and instant test notification modal.
5. **Consumer Tools & Indian Bullion Utility**:
   - Jewellery purchase cost calculator (weight in grams + customizable making charge % + 3% GST breakdown).
   - Personal Bullion Watchlist for target jewellery and coin purchases.
   - Price History table with one-click **Export to CSV**.
6. **Settings & Profile**:
   - Notification channel preferences, polling interval selector, DLT compliance info, and user profile management.

---

## 🚀 Running the Frontend

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔌 Connecting to Backend API

By default, the frontend seamlessly runs with self-contained client state (`localStorage`) so everything is fully interactive right away.

When you run your separate backend server on port 5000:
- The frontend will automatically detect and connect to `http://localhost:5000/api`.
- You can customize the backend URL in `.env.local` using:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  ```

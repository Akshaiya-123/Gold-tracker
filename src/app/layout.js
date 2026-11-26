import "./globals.css";
import { ToastProvider } from "../components/ui/Toast";

export const metadata = {
  title: "Gold & Silver Tracker | Live India Bullion Rates & Smart Alerts",
  description:
    "Track 24K, 22K, 18K gold and silver prices in India, monitor price changes, view interactive charts, and receive instant email and SMS price alerts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

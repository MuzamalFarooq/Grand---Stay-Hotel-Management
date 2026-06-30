import { BookingProvider } from "@/context/BookingContext";
import { StaffProvider } from "@/context/StaffContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Grand Stay | Premium Luxury Hotel & Suites",
  description: "Experience absolute luxury and comfort. Book your elite stay at Grand Stay Hotel.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <BookingProvider>
          <StaffProvider>
            <CustomerProvider>
              {children}
            </CustomerProvider>
          </StaffProvider>
        </BookingProvider>
      </body>
    </html>
  );
}

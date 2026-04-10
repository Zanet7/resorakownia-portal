import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Resorakownia",
  description: "Sklep, aukcje i społeczność kolekcjonerów modeli aut",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

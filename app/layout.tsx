import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Resorakownia",
  description: "Sklep, aukcje i społeczność kolekcjonerów modeli aut",
};

import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true, role: true }
    });
  }

  return (
    <html lang="pl">
      <body>
        <CartProvider>
          <Navbar username={dbUser?.username} isAdmin={dbUser?.role === 'ADMIN'} />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
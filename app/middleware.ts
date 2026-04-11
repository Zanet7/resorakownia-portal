import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function middleware(req: any) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (!data.user && isAdminRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes - all routes except public ones
const isProtectedRoute = createRouteMatcher([
  "/notes",          // Protect the main notes page
  "/notes/new",      // Protect note creation
  "/api/:path*",     // Protect API routes
]);

// Define public routes that should be accessible without auth
const isPublicRoute = createRouteMatcher([
  "/",               // Landing page
  "/notes/:id",      // Shared note pages
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = auth();
  const path = req.nextUrl.pathname;

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is protected, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Allow access for authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
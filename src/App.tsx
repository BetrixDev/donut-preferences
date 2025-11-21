import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { DonutTracker } from "./DonutTracker";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-orange-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍩</span>
          <h2 className="text-xl font-semibold text-pink-600">Donut Tracker</h2>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 p-4">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            🍩 Donut Preferences
          </h1>
          <p className="text-lg text-gray-600">
            Keep track of your friends' favorite donuts!
          </p>
        </div>
        <DonutTracker />
      </Authenticated>

      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-pink-600 mb-4">
              🍩 Donut Preferences
            </h1>
            <p className="text-xl text-gray-600">
              Sign in to keep track of your friends' donut preferences
            </p>
          </div>
          <div className="w-full max-w-md">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}

import { useState } from "react";
import { LoginView } from "./LoginView";
import { RegisterView } from "./RegisterView";
import { HeroSection } from "./HeroSection";
import { StepsInfographic } from "./StepsInfographic";
import { Footer } from "./Footer";

export function AuthScreen() {
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-green-50/30">
      {/* Hero Section */}
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <HeroSection 
          isAuthenticated={false}
          onRegisterClick={() => setCurrentView("register")}
        />
        
        <StepsInfographic />
      </div>

      {/* Auth Forms */}
      {currentView === "login" ? (
        <LoginView onSwitchToRegister={() => setCurrentView("register")} />
      ) : (
        <RegisterView onSwitchToLogin={() => setCurrentView("login")} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import ThemeCustomSettings from "./theme/CustomSettings.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { GoogleAuthProvider } from "./contexts/GoogleAuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignalRProvider } from "./contexts/SIgnalRContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SignalRProvider>
          <GoogleAuthProvider>
            <ThemeCustomSettings>
              <App />
            </ThemeCustomSettings>
          </GoogleAuthProvider>
        </SignalRProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

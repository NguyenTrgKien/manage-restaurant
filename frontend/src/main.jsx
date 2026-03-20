import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router";
import { FoodProvider } from "./contexts/FoodContext.jsx";
import AuthProvider from "./contexts/authContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Bounce, ToastContainer } from "react-toastify";

const clientId =
  "703456349605-e44j1qhdbscl8u8j56tq52kkimq4ch5i.apps.googleusercontent.com";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={clientId}>
          <FoodProvider>
            <Router>
              <App />
            </Router>
          </FoodProvider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);

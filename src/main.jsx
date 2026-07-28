import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import {NotificationProvider} from "./context/NotificationContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {ThemeProvider} from "next-themes";

createRoot(document.getElementById('root')).render(
  <StrictMode>

          <BrowserRouter>
              <ThemeProvider>
                  <AuthProvider>
                      <NotificationProvider>
                          <App />
                      </NotificationProvider>
                  </AuthProvider>
              </ThemeProvider>
          </BrowserRouter>

  </StrictMode>,
)

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RealWinnersForm, UnitedVoicesForm ,FAQForm, SettingForm ,OurStoryForm ,ContactForm ,UserForm ,WayCardsForm} from "./forms";
import {BannerForm, ServicesForm} from "./forms";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/forgotpassword"
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/forgotpassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              {/* Placeholder routes for content pages */}
              <Route
                path="/content/services/:id"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ServicesForm />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                 <Route
                path="/content/real-winners"
                element={
                  <ProtectedRoute>
                      <DashboardLayout>
                 <RealWinnersForm/>
                      </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                    <ContactForm />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                 <Route
                path="/content/united-voices"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <UnitedVoicesForm />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content/faqs"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <FAQForm />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SettingForm />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                  <Route
                  path="/content/banner"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <BannerForm />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/content/our-story"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <OurStoryForm />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/content/users"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <UserForm />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/content/users"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <UserForm />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/content/Old"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                       <WayCardsForm/>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/forgotpassword"
                  element={
                    <ProtectedRoute>
                   
                       <ForgotPassword/>
                    
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/otp"
                  element={
                    <ProtectedRoute>
                     
                      <VerifyOTP/>
                    
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="/resetpassword"
                  element={
                    <ProtectedRoute>
                     
                      <ResetPassword/>
                    
                    </ProtectedRoute>
                  }
                />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";  // # Importing a toast notification component (custom UI)
import { Toaster as Sonner } from "@/components/ui/sonner";  // # Importing another toaster component and renaming it as "Sonner"
import { TooltipProvider } from "@/components/ui/tooltip";  // # Tooltip context provider for enabling tooltips throughout the app
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";  // # Importing React Query client and its provider for server state management
import { BrowserRouter, Routes, Route } from "react-router-dom";  // # React Router for navigation and routing in SPA (Single Page Applications)
import Index from "./pages/Index";  // # Importing the homepage component
import NotFound from "./pages/NotFound";  // # Importing a 404 Not Found page component

const queryClient = new QueryClient();  // # Creating a new instance of QueryClient to manage data fetching and caching

const App = () => (  // # Defining the main App component using arrow function
  <QueryClientProvider client={queryClient}>  // # Wrapping the app with QueryClientProvider to enable React Query features
    <TooltipProvider>  // # Enabling tooltip context globally within the app
      <Toaster />  // # Render the default toast notifications
      <Sonner />  // # Render the alternate toast notification system (Sonner)
      <BrowserRouter>  // # Wrapping the app with BrowserRouter for navigation
        <Routes>  // # Defining application routes
          <Route path="/" element={<Index />} />  // # Root route renders the Index component
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}  // # Reminder comment for developers to add custom routes above the wildcard route
          <Route path="*" element={<NotFound />} />  // # Wildcard route for handling 404 (page not found)
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;  // # Exporting the App component as default to be used in the main entry file (e.g., main.jsx or index.js)

// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import UserPortal from './components/UserPortal';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      {/* Toaster: handles all the 'toast' calls. 
        'richColors' enables the success/error/warning color themes.
        'expand' shows multiple toasts stacked elegantly.
      */}
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        toastOptions={{
          style: {
            borderRadius: '20px',
            padding: '16px',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
      
      <div className="antialiased text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Routes>
          {/* Main Onboarding Page */}
          <Route path="/" element={<UserPortal />} />

          {/* Hidden Admin Dashboard */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Fallback for 404s - Styled to match your portal */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 text-center">
                <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
                <p className="text-slate-500 font-medium">This page has vanished.</p>
                <a 
                  href="/" 
                  className="mt-6 inline-block text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                  Return to safety
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
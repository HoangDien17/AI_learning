import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Matchmaker &mdash; Powered by AI</p>
      </footer>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          duration: 4000,
          style: { borderRadius: '12px', padding: '12px 16px' },
        }}
      />
    </div>
  );
}

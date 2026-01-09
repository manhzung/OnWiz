/**
 * Main layout component
 * Wraps pages with header and footer
 */

import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto py-12 px-6 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

  
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'कृषिरक्षक AI - KrishiRakshak AI | किसान का डिजिटल साथी',
  description: 'अपने खेत की बेहतर समझ, सही समय पर सही सलाह। फसल की फोटो से रोग पहचान, सटीक मौसम और सरल कृषि सलाह।',
  keywords: ['कृषि सलाह', 'फसल रोग', 'किसान', 'मौसम', 'farming advice', 'crop diagnosis', 'KrishiRakshak AI'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#15803d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-stone-900 selection:bg-emerald-200">
        <LanguageProvider>
          <Header />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-32 md:pb-12">
            {children}
          </main>
          <footer className="hidden md:block bg-stone-100 border-t border-stone-200 py-6 text-center text-xs text-stone-500">
            <p className="font-medium text-stone-700">
              कृषिरक्षक AI (KrishiRakshak AI) — अपने खेत की बेहतर समझ, सही समय पर सही सलाह।
            </p>
            <p className="mt-1">
              भारतीय किसानों के लिए समर्पित सरल व भरोसेमंद कृषि सलाहकार मंच।
            </p>
          </footer>
          <MobileNav />
        </LanguageProvider>
      </body>
    </html>
  );
}

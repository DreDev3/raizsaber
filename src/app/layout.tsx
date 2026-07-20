import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { ptBR } from '@clerk/localizations';
import { ClientProviders } from '@/components/shared/client-providers';
import { setDefaultOptions } from 'date-fns';
import { ptBR as dateFnsPtBR } from 'date-fns/locale';

import '@/styles/globals.css';
import '@/styles/clerk.css';

setDefaultOptions({ locale: dateFnsPtBR });

const nunito = Nunito({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | RAIZSABER',
    default: 'RAIZSABER'
  },
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang='pt-BR' suppressHydrationWarning>
        <body
          className={cn(nunito.variable, 'antialiased font-sans')}
        >
          <ClientProviders>
            {children}
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}

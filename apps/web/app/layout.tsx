import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'LostInVirtual | The Digital Frontier',
  description: 'Claim your identity in the digital frontier. LostInVirtual is the premium community platform for digital citizens.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

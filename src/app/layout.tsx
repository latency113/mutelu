import type { Metadata } from 'next';
import { Prompt, Cinzel } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
  display: 'swap',
});

const cinzel = Cinzel({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'มูเตลู ทาโรต์ (Mutelu Tarot) | ดูดวงไพ่ยิปซี 3 ใบ แม่หมอ AI',
  description:
    'เว็บดูดวงสไตล์สายมูเตลู เปิดไพ่ยิปซี 3 ใบ อดีต ปัจจุบัน อนาคต พร้อมคำทำนายและแนวทางเสริมดวงชะตาจากแม่หมอ AI (Gemini 3.1 Flash Lite)',
  keywords: [
    'ดูดวง',
    'ไพ่ยิปซี',
    'ไพ่ทาโรต์',
    'มูเตลู',
    'แม่หมอ AI',
    'ทำนายดวงชะตา',
    'Gemini AI',
    'ดวงความรัก',
    'ดวงการงาน',
    'ดวงการเงิน',
  ],
  authors: [{ name: 'Mutelu Tarot Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${prompt.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#080414] text-[#f3f0ff]">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import ClickSpark from '@/components/ClickSpark';
import SideBar from '@/components/SideBar';

import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Digital Life',
  description: 'A Autonomous Muti-Agent for Life Survival',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // 1. Body 设置为全屏无滚动，作为背景底板
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen w-screen items-center justify-center overflow-hidden bg-black antialiased`}
      >
        <div className="items-center">
          <ClickSpark
            sparkColor="#DA6259"
            sparkSize={15}
            sparkRadius={20}
            sparkCount={10}
            duration={400}
          >
            {/* 2. 主容器：深色圆角卡片，悬浮在中间 */}
            <div className="flex h-[94vh] w-[96vw] items-center overflow-hidden rounded-[50px] bg-[#5C2B2E] shadow-2xl">
              <SideBar />

              {/* 4. 主要内容区域：占据剩余空间，内部可滚动 */}
              <main className="flex h-full flex-1 flex-col overflow-hidden">
                <Providers>
                  <div className="h-full w-full overflow-y-auto p-6">
                    {children}
                  </div>
                </Providers>
              </main>
            </div>
          </ClickSpark>
        </div>
      </body>
    </html>
  );
}

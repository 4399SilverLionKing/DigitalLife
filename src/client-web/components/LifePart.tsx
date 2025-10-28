'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import ElectricBorder from './ElectricBorder';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
};
const TARGET_TIMESTAMP = new Date('2025-12-31T23:59:59').getTime();
const calculateTimeLeft = (): TimeLeft => {
  const diffMs = Math.max(TARGET_TIMESTAMP - Date.now(), 0);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
};
const formatNumber = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--';
  }
  return value.toString();
};

export default function LifePart() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(calculateTimeLeft());
    tick();

    const timerId = window.setInterval(tick, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const dayValue = formatNumber(timeLeft?.days);
  const hourValue = formatNumber(timeLeft?.hours);
  const minuteValue = formatNumber(timeLeft?.minutes);
  const secondValue = formatNumber(timeLeft?.seconds);

  return (
    // 1. 主容器:
    <section className="font-handwritten relative isolate mx-auto flex h-[350px] w-full flex-row items-center justify-between gap-10 rounded-[40px] bg-gradient-to-tr from-[#C47163] to-[#ac3e38] p-8 text-white/90">
      {/* 左侧: 倒计时区域 */}
      {/* 添加 z-10 确保它在背景之上，如果需要的话 */}
      <div className="z-10 mx-20 flex flex-col items-center justify-center gap-8">
        <ElectricBorder
          color="#E1E77B"
          speed={1}
          chaos={0.5}
          thickness={6}
          style={{ borderRadius: 1000 }}
          className="flex h-40 w-40 items-center justify-center rounded-full"
        >
          <div className="flex items-baseline">
            <span className="text-6xl">{secondValue}</span>
            <span className="ml-1 text-xl font-bold">s</span>
          </div>
        </ElectricBorder>

        <div className="flex flex-row items-baseline gap-10 text-3xl">
          <div className="flex items-baseline gap-2">
            <span>{dayValue}</span>
            <span className="text-sm font-bold">D</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span>{hourValue}</span>
            <span className="text-sm font-bold">H</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span>{minuteValue}</span>
            <span className="text-sm font-bold">M</span>
          </div>
        </div>
      </div>

      {/* 右侧: 原本放图片的容器现在可以作为一个空白占位符 */}
      <div className="flex-1"></div>

      {/* 2. "破界"的人物图片 */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-[140%] w-auto">
        <Image
          src="/assets/ai.png"
          alt="AI"
          width={600}
          height={600}
          className="h-full w-auto object-contain"
        />
      </div>
    </section>
  );
}

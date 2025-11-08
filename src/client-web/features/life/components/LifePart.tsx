'use client';

import { useEffect, useState, useMemo } from 'react'; // 1. 引入 useMemo
import Image from 'next/image';
import ElectricBorder from '@/common/components/ElectricBorder';
import { useGetLifeStatus } from '../life.hook';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
};

// 辅助函数保持在外部，因为它们不依赖组件内的状态
const formatNumber = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--';
  }
  return value.toString();
};

const calculateTimeLeft = (targetTimestamp: number): TimeLeft => {
    const diffMs = Math.max(targetTimestamp - Date.now(), 0);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds, totalSeconds };
};


export default function LifePart() {
  const { data: status } = useGetLifeStatus();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // 3. 使用 useMemo 计算目标时间戳，仅在 status.lifespan 变化时重新计算
  const targetTimestamp = useMemo(() => {
    if (!status?.lifespan) return null;
    return new Date(status.lifespan).getTime();
  }, [status?.lifespan]);


  useEffect(() => {
    // 4. 只有当目标时间戳有效时才启动计时器
    if (targetTimestamp === null) {
      // 如果没有有效的目标时间，可以重置或清空 timeLeft
      setTimeLeft(null);
      return;
    }

    const tick = () => setTimeLeft(calculateTimeLeft(targetTimestamp));
    
    // 立即执行一次以避免初始延迟
    tick();

    const timerId = window.setInterval(tick, 1000);
    
    // 5. 返回的清理函数会在组件卸载或依赖项变化时执行
    return () => window.clearInterval(timerId);

  // 6. 将 targetTimestamp 加入依赖数组
  }, [targetTimestamp]);

  // 从 timeLeft 中解构值，并进行格式化
  const dayValue = formatNumber(timeLeft?.days);
  const hourValue = formatNumber(timeLeft?.hours);
  const minuteValue = formatNumber(timeLeft?.minutes);
  const secondValue = formatNumber(timeLeft?.seconds);

  return (
    // ... 你的 JSX 保持不变 ...
    <section className="font-handwritten relative isolate mx-auto flex h-[350px] w-full flex-row items-center justify-between gap-10 rounded-[40px] bg-gradient-to-tr from-[#C47163] to-[#ac3e38] p-8 text-white/90">
      {/* 左侧: 倒计时区域 */}
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

      {/* "破界"的人物图片 */}
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
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 1. 导入 usePathname 钩子
import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Brain,
  Home,
  MessageCircle,
  PenSquare,
  Pickaxe,
  UserRound,
} from 'lucide-react';

// 2. 在类型定义中添加 href 属性，并移除 active
type NavItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string; // 添加目标路由
};

type SideBarProps = {
  greeting?: string;
  moodLabel?: string;
  secondsLabel?: string;
  navItems?: NavItem[];
  thoughtsTitle?: string;
  thoughts?: string;
};

// 3. 更新默认数据，为每个项目添加 href 路由地址
const defaultNavItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Overview', href: '/' },
  { id: 'thought', icon: Brain, label: 'Thought', href: '/thought' },
];

export default function SideBar({ navItems = defaultNavItems }: SideBarProps) {
  // 4. 获取当前页面的 pathname
  const pathname = usePathname();

  return (
    <aside className="mr-8 ml-10 flex h-[95%] flex-col items-center justify-between rounded-4xl bg-[#321517] p-4">
      {/* 顶部 Logo 部分 */}
      <div>
        <div className="flex h-12 w-12 items-center justify-center text-white">
          <Bot size={68} />
        </div>
      </div>

      {/* 中间导航图标部分 */}
      <nav className="flex flex-col items-center gap-4">
        {navItems.map(item => {
          // 5. 动态判断当前项是否为激活状态
          const isActive = pathname === item.href;

          return (
            // 6. 将 <button> 替换为 <Link> 组件
            <Link
              key={item.id}
              href={item.href} // 设置链接的目标地址
              aria-label={item.label}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${
                isActive // 使用动态计算的 isActive 状态
                  ? 'bg-[#E84D4D]/80 text-white shadow-lg shadow-red-900/50'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="pointer-events-none absolute top-1/2 left-full hidden translate-x-3 -translate-y-1/2 rounded-md bg-gray-900/90 px-3 py-1 text-xs whitespace-nowrap text-gray-200 shadow-md shadow-black/40 group-hover:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 底部 "添加" 按钮部分 */}
      <div>
        <button
          type="button"
          aria-label="Add Item"
          className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-white/20 text-white/40 transition hover:border-white/50 hover:text-white/80"
        >
          <UserRound className="h-6 w-6" />
        </button>
      </div>
    </aside>
  );
}

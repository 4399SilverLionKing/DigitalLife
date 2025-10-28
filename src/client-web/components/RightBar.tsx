// components/RightSidebar.tsx
import React from 'react';

import { Eye, Heart, MessageCircle, PenSquare, Pickaxe } from 'lucide-react';

import GlassIcons from './GlassIcons';
import type { GlassIconsItem } from './GlassIcons';

// 建议导入类型

const statsData: GlassIconsItem[] = [
  { icon: <Eye />, color: 'blue', label: '8745665' },
  { icon: <Heart />, color: 'red', label: '66546' },
  { icon: <MessageCircle />, color: 'purple', label: '3453' },
];

const toolsData: GlassIconsItem[] = [
  { icon: <Pickaxe />, color: 'indigo', label: '45' },
  { icon: <PenSquare />, label: '4456' },
];

export default function RightSidebar() {
  return (
    // 使用 w-[120px] 或类似固定宽度，以更好地容纳图标
    <aside className="flex w-[100px] flex-col justify-center gap-6">
      {/* 
        顶部统计区:
      */}
      <div className="flex h-3/5 items-center justify-center rounded-4xl bg-[#321517]/80 p-4">
        <GlassIcons items={statsData} className="flex flex-col gap-40" />
      </div>

      {/* 底部工具区，应用相同的布局逻辑 */}
      <div className="flex h-2/5 items-center justify-center rounded-4xl bg-[#321517]/80 p-4">
        <GlassIcons items={toolsData} className="flex flex-col gap-40" />
      </div>
    </aside>
  );
}

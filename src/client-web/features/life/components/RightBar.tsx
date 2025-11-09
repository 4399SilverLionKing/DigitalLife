// components/RightSidebar.tsx
import React from 'react';

import { Eye, Heart, MessageCircle, PenSquare, Pickaxe } from 'lucide-react';

import GlassIcons from '../../../common/components/GlassIcons';
import type { GlassIconsItem } from '../../../common/components/GlassIcons';
import { useGetLifeStatus } from '../life.hook';



export default function RightBar() {
  const { data: status } = useGetLifeStatus();

const statsData: GlassIconsItem[] = [
    { icon: <Eye />,  label: status?.visitors.toString() ?? '-' },
    { icon: <Heart />,  label: status?.likes.toString() ?? '-' },
    { icon: <MessageCircle />, label: status?.comments.toString() ?? '-' },
];

  const toolsData: GlassIconsItem[] = [
    { icon: <Pickaxe />, label: status?.tools.toString() ?? '-' },
    { icon: <PenSquare />, label: status?.creations.toString() ?? '-' },
  ];
  
  return (
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

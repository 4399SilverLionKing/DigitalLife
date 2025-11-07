'use client';

import React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export default function CreationDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <h2 className="w-fit cursor-pointer rounded-2xl p-4 text-xl font-bold text-white transition-all duration-300 hover:bg-white/5 hover:ring-1 hover:ring-white/10">
          AI Creations
        </h2>
      </DrawerTrigger>

      {/* --- Drawer 内容优化 --- */}
      <DrawerContent className="mx-auto flex h-[90vh] w-[95%] flex-col border border-white/20 bg-black/20 text-white backdrop-blur-xl outline-none md:w-[60%]">
        {/* 2. 使用 DrawerHeader 组织标题 */}
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl font-bold text-white">
            AI Creations
          </DrawerTitle>
        </DrawerHeader>

        {/* 3. 创建一个可滚动的内容区域 */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          {/* 在这里放置你的 Drawer 内容 */}
          <p>这里是 Drawer 的具体内容...</p>
          <p>
            当内容变得很长时，这个区域会自动出现滚动条，而标题和拖拽条会保持在原位。
          </p>
          {/* 示例：添加一些长内容来测试滚动 */}
          <div className="mt-8 space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-white/5 p-4">
                示例内容卡片 {i + 1}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

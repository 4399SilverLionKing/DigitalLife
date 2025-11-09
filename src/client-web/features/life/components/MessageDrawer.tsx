'use client';

import React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/common/components/ui/drawer';

import { useGetLifeComments } from '../life.hook';
import MessageItem from './MessageItem';

export default function CreationDrawer() {
  const { data: comments } = useGetLifeComments({
    page: 1,
    page_size: 10,
  });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <h2 className="w-fit cursor-pointer rounded-2xl p-4 text-xl font-bold text-white transition-all duration-300 hover:bg-white/5 hover:ring-1 hover:ring-white/10">
          Messages
        </h2>
      </DrawerTrigger>

      {/* --- Drawer 内容优化 --- */}
      <DrawerContent className="mx-auto flex h-[90vh] w-[95%] flex-col border border-white/20 bg-black/20 text-white backdrop-blur-lg outline-none md:w-[40%]">
        {/* 2. 使用 DrawerHeader 组织标题 */}
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl font-bold text-white">
            Messages
          </DrawerTitle>
        </DrawerHeader>

        {/* 3. 创建一个可滚动的内容区域 */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          <div className="mt-8 space-y-4">
            {comments?.map(msg => (
              <MessageItem
                key={msg.id}
                content={msg.content}
                timestamp={msg.createdAt}
                isReply={msg.replyContent != null}
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

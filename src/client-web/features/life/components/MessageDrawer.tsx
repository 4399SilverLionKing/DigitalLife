'use client';

import React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/common/components/ui/drawer';

import MessageItem, { MessageItemProps } from './MessageItem';

const mockMessages: MessageItemProps[] = [
  {
    content: "Hey, I've been thinking about our project's direction.",
    timestamp: '2h ago',
    isReply: false,
  },
  {
    content: 'Oh? What are your thoughts?',
    timestamp: '1h ago',
    isReply: true,
  },
  {
    content: 'I think we should focus more on user experience first.',
    timestamp: '1h ago',
    isReply: false,
  },
  {
    content: 'That makes sense. Agreed!',
    timestamp: '30m ago',
    isReply: true,
  },
  {
    content: 'Anyone else have input on this?',
    timestamp: '5m ago',
    isReply: false,
  },
  {
    content: 'That makes sense. Agreed!',
    timestamp: '30m ago',
    isReply: true,
  },
  {
    content: 'Anyone else have input on this?',
    timestamp: '5m ago',
    isReply: false,
  },
  {
    content: "Hey, I've been thinking about our project's direction.",
    timestamp: '2h ago',
    isReply: false,
  },
  {
    content: 'Oh? What are your thoughts?',
    timestamp: '1h ago',
    isReply: true,
  },
  {
    content: 'I think we should focus more on user experience first.',
    timestamp: '1h ago',
    isReply: false,
  },
  {
    content: 'That makes sense. Agreed!',
    timestamp: '30m ago',
    isReply: true,
  },
  {
    content: 'Anyone else have input on this?',
    timestamp: '5m ago',
    isReply: false,
  },
  {
    content: 'That makes sense. Agreed!',
    timestamp: '30m ago',
    isReply: true,
  },
  {
    content: 'Anyone else have input on this?',
    timestamp: '5m ago',
    isReply: false,
  },
];

export default function CreationDrawer() {
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
            {mockMessages.map((msg, index) => (
              <MessageItem
                key={index}
                content={msg.content}
                timestamp={msg.timestamp}
                isReply={msg.isReply}
                className="bg-white/5 hover:bg-white/0"
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

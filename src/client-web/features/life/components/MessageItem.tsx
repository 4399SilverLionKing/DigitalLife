import React from 'react';

import { cn } from '@/common/utils/tailwindUtil';

// 导入我们刚刚创建的 cn 函数

export interface MessageItemProps {
  /** 消息内容 */
  content: string;
  /** 消息发布的时间戳 */
  timestamp: string;
  /** 消息是否回复了 */
  isReply: boolean;
  /** 允许父组件传入额外的 className 来覆盖或扩展样式 */
  className?: string;
}

/**
 * 用于显示单条消息的组件。
 * 包含消息内容、时间戳，并能根据是否为回复调整样式。
 * 右上角会显示一个状态指示圈：绿色表示已回复，红色表示未回复。
 */
const MessageItem: React.FC<MessageItemProps> = ({
  content,
  timestamp,
  isReply,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex h-23 cursor-pointer items-center justify-between gap-4 rounded-4xl bg-[#321517] p-3 text-white transition-colors hover:bg-white/5',
        className
      )}
    >
      {/* 状态指示圈：绝对定位在右上角 */}
      <div
        className={cn(
          'absolute top-0 right-0 h-5 w-5 rounded-full',
          isReply ? 'bg-[#90BB73]' : 'bg-[#AF4843]'
        )}
      />

      {/* 消息内容：占据大部分空间 */}
      <p className="ml-5 flex-grow truncate text-gray-200">{content}</p>

      {/* 时间戳：不收缩，保持固定大小 */}
      <span className="flex-shrink-0 text-xs text-gray-400">{timestamp}</span>
    </div>
  );
};

export default MessageItem;

import { MessageCirclePlus } from 'lucide-react';

import MessageItem, { MessageItemProps } from './MessageItem';

// 模拟从 API 获取的消息数据
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
    content: 'That makes sense. Agreed!',
    timestamp: '30m ago',
    isReply: true,
  },
];

export default function MessagePart() {
  return (
    <div className="flex flex-grow flex-col">
      {/* 顶部标题和按钮 */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Messages</h2>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors">
          <MessageCirclePlus size={32} />
        </button>
      </div>

      {/* 消息列表容器 */}
      <div className="flex h-full flex-grow flex-col gap-3 overflow-auto rounded-2xl p-4">
        {/* 使用 map 渲染消息列表 */}
        {mockMessages.map((msg, index) => (
          <MessageItem
            key={index} // 在列表中，key 是必须的
            content={msg.content}
            timestamp={msg.timestamp}
            isReply={msg.isReply}
          />
        ))}
      </div>
    </div>
  );
}

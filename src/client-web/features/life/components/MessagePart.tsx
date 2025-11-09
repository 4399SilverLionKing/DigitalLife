import { useGetLifeComments } from '../life.hook';
import MessageItem from './MessageItem';

export default function MessagePart() {
  const { data: comments } = useGetLifeComments({
    page: 1,
    page_size: 10,
  });

  return (
    <div className="flex flex-grow flex-col">
      {/* 消息列表容器 */}
      <div className="flex h-full flex-grow flex-col gap-3 overflow-auto rounded-2xl p-4">
        {/* 使用 map 渲染消息列表 */}
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
  );
}

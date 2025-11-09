'use client';

import { useState } from 'react';

import { MessageCirclePlus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/common/components/ui/dialog';

import { usePostLifeComment } from '../life.hook';
import { PostLifeCommentPayload } from '../life.type';

export default function MessagePlus() {
  const postCommentMutation = usePostLifeComment();

  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) {
      alert('Message cannot be empty.');
      return;
    }

    const payload: PostLifeCommentPayload = {
      content: message,
    };

    postCommentMutation.mutate(payload, {
      onSuccess: () => {
        setMessage(''); // 清空输入框
        setIsOpen(false); // 关闭弹窗
      },
      onError: error => {
        console.error('Failed to post comment:', error);
        alert('Something went wrong. Please try again.');
      },
    });
  };

  return (
    // 将 Dialog 的开关状态与 state 绑定
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white">
          <MessageCirclePlus size={32} />
        </button>
      </DialogTrigger>

      <DialogContent className="border border-white/20 bg-black/20 text-white shadow-lg backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Leave a Message</DialogTitle>
          <DialogDescription className="text-gray-300">
            Your message will be displayed here after review.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <textarea
              id="message"
              placeholder="Type your message here."
              className="no-scrollbar col-span-4 h-30 resize-none rounded-md border border-gray-600 p-2 text-white focus:ring-2 focus:ring-[#8a8b8b] focus:outline-none"
              // 6. 将 textarea 与 state 绑定
              value={message}
              onChange={e => setMessage(e.target.value)}
              // 在提交过程中禁用输入框，防止用户重复编辑
              disabled={postCommentMutation.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="submit"
            className="cursor-pointer rounded-md px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            // 7. 将处理函数绑定到 onClick
            onClick={handleSubmit}
            // 8. 根据 mutation 的加载状态来提供用户反馈
            disabled={postCommentMutation.isPending}
          >
            {postCommentMutation.isPending ? 'Sending...' : 'Send'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

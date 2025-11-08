'use client';

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

export default function MessagePlus() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* 这是触发弹窗的按钮 */}
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white">
          <MessageCirclePlus size={32} />
        </button>
      </DialogTrigger>

      {/* 这是弹窗的内容*/}
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
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="submit"
            className="cursor-pointer rounded-md px-4 py-2 text-white transition-colors"
          >
            Send
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

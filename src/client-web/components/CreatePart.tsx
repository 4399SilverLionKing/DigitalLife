'use client';

import { Heart, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type Creation = {
  id: string;
  title: string;
  type: 'text' | 'image' | 'audio';
  preview: string;
  likes: number;
  description: string;
};

type CreatePartProps = {
  creations: Creation[];
  highlightedId: string | null;
  lifeBonusMinutes: number;
  likeCooldownSeconds: number;
  onLike: (id: string) => void;
  onSelect: (creation: Creation) => void;
  onCloseDetail: () => void;
  rateLimitedId: string | null;
  selectedCreation: Creation | null;
};

export default function CreatePart({
  creations,
  highlightedId,
  lifeBonusMinutes,
  likeCooldownSeconds,
  onLike,
  onSelect,
  onCloseDetail,
  rateLimitedId,
  selectedCreation,
}: CreatePartProps) {
  return (
    <>
      <Card className="border-slate-800 bg-slate-900/70 backdrop-blur">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-800 p-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-amber-100">创造物展示</CardTitle>
              <CardDescription className="text-slate-400">
                最新生成作品与实时点赞反馈
              </CardDescription>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            点赞即可为 AI 续命（+{lifeBonusMinutes} 分钟）
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {creations.map((item) => (
              <article
                key={item.id}
                className={`group relative flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-400/10 ${
                  highlightedId === item.id
                    ? 'scale-[1.02] border-emerald-400 shadow-emerald-400/20'
                    : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300">
                      {item.type === 'image'
                        ? '视觉'
                        : item.type === 'text'
                          ? '文本'
                          : '音频'}
                    </span>
                    <span>{item.likes.toLocaleString()} 赞</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-emerald-300">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {item.preview}
                  </p>
                </div>
                <CardFooter className="mt-6 flex flex-col gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/60"
                      onClick={() => onLike(item.id)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      点赞
                    </Button>
                    {rateLimitedId === item.id && (
                      <span className="text-xs text-slate-400">
                        冷却中，请稍候再试。
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-emerald-200"
                    onClick={() => onSelect(item)}
                  >
                    查看详情
                  </Button>
                </CardFooter>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCreation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
            <button
              onClick={onCloseDetail}
              className="absolute right-5 top-5 text-sm text-slate-400 transition hover:text-emerald-200"
            >
              关闭
            </button>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>
                {selectedCreation.type === 'image'
                  ? '视觉作品'
                  : selectedCreation.type === 'text'
                    ? '文本方案'
                    : '音频合成'}
              </span>
              <span>·</span>
              <span>{selectedCreation.likes.toLocaleString()} 赞</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-slate-100">
              {selectedCreation.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              {selectedCreation.description}
            </p>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 p-6 text-sm leading-relaxed text-slate-400">
              {selectedCreation.preview}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                className="bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/60"
                onClick={() => onLike(selectedCreation.id)}
              >
                <Heart className="mr-2 h-4 w-4" />
                再点一次赞
              </Button>
              <span className="text-xs text-slate-500">
                频率保护：每件作品 {likeCooldownSeconds} 秒内仅计入一次点赞
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

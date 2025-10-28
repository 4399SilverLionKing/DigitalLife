'use client';

import { Image, ToolCase } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type ToolInfo = {
  id: string;
  name: string;
  description: string;
  category: '原生工具' | '自创工具';
};

type ToolsPartProps = {
  tools: ToolInfo[];
};

export default function ToolsPart({ tools }: ToolsPartProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-800 p-2">
            <ToolCase className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-lg">工具库</CardTitle>
            <CardDescription className="text-slate-400">
              当前可调用的核心能力与自创扩展
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    tool.category === '原生工具'
                      ? 'bg-sky-500/10 text-sky-300'
                      : 'bg-violet-500/10 text-violet-300'
                  }`}
                >
                  {tool.category}
                </span>
                <Image className="h-4 w-4 text-slate-500" />
              </div>
              <h4 className="mt-3 text-base font-semibold text-slate-100">
                {tool.name}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

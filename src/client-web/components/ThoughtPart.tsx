'use client';

import { Brain } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type AgentLog = {
  id: string;
  agent: string;
  role: '主控' | '分析师' | '执行者';
  message: string;
  time: string;
};

type MindPartProps = {
  logs: AgentLog[];
};

export default function MindPart({ logs }: MindPartProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-800 p-2">
            <Brain className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <CardTitle className="text-lg">思维直播</CardTitle>
            <CardDescription className="text-slate-400">
              多智能体协作对话，持续滚动记录
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
          {logs.map(log => (
            <div
              key={log.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span className="font-medium text-slate-200">{log.agent}</span>
                <span>{log.time}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {log.message}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

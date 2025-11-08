// ThoughtItem.tsx
import React from 'react';

// 为组件的 props 定义 TypeScript 接口
export interface ThoughtItemProps {
  /** 思考的角色或视角，例如 "用户"、"开发者" */
  role: string;
  /** 具体的思考内容 */
  content: string;
  /** 思考记录的时间 */
  timestamp?: string;
}

/**
 * 用于展示单条“思考”记录的组件。
 * 包含思考角色、内容和时间戳，并采用优雅的渐变背景。
 */
const ThoughtItem: React.FC<ThoughtItemProps> = ({
  role,
  content,
  timestamp,
}) => {
  return (
    // 主容器：纵向 flex 布局，应用从左下到右上的渐变背景
    <div className="flex h-full flex-col gap-2 rounded-2xl bg-gradient-to-tr from-[#80353D] to-[#B65149] p-4 text-white/90 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-black/30 hover:brightness-105">
      {/* 顶部元信息区域：横向 flex 布局，放置角色和时间 */}
      <header className="flex items-center justify-between">
        {/* 思考角色：设计成一个标签样式，更醒目 */}
        <span className="rounded-md bg-black/20 px-2.5 py-1 text-sm font-semibold text-white/80">
          {role}
        </span>

        {/* 时间戳：使用较浅的颜色，作为辅助信息 */}
        {timestamp && (
          <span className="text-xs text-white/60">{timestamp}</span>
        )}
      </header>

      {/* 思考内容区域 */}
      <div className="mt-1">
        <p className="text-base leading-relaxed text-white/90">{content}</p>
      </div>
    </div>
  );
};

export default ThoughtItem;

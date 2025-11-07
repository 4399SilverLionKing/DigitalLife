import React from 'react';

import ThoughtItem from '@/components/ThoughtItem';

const thoughtsData = [
  {
    role: '开发者',
    content:
      '组件化架构非常清晰，但数据获取逻辑需要优化。可以考虑使用 React Query 来处理缓存和状态同步，减少重复请求。',
    timestamp: '2小时前',
  },
  {
    role: '设计师',
    content:
      '当前的色彩方案很棒，但某些文本元素的对比度偏低。建议进行一次可访问性检查，确保符合 WCAG AA 标准。',
    timestamp: '昨天',
  },
  {
    role: '用户',
    content:
      '界面很清爽，我很喜欢！如果能在设置里增加一个“深色模式”的选项就更完美了。',
    timestamp: '3天前',
  },
  {
    role: '产品经理',
    content:
      '本轮冲刺进展顺利。在开发新功能之前，我们需要集中精力敲定核心用户流程的最终版本，确保主线体验无懈可击。',
    timestamp: '5天前',
  },
  {
    role: 'AI 助手',
    content:
      '分析用户反馈模式后发现，“快速入门”教程的完成率较低。建议对引导流程进行 A/B 测试，以提升用户转化率。',
    timestamp: '15分钟前',
  },
  {
    role: 'QA 测试',
    content:
      '在移动端 Safari 浏览器上发现一个布局错位问题，当键盘弹出时，底部输入框会被遮挡。已记录 Bug #752。',
    timestamp: '1天前',
  },
];

// ============================================================================
// 3. 页面主组件 (ThoughtsPage)
// ============================================================================

const ThoughtsPage = () => {
  return (
    <div className="flex h-full w-full font-sans text-white">
      {/* 右侧主内容区 */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="mb-8 text-3xl font-bold text-white/90">Thoughts</h1>

        {/* "思考"卡片网格布局 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {thoughtsData.map((thought, index) => (
            <ThoughtItem
              key={index}
              role={thought.role}
              content={thought.content}
              timestamp={thought.timestamp}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ThoughtsPage;

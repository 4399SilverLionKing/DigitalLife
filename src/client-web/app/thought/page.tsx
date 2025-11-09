'use client';

import React from 'react';

import { formatDate } from '@/common/utils/dataFormat';
import ThoughtItem from '@/features/thought/components/ThoughtItem';
import { useGetThoughts } from '@/features/thought/thought.hook';

// ============================================================================
// 3. 页面主组件 (ThoughtsPage)
// ============================================================================

const ThoughtsPage = () => {
  const { data: thoughts } = useGetThoughts({
    page: 1,
    page_size: 10,
  });
  return (
    <div className="flex h-full w-full font-sans text-white">
      {/* 右侧主内容区 */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="mb-8 text-3xl font-bold text-white/90">Thoughts</h1>

        {/* "思考"卡片网格布局 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {thoughts &&
            thoughts.map((thought, index) => (
              <ThoughtItem
                key={index}
                role={thought.agentName}
                content={thought.content}
                timestamp={formatDate(thought.createdAt)}
              />
            ))}
        </div>
      </main>
    </div>
  );
};

export default ThoughtsPage;

-- 表: digital_life
-- 存储关于每个数字生命实体的信息
CREATE TABLE IF NOT EXISTS digital_life (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    visitors INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    lifespan TIMESTAMPTZ, -- 表示生命的截止日期
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 表: tools
-- 存储可供智能体使用的工具信息
CREATE TABLE IF NOT EXISTS tools (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    code TEXT,
    dependencies JSONB, -- 使用 JSONB 类型存储依赖列表
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 表: creations
-- 存储智能体或用户创造的作品，如文章、图片等
CREATE TABLE IF NOT EXISTS creations (
    id BIGSERIAL PRIMARY KEY,
    type TEXT, -- 例如: 'article', 'image', 'video'
    title TEXT NOT NULL,
    content TEXT,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    asset_url TEXT, -- 存储指向图片/视频等资源的链接
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 表: thoughts
-- 记录智能体的思考过程
CREATE TABLE IF NOT EXISTS thoughts (
    id BIGSERIAL PRIMARY KEY,
    cycle_id BIGINT,
    agent_name TEXT,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 表: comments
-- 存储对作品或对AI本身的评论，支持AI回复
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    creation_id BIGINT, -- 可以为NULL，表示对AI整体的评论
    reply_content TEXT, -- 可以为NULL，表示AI还没回复这个评论
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- 外键约束，关联到 creations 表
    CONSTRAINT fk_creation
        FOREIGN KEY(creation_id)
        REFERENCES creations(id)
        ON DELETE CASCADE -- 如果作品被删除，其下的所有评论也一并删除
);

-- 为外键创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_comments_creation_id ON comments(creation_id);

-- 添加一些注释说明
COMMENT ON TABLE digital_life IS '存储关于每个数字生命实体的信息';
COMMENT ON COLUMN digital_life.lifespan IS '生命的截止日期';
COMMENT ON TABLE thoughts IS '记录智能体的思考过程';
COMMENT ON TABLE tools IS '存储可供智能体使用的工具信息';
COMMENT ON TABLE creations IS '存储智能体或用户创造的作品，如文章、图片等';
COMMENT ON TABLE comments IS '存储对作品或对AI本身的评论，支持嵌套';
COMMENT ON COLUMN comments.creation_id IS '关联的作品ID。如果为NULL，则表示对AI整体的评论。';
COMMENT ON COLUMN comments.reply_content IS 'AI回复的内容。如果为NULL，则表示AI尚未评论。';
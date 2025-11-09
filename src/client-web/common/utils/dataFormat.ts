import { format, formatDistanceToNow, isValid } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

// 引入语言包

// 定义一组标准化的、可复用的日期格式
const FORMATS = {
  // 例如: 2025-11-09
  shortDate: 'yyyy-MM-dd',
  // 例如: 2025-11-09 21:33:05
  fullDateTime: 'yyyy-MM-dd HH:mm:ss',
  // 例如: 11/09/2025
  americanDate: 'MM/dd/yyyy',
};

/**
 * 通用的日期格式化函数
 * @param date - 可以是 Date 对象, ISO 字符串, 或者时间戳数字
 * @param formatKey - 'shortDate' | 'fullDateTime' | 'americanDate'，或者一个自定义的格式字符串
 * @param fallback - 当日期无效时返回的默认值
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  formatKey: keyof typeof FORMATS | string = 'fullDateTime',
  fallback: string = '---'
): string => {
  if (!date) {
    return fallback;
  }

  const dateObj = new Date(date);

  // 检查日期是否有效
  if (!isValid(dateObj)) {
    return fallback;
  }

  // 从预设格式或自定义格式中获取格式字符串
  const formatString = FORMATS[formatKey as keyof typeof FORMATS] || formatKey;

  return format(dateObj, formatString);
};

/**
 * 格式化为相对时间 (例如: "5 minutes ago")
 * @param date - 日期
 * @param locale - 语言, 'en' 或 'zh'
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (
  date: Date | string | number | null | undefined,
  locale: 'en' | 'zh' = 'en'
): string => {
  if (!date) return '---';
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return '---';

  const localeMap = {
    en: enUS,
    zh: zhCN,
  };

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: localeMap[locale],
  });
};

import React from 'react';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color?: string;
  label: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  return (
    <div className={`${className || ''}`}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          aria-label={item.label}
          className={`group relative h-[4.5em] w-[4.5em] bg-transparent outline-none [-webkit-tap-highlight-color:transparent] [perspective:24em] [transform-style:preserve-3d] ${
            item.customClass || ''
          }`}
        >
          <span
            className="absolute top-0 left-0 flex h-full w-full origin-[80%_50%] transform rounded-full bg-[hsla(0,0%,100%,0.15)] backdrop-blur-[0.75em] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] [-webkit-backdrop-filter:blur(0.75em)] group-hover:[transform:translateZ(2em)]"
            style={{
              boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset',
            }}
          >
            <span
              className="m-auto flex h-[1.5em] w-[1.5em] items-center justify-center"
              aria-hidden="true"
            >
              {item.icon}
            </span>
          </span>

          <span className="absolute top-full right-0 left-0 mt-2 text-center text-sm whitespace-nowrap text-gray-300">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;

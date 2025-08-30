import { useEffect, useRef, useState } from 'react';

interface TextWithTooltipProps {
  text: string;
  className?: string;
  maxLines?: number;
}

export default function TextWithTooltip({
  text,
  className = '',
  maxLines = 3,
}: TextWithTooltipProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      // Check if text is overflowing by comparing scroll height with client height
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [text]);

  const lineClampClass = `line-clamp-${maxLines}`;

  return (
    <div className="relative">
      <div
        ref={textRef}
        className={`${lineClampClass} ${className}`}
        onMouseEnter={() => isOverflowing && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {text}
      </div>

      {isOverflowing && showTooltip && (
        <div className="absolute z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 -top-8 left-0 max-w-xs break-words whitespace-normal shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}

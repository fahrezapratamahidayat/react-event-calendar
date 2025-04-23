'use client';

import { Button } from '../ui/button';
import { Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { TimeFormatType } from '@/hooks/use-event-calendar';

interface TimeFormatToggleProps {
  format: TimeFormatType;
  onChange: (format: TimeFormatType) => void;
  className?: string;
  tooltipDelay?: number;
}

export function TimeFormatToggle({
  format = TimeFormatType.HOUR_24,
  onChange,
  className = '',
  tooltipDelay = 300,
}: TimeFormatToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    setTooltipText(
      format === TimeFormatType.HOUR_24
        ? 'Switch to 12-hour format (AM/PM)'
        : 'Switch to 24-hour format',
    );
  }, [format]);

  const toggleFormat = () => {
    setIsAnimating(true);
    const newFormat =
      format === TimeFormatType.HOUR_24
        ? TimeFormatType.HOUR_12
        : TimeFormatType.HOUR_24;
    onChange(newFormat);

    // Reset animation
    setTimeout(() => setIsAnimating(false), 200);
  };

  const getDisplayText = () => {
    return format === TimeFormatType.HOUR_24 ? '24h' : '12h';
  };

  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFormat}
            className={`flex items-center transition-transform ${className} ${
              isAnimating ? 'scale-95' : 'scale-100'
            }`}
            aria-label={`Time format: ${getDisplayText()}`}
          >
            <Clock className="mr-1 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

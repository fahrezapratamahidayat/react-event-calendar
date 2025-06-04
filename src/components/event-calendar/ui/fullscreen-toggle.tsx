'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface FullScreenToggleProps {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
  tooltipDelay?: number;
}

export function FullScreenToggle({
  isFullscreen,
  onToggle,
  className = '',
  tooltipDelay = 300,
}: FullScreenToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    setTooltipText(
      isFullscreen ? 'Keluar dari layar penuh' : 'Tampilkan layar penuh',
    );
  }, [isFullscreen]);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle();

    // Reset animation
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <TooltipProvider delayDuration={tooltipDelay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              className={`${className}`}
              aria-label={
                isFullscreen
                  ? 'Keluar dari layar penuh'
                  : 'Tampilkan layar penuh'
              }
            >
              <motion.div
                className="flex items-center"
                animate={isAnimating ? { scale: [1, 1.2, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFullscreen ? 'minimize' : 'maximize'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import React, { useEffect, useState } from 'react';
import { useI18n } from '@hooks/useI18n';
import { Skeleton } from '@components/ui/skeleton';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { Sparkles, Loader2, Brain, ListChecks, FolderOpen, CheckCircle2 } from 'lucide-react';

export default function AiLoadingOverlay({ phase }) {
  const { __ } = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const generateSteps = [
    { icon: Brain,        label: __('Thinking...', 'wedevs-project-manager') },
    { icon: ListChecks,   label: __('Generating tasks...', 'wedevs-project-manager') },
    { icon: FolderOpen,   label: __('Organizing structure...', 'wedevs-project-manager') },
    { icon: CheckCircle2, label: __('Almost ready...', 'wedevs-project-manager') },
  ];

  const saveSteps = [
    { icon: FolderOpen,   label: __('Creating project...', 'wedevs-project-manager') },
    { icon: ListChecks,   label: __('Creating task lists...', 'wedevs-project-manager') },
    { icon: CheckCircle2, label: __('Finalizing tasks...', 'wedevs-project-manager') },
  ];

  const steps = phase === 'saving' ? saveSteps : generateSteps;

  useEffect(() => {
    setActiveStep(0);
    setProgress(0);

    const intervals = phase === 'saving'
      ? [2500, 4000]
      : [2000, 4500, 7000];

    const timers = intervals.map((delay, i) =>
      setTimeout(() => setActiveStep(i + 1), delay)
    );

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.04;
      });
    }, 100);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
    };
  }, [phase]);

  return (
    <div className="flex flex-col items-center py-8 gap-6">
      <div className="relative flex items-center justify-center w-14 h-14">
        <span className="absolute inset-0 rounded-full bg-primary/8 animate-pulse" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full border border-primary/20 bg-primary/5">
          <Sparkles className="h-6 w-6 text-primary" />
        </span>
      </div>

      <div className="w-full space-y-1.5">
        <Progress value={progress} className="h-1.5" />
        <p className="text-sm text-center text-muted-foreground">
          {steps[activeStep]?.label}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500 ${
                isActive
                  ? 'border border-primary/30 bg-primary/5'
                  : isDone
                    ? 'opacity-50'
                    : 'opacity-30'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              ) : (
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm font-medium flex-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {isDone && (
                <Badge variant="secondary" className="text-[14px] px-1.5 py-0 h-4">
                  {__('Done', 'wedevs-project-manager')}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="w-full space-y-2.5">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3.5 w-3.5/5" />
        <Skeleton className="h-3 w-[70%]" />
        <Skeleton className="h-3 w-2/4" />
        <Skeleton className="h-3 w-[85%]" />
      </div>
    </div>
  );
}

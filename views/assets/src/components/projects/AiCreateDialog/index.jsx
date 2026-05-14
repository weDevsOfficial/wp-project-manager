import { __ } from '@wordpress/i18n';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@hooks/useApi';
import { useToast } from '@hooks/useToast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@components/ui/sheet';
import { Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiLoadingOverlay from './parts/AiLoadingOverlay';
import PromptStep from './parts/PromptStep';
import PreviewStep from './parts/PreviewStep';

const AiCreateDialog = ({ open, onOpenChange }) => {
  const toast = useToast();
  const api = useApi();
  const navigate = useNavigate();

  const [step, setStep] = useState('prompt');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  const reset = useCallback(() => {
    setStep('prompt');
    setGenerating(false);
    setSaving(false);
    setGeneratedData(null);
    setFullscreen(false);
  }, []);

  const handleOpenChange = useCallback((val) => {
    if (!val) reset();
    onOpenChange(val);
  }, [onOpenChange, reset]);

  const handleGenerate = useCallback(async (prompt) => {
    if (!prompt.trim()) {
      toast.error(__('Please enter a project description', 'wedevs-project-manager'));
      return;
    }

    setGenerating(true);

    try {
      const res = await api.post('projects/ai/generate', { prompt });

      if (res.message && !res.data?.title) {
        const msg = Array.isArray(res.message) ? res.message.join(', ') : res.message;
        toast.error(msg);
        setGenerating(false);
        return;
      }

      if (res.data && (res.data.title || res.data.tasks || res.data.task_groups)) {
        setGeneratedData(res.data);
        setStep('preview');
      } else {
        toast.error(res.message || __('Failed to generate project structure', 'wedevs-project-manager'));
      }
    } catch (err) {
      toast.error(err?.message || __('Failed to generate project. Please try again.', 'wedevs-project-manager'));
    } finally {
      setGenerating(false);
    }
  }, [api, toast, __]);

  const handleSave = useCallback(async (projectData) => {
    setSaving(true);

    try {
      const projectRes = await api.post('projects', {
        title: projectData.title,
        description: projectData.description,
        status: 'incomplete',
      });

      const projectId = projectRes?.data?.id;
      if (!projectId) {
        toast.error(__('Failed to create project', 'wedevs-project-manager'));
        setSaving(false);
        return;
      }

      if (projectData.task_groups?.length) {
        for (const group of projectData.task_groups) {
          try {
            const listRes = await api.post(`projects/${projectId}/task-lists`, { title: group.title });
            const listId = listRes?.data?.id;

            if (listId && group.tasks?.length) {
              for (const task of group.tasks) {
                try {
                  await api.post(`projects/${projectId}/tasks`, {
                    title: task.title,
                    board_id: listId,
                    project_id: projectId,
                  });
                } catch { /* continue */ }
              }
            }
          } catch { /* continue */ }
        }
      }

      if (projectData.tasks?.length) {
        for (const task of projectData.tasks) {
          try {
            await api.post(`projects/${projectId}/tasks`, {
              title: task.title,
              project_id: projectId,
            });
          } catch { /* continue */ }
        }
      }

      toast.success(__('Project created successfully!', 'wedevs-project-manager'));
      handleOpenChange(false);
      navigate(`/projects/${projectId}/overview`);
    } catch (err) {
      toast.error(err?.message || __('Failed to create project', 'wedevs-project-manager'));
    } finally {
      setSaving(false);
    }
  }, [api, toast, __, navigate, handleOpenChange]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className={cn(
        'flex flex-col p-0 gap-0 transition-all duration-300',
        fullscreen ? 'w-full sm:max-w-full' : 'w-full sm:max-w-[520px]',
      )}>
        <div className="flex items-center gap-1 px-4 pt-3 pb-1">
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={fullscreen ? __('Exit full screen', 'wedevs-project-manager') : __('Full screen', 'wedevs-project-manager')}
          >
            {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>

        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {__('AI Project Generator', 'wedevs-project-manager')}
          </SheetTitle>
          <SheetDescription>
            {generating
              ? __('AI is building your project structure...', 'wedevs-project-manager')
              : step === 'prompt'
                ? __('Describe your project and AI will generate the structure.', 'wedevs-project-manager')
                : __('Review and edit the generated structure before creating.', 'wedevs-project-manager')}
          </SheetDescription>
        </SheetHeader>

        <div className={cn('flex-1 overflow-y-auto px-6 py-5', fullscreen && 'max-w-4xl mx-auto w-full')}>
          {saving ? (
            <AiLoadingOverlay phase="saving" />
          ) : step === 'prompt' ? (
            <PromptStep onGenerate={handleGenerate} generating={generating} />
          ) : (
            <PreviewStep
              data={generatedData}
              onSave={handleSave}
              saving={saving}
              onBack={() => setStep('prompt')}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AiCreateDialog;

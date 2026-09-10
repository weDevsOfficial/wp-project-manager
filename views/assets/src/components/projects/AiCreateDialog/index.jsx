import { __ } from '@wordpress/i18n';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/index';
import { useApi } from '@hooks/useApi';
import { useToast } from '@hooks/useToast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { AiMagic, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Button } from '@components/ui/button';
import { DEFAULT_LABEL_COLOR } from '@lib/colorPresets';
import { cn } from '@/lib/utils';
import ChatComposer from './parts/ChatComposer';
import StructurePreview from './parts/StructurePreview';
import CreationSteps from './parts/CreationSteps';

const AiCreateDialog = ({ open, onOpenChange }) => {
  const toast = useToast();
  const api = useApi();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]); // { id, role, kind, text?, data? }
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [steps, setSteps] = useState(null); // { title, items: [{label, status}] }
  const [fullscreen, setFullscreen] = useState(false);

  const idRef = useRef(0);
  const nextId = () => `m${++idRef.current}`;
  const endRef = useRef(null);

  // Selected AI model from Settings — shown in the composer (read-only here).
  const aiModel = useAppSelector((s) => s.settings?.ai?.ai_model);
  const aiProvider = useAppSelector((s) => s.settings?.ai?.ai_provider);
  const aiModels = useAppSelector((s) => s.settings?.aiModels);
  const modelLabel = useMemo(() => {
    const list = aiModels?.[aiProvider] ?? [];
    const found = list.find((m) => (m.value ?? m) === aiModel);
    return found?.label || aiModel || '';
  }, [aiModels, aiProvider, aiModel]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, steps]);

  const genTimersRef = useRef([]);
  const clearGenTimers = useCallback(() => {
    genTimersRef.current.forEach(clearTimeout);
    genTimersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearGenTimers();
    setMessages([]);
    setGenerating(false);
    setCreating(false);
    setCommitted(false);
    setSteps(null);
    setFullscreen(false);
    idRef.current = 0;
  }, [clearGenTimers]);

  const handleOpenChange = useCallback((val) => {
    if (!val) reset();
    onOpenChange(val);
  }, [onOpenChange, reset]);

  const advanceGen = (from, to) => {
    setSteps((s) => (s ? {
      ...s,
      items: s.items.map((it, i) => (i === from ? { ...it, status: 'done' } : i === to ? { ...it, status: 'active' } : it)),
    } : s));
  };

  const handleSend = useCallback(async (prompt) => {
    if (generating || creating) return;

    setMessages((m) => [...m, { id: nextId(), role: 'user', kind: 'text', text: prompt }]);
    setGenerating(true);

    // Initialization runs inside the process card (not a chat bubble): the
    // active step pops in, completes and recedes, the next pops in.
    setSteps({
      title: __('Generating your project', 'wedevs-project-manager'),
      items: [
        { label: __('Understanding your request', 'wedevs-project-manager'), status: 'active' },
        { label: __('Drafting task lists', 'wedevs-project-manager'), status: 'pending' },
        { label: __('Structuring tasks', 'wedevs-project-manager'), status: 'pending' },
      ],
    });
    clearGenTimers();
    genTimersRef.current = [
      setTimeout(() => advanceGen(0, 1), 1100),
      setTimeout(() => advanceGen(1, 2), 2400),
    ];

    const fail = (msg) => {
      clearGenTimers();
      setSteps(null);
      setMessages((m) => [...m, { id: nextId(), role: 'assistant', kind: 'text', text: msg }]);
      toast.error(msg);
    };

    try {
      const res = await api.post('projects/ai/generate', { prompt });
      clearGenTimers();

      if (res.message && !res.data?.title) {
        fail(Array.isArray(res.message) ? res.message.join(', ') : res.message);
      } else if (res.data && (res.data.title || res.data.tasks || res.data.task_groups)) {
        // Mark every generation step done, then hand off to the preview.
        setSteps((s) => (s ? { ...s, items: s.items.map((it) => ({ ...it, status: 'done' })) } : s));
        const data = res.data;
        genTimersRef.current = [setTimeout(() => {
          setSteps(null);
          setMessages((m) => [...m, { id: nextId(), role: 'assistant', kind: 'preview', data }]);
        }, 550)];
      } else {
        fail(res.message || __('Failed to generate project structure', 'wedevs-project-manager'));
      }
    } catch (err) {
      fail(err?.message || __('Failed to generate project. Please try again.', 'wedevs-project-manager'));
    } finally {
      setGenerating(false);
    }
  }, [api, toast, generating, creating, clearGenTimers]);

  const setStep = useCallback((i, patch) => {
    setSteps((s) => (s ? { ...s, items: s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) } : s));
  }, []);

  const handleCreate = useCallback(async (projectData) => {
    if (creating) return;
    const groups = projectData.task_groups || [];
    const looseTasks = projectData.tasks || [];
    const totalLists = groups.length;
    const totalTasks = groups.reduce((n, g) => n + (g.tasks?.length || 0), 0) + looseTasks.length;

    const LIST_LABEL = __('Creating task lists', 'wedevs-project-manager');
    const TASK_LABEL = __('Adding tasks', 'wedevs-project-manager');

    setCreating(true);
    setCommitted(true);
    setSteps({
      title: __('Building your project', 'wedevs-project-manager'),
      items: [
        { label: __('Creating project', 'wedevs-project-manager'), status: 'active' },
        { label: totalLists ? LIST_LABEL : __('Task lists', 'wedevs-project-manager'), status: 'pending' },
        { label: totalTasks ? TASK_LABEL : __('Tasks', 'wedevs-project-manager'), status: 'pending' },
      ],
    });

    try {
      const projectRes = await api.post('projects', {
        title: projectData.title,
        description: projectData.description,
        status: 'incomplete',
        color_code: projectData.color_code || DEFAULT_LABEL_COLOR,
      });
      const projectId = projectRes?.data?.id;
      if (!projectId) {
        setStep(0, { status: 'error', label: __('Failed to create project', 'wedevs-project-manager') });
        toast.error(__('Failed to create project', 'wedevs-project-manager'));
        setCreating(false);
        return;
      }
      setStep(0, { status: 'done' });

      let listFailures = 0;
      let taskFailures = 0;

      const listIds = [];
      if (totalLists) {
        setStep(1, { status: 'active' });
        for (let gi = 0; gi < groups.length; gi++) {
          try {
            const listRes = await api.post(`projects/${projectId}/task-lists`, { title: groups[gi].title });
            listIds[gi] = listRes?.data?.id ?? null;
          } catch { listIds[gi] = null; listFailures++; }
          setStep(1, { label: `${LIST_LABEL} (${gi + 1}/${totalLists})` });
        }
      }
      setStep(1, { status: 'done' });

      if (totalTasks) {
        setStep(2, { status: 'active' });
        let done = 0;
        for (let gi = 0; gi < groups.length; gi++) {
          const listId = listIds[gi];
          for (const task of (groups[gi].tasks || [])) {
            try {
              await api.post(`projects/${projectId}/tasks`, {
                title: task.title,
                project_id: projectId,
                ...(listId ? { board_id: listId } : {}),
              });
            } catch { taskFailures++; }
            setStep(2, { label: `${TASK_LABEL} (${++done}/${totalTasks})` });
          }
        }
        for (const task of looseTasks) {
          try {
            await api.post(`projects/${projectId}/tasks`, { title: task.title, project_id: projectId });
          } catch { taskFailures++; }
          setStep(2, { label: `${TASK_LABEL} (${++done}/${totalTasks})` });
        }
      }
      setStep(2, { status: 'done' });

      const hadFailures = listFailures > 0 || taskFailures > 0;
      setMessages((m) => [...m, { id: nextId(), role: 'assistant', kind: 'text', text: __('Your project is ready — opening it now.', 'wedevs-project-manager') }]);
      if (hadFailures) {
        toast.warning(__('Project created, but some lists or tasks could not be added.', 'wedevs-project-manager'));
      } else {
        toast.success(__('Project created successfully!', 'wedevs-project-manager'));
      }
      genTimersRef.current.push(setTimeout(() => {
        handleOpenChange(false);
        navigate(`/projects/${projectId}/overview`);
      }, 700));
    } catch (err) {
      toast.error(err?.message || __('Failed to create project', 'wedevs-project-manager'));
      setSteps(null);
      setCreating(false);
      setCommitted(false);
    }
  }, [api, toast, navigate, handleOpenChange, creating, setStep]);

  const empty = messages.length === 0;
  // Once a structure is generated the prompt is locked — the next step is to
  // create it or start over. Regenerate clears everything back to empty.
  const hasGenerated = messages.some((m) => m.kind === 'preview');
  const composerDisabled = generating || creating || hasGenerated;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'flex flex-col gap-0 p-0 transition-all duration-300',
          fullscreen ? 'w-full sm:max-w-full' : 'w-full sm:max-w-[560px]',
        )}
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b px-5 py-3.5">
          <SheetTitle className="flex items-center gap-2 text-base">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pm-accent/10">
              <AiMagic className="h-4 w-4 text-pm-accent" />
            </span>
            {__('AI Project Generator', 'wedevs-project-manager')}
          </SheetTitle>
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="rounded-md p-1.5 text-pm-text-muted transition-colors hover:bg-muted hover:text-pm-text-primary"
            title={fullscreen ? __('Exit full screen', 'wedevs-project-manager') : __('Full screen', 'wedevs-project-manager')}
          >
            {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </SheetHeader>

        {/* Conversation */}
        <div className={cn('flex-1 overflow-y-auto px-4 py-5', fullscreen && 'mx-auto w-full max-w-3xl')}>
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pm-accent/10">
                <AiMagic className="h-6 w-6 text-pm-accent" />
              </span>
              <h3 className="text-base font-semibold text-pm-text-primary">
                {__('Describe your project', 'wedevs-project-manager')}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-pm-text-muted">
                {__('Tell the AI what you’re building and it will draft task lists and tasks you can edit before creating.', 'wedevs-project-manager')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <MessageRow
                  key={msg.id}
                  msg={msg}
                  onCreate={handleCreate}
                  creating={creating}
                  committed={committed}
                />
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Creation process — pinned just above the composer */}
        {steps && (
          <div className={cn('px-4 pb-2', fullscreen && 'mx-auto w-full max-w-3xl')}>
            <CreationSteps title={steps.title} items={steps.items} />
          </div>
        )}

        {/* Composer */}
        <div className={cn(fullscreen && 'mx-auto w-full max-w-3xl')}>
          {hasGenerated && !creating && (
            <div className="flex justify-end px-4 pb-1">
              <Button variant="outline" size="sm" className="gap-1.5 h-11 px-5" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5" />
                {__('Regenerate', 'wedevs-project-manager')}
              </Button>
            </div>
          )}
          <ChatComposer
            onSend={handleSend}
            model={modelLabel}
            disabled={composerDisabled}
            placeholder={
              generating
                ? __('Generating…', 'wedevs-project-manager')
                : creating
                  ? __('Creating your project…', 'wedevs-project-manager')
                  : hasGenerated
                    ? __('Regenerate to start a new project', 'wedevs-project-manager')
                    : __('Describe your project…', 'wedevs-project-manager')
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

function MessageRow({ msg, onCreate, creating, committed }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-pm-accent px-3.5 py-2 text-sm text-white">
          {msg.text}
        </div>
      </div>
    );
  }

  if (msg.kind === 'loading') {
    return (
      <div className="flex justify-start">
        <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-pm-text-muted">
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pm-text-muted/60 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pm-text-muted/60 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pm-text-muted/60" />
          </span>
          {__('Drafting your project structure…', 'wedevs-project-manager')}
        </div>
      </div>
    );
  }

  if (msg.kind === 'preview') {
    return (
      <div className="flex justify-start">
        <div className="w-full">
          <StructurePreview data={msg.data} onCreate={onCreate} disabled={creating} created={committed} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm text-pm-text-primary">
        {msg.text}
      </div>
    </div>
  );
}

export default AiCreateDialog;

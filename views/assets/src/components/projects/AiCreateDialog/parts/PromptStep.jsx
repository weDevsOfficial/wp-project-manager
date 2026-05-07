import React, { useState } from 'react';
import { useI18n } from '@hooks/useI18n';
import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { Sparkles } from 'lucide-react';
import AiLoadingOverlay from './AiLoadingOverlay';

export default function PromptStep({ onGenerate, generating }) {
  const { __ } = useI18n();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  if (generating) {
    return <AiLoadingOverlay phase="generating" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {__('Describe your project and AI will generate the structure with task lists and tasks.', 'wedevs-project-manager')}
      </p>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        className="resize-y min-h-[120px]"
        placeholder={__('e.g. "Build an e-commerce website with product management, order processing, and customer support..."', 'wedevs-project-manager')}
        autoFocus
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!prompt.trim()} className="gap-2">
          <Sparkles className="h-5 w-5" />
          {__('Generate', 'wedevs-project-manager')}
        </Button>
      </div>
    </form>
  );
}

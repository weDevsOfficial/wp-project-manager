import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  loadAiSettings, saveAiSettings, testAiConnection,
  setAiProvider, setAiModel, setAiMaxTokens, setAiTemperature,
} from '@store/settingsSlice'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@components/ui/select'
import { Bot, CheckCircle2 } from 'lucide-react'

const providers = [
  { value: 'openai',    label: 'OpenAI'    },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google',    label: 'Google'    },
]

const AiSettingsTab = () => {
  const { __ } = useI18n()
  const toast  = useToast()
  const dispatch = useAppDispatch()

  const ai            = useAppSelector((s) => s.settings.ai)
  const aiApiState    = useAppSelector((s) => s.settings.aiApiState)
  const aiModels      = useAppSelector((s) => s.settings.aiModels)
  const aiSaving      = useAppSelector((s) => s.settings.aiSaving)
  const aiTestingConn = useAppSelector((s) => s.settings.aiTestingConn)
  const aiLoading     = useAppSelector((s) => s.settings.aiLoading)
  const [localApiKey, setLocalApiKey] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    dispatch(loadAiSettings({ provider: ai.ai_provider }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleProviderChange = useCallback((value) => {
    dispatch(setAiProvider(value))
    setLocalApiKey('')
    setIsDirty(true)
    dispatch(loadAiSettings({ provider: value, preserveProvider: true }))
  }, [dispatch])

  const availableModels = useMemo(
    () => aiModels[ai.ai_provider] ?? [],
    [aiModels, ai.ai_provider]
  )

  const apiKeyPlaceholder = useMemo(
    () =>
      aiApiState.api_key_saved
        ? __('API key is saved -- enter a new one to replace', 'wedevs-project-manager')
        : __('Enter your API key', 'wedevs-project-manager'),
    [aiApiState.api_key_saved, __]
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(saveAiSettings({ ai, apiKey: localApiKey })).unwrap()
      setIsDirty(false)
      setLocalApiKey('')
      toast.success(__('AI settings saved', 'wedevs-project-manager'))
    } catch (err) {
      toast.error(err ?? __('Failed to save AI settings', 'wedevs-project-manager'))
    }
  }

  const handleTestConnection = async () => {
    try {
      const result = await dispatch(testAiConnection({
        provider: ai.ai_provider,
        apiKey: localApiKey || (aiApiState.api_key_saved ? aiApiState.api_key : ''),
      })).unwrap()
      if (result.success) {
        toast.success(result.message || __('Connection successful', 'wedevs-project-manager'))
      } else {
        toast.error(result.message || __('Connection failed', 'wedevs-project-manager'))
      }
    } catch (err) {
      toast.error(err ?? __('Connection failed', 'wedevs-project-manager'))
    }
  }

  if (aiLoading) {
    return (
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
              <Bot className="w-4 h-4 text-pm-accent" />
              {__('AI Settings', 'wedevs-project-manager')}
            </h2>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-full max-w-sm bg-pm-border/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-pm-text flex items-center gap-2">
            <Bot className="w-4 h-4 text-pm-accent" />
            {__('AI Settings', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Configure AI provider for project generation and smart suggestions.', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="mt-5 rounded-lg border border-pm-border bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label htmlFor="ai_provider">{__('AI Provider', 'wedevs-project-manager')}</Label>
              <p className="text-xs text-pm-text-muted mt-1">{__('Select your preferred AI service.', 'wedevs-project-manager')}</p>
            </div>
            <Select value={ai.ai_provider} onValueChange={handleProviderChange}>
              <SelectTrigger id="ai_provider" className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {providers.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="border-t border-pm-border" />
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label htmlFor="ai_api_key">{__('API Key', 'wedevs-project-manager')}</Label>
              <p className="text-xs text-pm-text-muted mt-1">{__('Your secret key from the provider dashboard.', 'wedevs-project-manager')}</p>
            </div>
            <div className="space-y-1.5">
              <Input id="ai_api_key" type="password" value={localApiKey} onChange={(e) => { setLocalApiKey(e.target.value); setIsDirty(true) }} placeholder={apiKeyPlaceholder} className="max-w-sm" />
              {aiApiState.api_key_saved && (
                <div className="flex items-center gap-1.5 text-xs text-pm-status-done">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {__('API key is saved', 'wedevs-project-manager')}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-pm-border" />
          <div className="flex items-center justify-between px-5 py-4">
            <div><Label htmlFor="ai_model">{__('Model', 'wedevs-project-manager')}</Label></div>
            <Select value={ai.ai_model} onValueChange={(val) => { dispatch(setAiModel(val)); setIsDirty(true) }}>
              <SelectTrigger id="ai_model" className="w-64"><SelectValue placeholder={__('Select a model', 'wedevs-project-manager')} /></SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (<SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="border-t border-pm-border" />
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label htmlFor="ai_max_tokens">{__('Max Tokens', 'wedevs-project-manager')}</Label>
              <p className="text-xs text-pm-text-muted mt-1">500 – 16 384</p>
            </div>
            <Input id="ai_max_tokens" type="number" min={500} max={16384} value={ai.ai_max_tokens} onChange={(e) => { dispatch(setAiMaxTokens(Number(e.target.value))); setIsDirty(true) }} className="w-40" />
          </div>
          <div className="border-t border-pm-border" />
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label htmlFor="ai_temperature">{__('Temperature', 'wedevs-project-manager')}</Label>
              <p className="text-xs text-pm-text-muted mt-1">{__('0 = deterministic / 1 = creative', 'wedevs-project-manager')}</p>
            </div>
            <div className="flex items-center gap-3">
              <input id="ai_temperature" type="range" min={0} max={1} step={0.1} value={ai.ai_temperature} onChange={(e) => { dispatch(setAiTemperature(parseFloat(e.target.value))); setIsDirty(true) }} className="w-44 accent-pm-accent" />
              <span className="text-sm font-medium text-pm-text w-8">{ai.ai_temperature.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <Button type="button" variant="outline" disabled={aiTestingConn || aiSaving} onClick={handleTestConnection}>
            {aiTestingConn ? __('Testing...', 'wedevs-project-manager') : __('Test Connection', 'wedevs-project-manager')}
          </Button>
          <Button type="submit" disabled={aiSaving || aiTestingConn || !isDirty}>
            {aiSaving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
          </Button>
          {isDirty && (
            <span className="text-xs text-amber-600">{__('You have unsaved changes', 'wedevs-project-manager')}</span>
          )}
        </div>
      </form>
    </div>
  )
}

export default AiSettingsTab

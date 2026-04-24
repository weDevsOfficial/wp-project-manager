import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import { Bot, CheckCircle2, Eye, EyeOff, Loader2, Pencil } from 'lucide-react'

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
  const [showKey, setShowKey] = useState(false)
  const [editingKey, setEditingKey] = useState(false)
  const pendingLoadRef = useRef(null)

  const dispatchLoadAiSettings = useCallback((args) => {
    if (pendingLoadRef.current) pendingLoadRef.current.abort()
    pendingLoadRef.current = dispatch(loadAiSettings(args))
  }, [dispatch])

  useEffect(() => {
    dispatchLoadAiSettings({ provider: ai.ai_provider })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleProviderChange = useCallback((value) => {
    dispatch(setAiProvider(value))
    setLocalApiKey('')
    setIsDirty(true)
    dispatchLoadAiSettings({ provider: value, preserveProvider: true })
  }, [dispatch, dispatchLoadAiSettings])

  const availableModels = useMemo(
    () => aiModels[ai.ai_provider] ?? [],
    [aiModels, ai.ai_provider]
  )


  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(saveAiSettings({ ai, apiKey: localApiKey })).unwrap()
      setIsDirty(false)
      setLocalApiKey('')
      setEditingKey(false)
      toast.success(__('AI settings saved', 'wedevs-project-manager'))
      // Reload settings to fetch updated models from backend
      dispatchLoadAiSettings({ provider: ai.ai_provider, preserveProvider: true })
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
              <Bot className="w-5 h-5 text-pm-accent" />
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
            <Bot className="w-5 h-5 text-pm-accent" />
            {__('AI Settings', 'wedevs-project-manager')}
          </h2>
          <p className="text-sm text-pm-text-muted mt-0.5">
            {__('Configure the AI provider used for AI-powered features — including automatic project generation and AI subtask generation (Pro).', 'wedevs-project-manager')}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="mt-5 rounded-lg border border-pm-border bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <Label htmlFor="ai_provider">{__('AI Provider', 'wedevs-project-manager')}</Label>
              <p className="text-sm text-pm-text-muted mt-1">{__('Select your preferred AI service.', 'wedevs-project-manager')}</p>
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
              <p className="text-sm text-pm-text-muted mt-1">{__('Your secret key from the provider dashboard.', 'wedevs-project-manager')}</p>
            </div>
            <div className="space-y-1.5">
              {aiApiState.api_key_saved && !editingKey ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center h-9 w-56 rounded-md border border-pm-border bg-pm-surface px-3 text-sm select-none overflow-hidden">
                      <span className="truncate">{showKey ? aiApiState.api_key : '••••••••••••••••••••••••'}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => setShowKey(v => !v)}
                      title={showKey ? __('Hide API Key', 'wedevs-project-manager') : __('Show API Key', 'wedevs-project-manager')}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => { setEditingKey(true); setLocalApiKey(''); setShowKey(false) }}
                      title={__('Change API Key', 'wedevs-project-manager')}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-pm-status-done">
                    <CheckCircle2 className="w-4 h-4" />
                    {__('API key is saved', 'wedevs-project-manager')}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    id="ai_api_key"
                    type={showKey ? 'text' : 'password'}
                    value={localApiKey}
                    onChange={(e) => { setLocalApiKey(e.target.value); setIsDirty(true) }}
                    placeholder={__('Enter your API key', 'wedevs-project-manager')}
                    className="w-56"
                    autoFocus={editingKey}
                  />
                  {localApiKey && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => setShowKey(v => !v)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                  {editingKey && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditingKey(false); setLocalApiKey('') }}
                    >
                      {__('Cancel', 'wedevs-project-manager')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          {aiApiState.api_key_saved && (
            <>
              <div className="border-t border-pm-border" />
              {aiLoading ? (
                <div className="flex items-center gap-2 px-5 py-4 text-sm text-pm-text-muted">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {__('Fetching models...', 'wedevs-project-manager')}
                </div>
              ) : availableModels.length > 0 ? (
                <>
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
                      <p className="text-sm text-pm-text-muted mt-1">{__('500–16384. Higher values allow more detailed responses for both project and subtask generation, but may cost more.', 'wedevs-project-manager')}</p>
                    </div>
                    <Input id="ai_max_tokens" type="number" min={500} max={16384} value={ai.ai_max_tokens} onChange={(e) => { dispatch(setAiMaxTokens(Number(e.target.value))); setIsDirty(true) }} className="w-40" />
                  </div>
                  <div className="border-t border-pm-border" />
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <Label htmlFor="ai_temperature">{__('Temperature', 'wedevs-project-manager')}</Label>
                      <p className="text-sm text-pm-text-muted mt-1">{__('0 = deterministic / 1 = creative', 'wedevs-project-manager')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input id="ai_temperature" type="range" min={0} max={1} step={0.1} value={ai.ai_temperature} onChange={(e) => { dispatch(setAiTemperature(parseFloat(e.target.value))); setIsDirty(true) }} className="w-44 accent-pm-accent" />
                      <span className="text-sm font-medium text-pm-text w-8">{ai.ai_temperature.toFixed(1)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-5 py-4 text-sm text-pm-text-muted">
                  {__('No models available for this provider. Please verify your API key and save again.', 'wedevs-project-manager')}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <Button type="button" variant="outline" disabled={aiTestingConn || aiSaving} onClick={handleTestConnection}>
            {aiTestingConn ? __('Testing...', 'wedevs-project-manager') : __('Test Connection', 'wedevs-project-manager')}
          </Button>
          <Button type="submit" disabled={aiSaving || aiTestingConn || !isDirty}>
            {aiSaving ? __('Saving...', 'wedevs-project-manager') : __('Save Changes', 'wedevs-project-manager')}
          </Button>
          {isDirty && (
            <span className="text-sm text-amber-600">{__('You have unsaved changes', 'wedevs-project-manager')}</span>
          )}
        </div>
      </form>
    </div>
  )
}

export default AiSettingsTab

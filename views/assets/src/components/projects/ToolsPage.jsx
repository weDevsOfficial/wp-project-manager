import React, { useState, useCallback } from 'react'
import { useApi } from '@hooks/useApi'
import { useI18n } from '@hooks/useI18n'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Progress } from '@components/ui/progress'
import {
  ChevronDown, ChevronUp, Upload, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react'

/* ── Trello Import Card ── */
function TrelloImportCard() {
  const { __ } = useI18n()
  const api    = useApi()

  const [open, setOpen]           = useState(true)
  const [appKey, setAppKey]       = useState('')
  const [appToken, setAppToken]   = useState('')
  const [importing, setImporting] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)

  const callStep = useCallback(async (endpoint, data) => {
    const res = await api.post(endpoint, data)
    return res
  }, [api])

  const handleImport = async (e) => {
    e.preventDefault()
    if (!appKey.trim() || !appToken.trim()) {
      toast.warning(__('Please provide both App Key and App Token', 'wedevs-project-manager'))
      return
    }

    setImporting(true)
    setProgress(0)
    setStatusMsg('')
    setError('')
    setDone(false)

    const creds = { app_key: appKey, app_token: appToken }

    try {
      // Step 1: Get user
      setStatusMsg(__('Importing Trello user data...', 'wedevs-project-manager'))
      setProgress(5)
      const userData = await callStep('trello/get_user', creds)
      if (!userData) {
        setError(__('No user found. Please check your App Key & Token.', 'wedevs-project-manager'))
        setImporting(false)
        return
      }

      // Step 2: Get boards
      setStatusMsg(__('Fetching Trello boards...', 'wedevs-project-manager'))
      setProgress(15)
      const boardsData = await callStep('trello/get_boards', { ...creds, formData: creds })

      if (!boardsData || !Array.isArray(boardsData) || boardsData.length === 0) {
        setStatusMsg(__('No boards found in your Trello account.', 'wedevs-project-manager'))
        setProgress(100)
        setDone(true)
        setImporting(false)
        return
      }

      const totalBoards = boardsData.length

      // Step 3-6: For each board, get lists, cards, subcards, users
      for (let i = 0; i < totalBoards; i++) {
        const board = boardsData[i]
        const boardProgress = Math.round(((i + 1) / totalBoards) * 80) + 15
        const boardLabel = board.name || `Board ${i + 1}`

        // Get lists for this board
        setStatusMsg(__(`Importing lists from "${boardLabel}"...`, 'wedevs-project-manager'))
        setProgress(Math.min(boardProgress - 10, 90))
        const listsData = await callStep('trello/get_lists', {
          ...creds,
          formData: creds,
          boards_data: [board],
        })

        // Get cards for lists
        setStatusMsg(__(`Importing cards from "${boardLabel}"...`, 'wedevs-project-manager'))
        setProgress(Math.min(boardProgress - 5, 92))
        const cardsData = await callStep('trello/get_cards', {
          ...creds,
          formData: creds,
          lists_data: listsData,
        })

        // Get subcards
        setStatusMsg(__(`Importing sub-cards from "${boardLabel}"...`, 'wedevs-project-manager'))
        setProgress(Math.min(boardProgress - 2, 94))
        await callStep('trello/get_subcards', {
          ...creds,
          formData: creds,
          cards_data: cardsData,
        })

        // Get users/assignees
        setStatusMsg(__(`Importing assignees from "${boardLabel}"...`, 'wedevs-project-manager'))
        setProgress(Math.min(boardProgress, 96))
        await callStep('trello/get_users', {
          ...creds,
          formData: creds,
          cards_data: cardsData,
        })
      }

      setProgress(100)
      setStatusMsg(__('Trello import completed successfully!', 'wedevs-project-manager'))
      setDone(true)
      toast.success(__('Trello data imported successfully!', 'wedevs-project-manager'))
    } catch (err) {
      setError(err?.message || __('Import failed. Please check your credentials and try again.', 'wedevs-project-manager'))
      toast.error(__('Trello import failed', 'wedevs-project-manager'))
    } finally {
      setImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2zM10.2 17.4a1.4 1.4 0 0 1-1.4 1.4H5.6a1.4 1.4 0 0 1-1.4-1.4V5.6a1.4 1.4 0 0 1 1.4-1.4h3.2a1.4 1.4 0 0 1 1.4 1.4v11.8zm9.6-5.6a1.4 1.4 0 0 1-1.4 1.4h-3.2a1.4 1.4 0 0 1-1.4-1.4V5.6a1.4 1.4 0 0 1 1.4-1.4h3.2a1.4 1.4 0 0 1 1.4 1.4v6.2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-base">{__('Trello', 'wedevs-project-manager')}</CardTitle>
              <CardDescription className="text-xs">
                {__('Import boards, lists, and cards from Trello', 'wedevs-project-manager')}
              </CardDescription>
            </div>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <Label htmlFor="trello-key" className="text-sm font-medium">
                  {__('Provide your App Key & Token', 'wedevs-project-manager')}
                </Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {__('Get your API key and token from', 'wedevs-project-manager')}{' '}
                  <a
                    href="https://trello.com/app-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pm-accent hover:underline"
                  >
                    trello.com/app-key
                  </a>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="trello-key"
                    placeholder={__('App Key', 'wedevs-project-manager')}
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    disabled={importing}
                  />
                  <Input
                    id="trello-token"
                    placeholder={__('App Token', 'wedevs-project-manager')}
                    value={appToken}
                    onChange={(e) => setAppToken(e.target.value)}
                    disabled={importing}
                  />
                </div>
              </div>

              {/* Progress */}
              {(statusMsg || error) && (
                <div className="space-y-2">
                  {statusMsg && (
                    <div className="flex items-center gap-2 text-sm">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : importing ? (
                        <Loader2 className="w-4 h-4 text-pm-accent animate-spin shrink-0" />
                      ) : null}
                      <span className={done ? 'text-green-600' : 'text-muted-foreground'}>{statusMsg}</span>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {progress > 0 && (
                    <div className="space-y-1">
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">{progress}%</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={importing}
                  className="bg-pm-accent hover:bg-pm-accent/90"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {__('Importing...', 'wedevs-project-manager')}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {__('Import', 'wedevs-project-manager')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
      )}
    </Card>
  )
}

/* ── Main Tools Page ── */
export default function ToolsPage() {
  const { __ } = useI18n()

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pm-text">{__('Import Tools', 'wedevs-project-manager')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {__('Import projects, tasks, and data from third-party project management tools.', 'wedevs-project-manager')}
        </p>
      </div>

      <div className="space-y-4">
        <TrelloImportCard />
      </div>
    </div>
  )
}

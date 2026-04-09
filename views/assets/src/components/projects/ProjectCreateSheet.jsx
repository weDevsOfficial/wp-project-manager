import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/index'
import {
  createProject,
  updateProject,
  searchUsers,
  setCreateSheetOpen,
  closeEditSheet,
} from '@store/projectsSlice'
import { cn } from '@lib/utils'
import { useI18n } from '@hooks/useI18n'
import { useToast } from '@hooks/useToast'

import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import RichTextEditor from '@components/common/RichTextEditor'
import { Checkbox } from '@components/ui/checkbox'
import { Separator } from '@components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command'

import { Plus, X, Loader2, UserPlus } from 'lucide-react'

// ── Component ────────────────────────────────────────────

export function ProjectCreateSheet() {
  const dispatch = useAppDispatch()
  const { __ } = useI18n()
  const toast = useToast()

  const {
    createSheetOpen,
    creating,
    updating,
    editSheetOpen,
    editProject,
    categories,
    roles,
    searchingUsers,
  } = useAppSelector((s) => s.projects)

  const isEditMode = editSheetOpen && editProject
  const isOpen = createSheetOpen || editSheetOpen
  const isSaving = creating || updating

  // ── Form state ──────────────────────────────────────────

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [notifyUsers, setNotifyUsers] = useState(false)
  const [titleError, setTitleError] = useState('')

  // ── User search state ───────────────────────────────────

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [popoverOpen, setPopoverOpen] = useState(false)

  const searchTimerRef = useRef(null)

  // ── Reset form when sheet opens ─────────────────────────

  useEffect(() => {
    if (isOpen) {
      setTitleError('')
      setSearchQuery('')
      setSearchResults([])
      setPopoverOpen(false)

      if (isEditMode) {
        setTitle(editProject.title || '')
        setDescription(editProject.description?.content || editProject.description || '')
        const catId = editProject.categories?.data?.[0]?.id
        setCategoryId(catId ? String(catId) : '')
        setNotifyUsers(false)

        const assignees = editProject.assignees?.data || []
        const defaultRoleId = roles.length > 0 ? roles[0].id : 1
        setSelectedUsers(
          assignees.map((a) => ({
            id: a.id || a.assigned_to,
            display_name: a.display_name || a.name || '',
            avatar_url: a.avatar_url || '',
            email: a.email || a.user_email || '',
            roleId: a.roles?.data?.[0]?.id || a.role_id || defaultRoleId,
          }))
        )
      } else {
        setTitle('')
        setDescription('')
        setCategoryId('')
        setNotifyUsers(false)
        setSelectedUsers([])
      }
    }
  }, [isOpen, isEditMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [])

  // ── Debounced search ────────────────────────────────────

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value)

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)

      if (value.trim().length < 2) {
        setSearchResults([])
        return
      }

      searchTimerRef.current = setTimeout(async () => {
        try {
          const results = await dispatch(searchUsers(value.trim())).unwrap()
          const filtered = results.filter(
            (u) => !selectedUsers.some((su) => parseInt(su.id) === parseInt(u.id)),
          )
          setSearchResults(filtered)
        } catch {
          setSearchResults([])
        }
      }, 300)
    },
    [dispatch, selectedUsers],
  )

  // ── Add user ────────────────────────────────────────────

  const handleAddUser = useCallback(
    (user) => {
      const defaultRoleId = roles.length > 0 ? roles[0].id : 1
      setSelectedUsers((prev) => [...prev, { ...user, roleId: defaultRoleId }])
      setSearchResults((prev) => prev.filter((u) => u.id !== user.id))
      setSearchQuery('')
      setPopoverOpen(false)
    },
    [roles],
  )

  // ── Remove user ─────────────────────────────────────────

  const handleRemoveUser = useCallback((userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId))
  }, [])

  // ── Change user role ────────────────────────────────────

  const handleRoleChange = useCallback((userId, roleId) => {
    setSelectedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, roleId } : u)),
    )
  }, [])

  // ── User display helpers ────────────────────────────────

  const getUserName = (user) => user.display_name || user.email || ''

  const userInitials = (name) =>
    (name || '')
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')

  // ── Submit ──────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) {
      setTitleError(__('Project name is required'))
      return
    }
    setTitleError('')

    const payload = {
      title: title.trim(),
    }

    if (description.trim()) payload.description = description.trim()

    if (categoryId && categoryId !== '__none__') {
      payload.categories = [Number(categoryId)]
    }

    if (selectedUsers.length > 0) {
      payload.assignees = selectedUsers.map((u) => ({
        user_id: u.id,
        role_id: u.roleId,
      }))
    }

    if (notifyUsers) payload.notify_users = true

    try {
      if (isEditMode) {
        payload.projectId = editProject.id
        await dispatch(updateProject(payload)).unwrap()
        toast.success(__('Project updated successfully'))
      } else {
        await dispatch(createProject(payload)).unwrap()
        toast.success(__('Project created successfully'))
      }
    } catch {
      toast.error(isEditMode ? __('Failed to update project') : __('Failed to create project'))
    }
  }, [dispatch, title, description, categoryId, selectedUsers, notifyUsers, toast, __, isEditMode, editProject])

  // ── Render ──────────────────────────────────────────────

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (isEditMode) dispatch(closeEditSheet())
          else dispatch(setCreateSheetOpen(false))
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{isEditMode ? __('Edit Project') : __('Create New Project')}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? __('Update the project details below.')
              : __('Fill in the details below to create a new project.')}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-title">
              {__('Project Name')} <span className="text-destructive">*</span>
            </Label>
            <input
              id="project-title"
              placeholder={__('Enter project name')}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (e.target.value.trim()) setTitleError('')
              }}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                titleError && 'border-destructive'
              )}
            />
            {titleError && (
              <p className="text-sm text-destructive">{titleError}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{__('Category')}</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder={__('Select a category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">{__('None')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="project-description">{__('Description')}</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder={__('Describe your project...')}
              minHeight="100px"
            />
          </div>

          <Separator />

          {/* Team Members */}
          <div className="space-y-3">
            <Label>{__('Team Members')}</Label>

            {/* User search — Popover + Command */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground font-normal"
                  onClick={() => setPopoverOpen(true)}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  {__('Search and add members...')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={__('Search users...')}
                    value={searchQuery}
                    onValueChange={handleSearchChange}
                  />
                  <CommandList>
                    {searchingUsers && (
                      <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {__('Searching...')}
                      </div>
                    )}

                    {!searchingUsers && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                      <CommandEmpty>{__('No users found')}</CommandEmpty>
                    )}

                    {searchResults.length > 0 && (
                      <CommandGroup>
                        {searchResults.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={String(user.id)}
                            onSelect={() => handleAddUser(user)}
                            className="cursor-pointer"
                          >
                            <Avatar className="h-7 w-7 mr-2">
                              <AvatarImage src={user.avatar_url} alt={getUserName(user)} />
                              <AvatarFallback className="text-[14px]">
                                {userInitials(getUserName(user))}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{getUserName(user)}</p>
                              {user.display_name && <p className="text-sm text-muted-foreground truncate">{user.email}</p>}
                            </div>
                            <Plus className="h-5 w-5 text-muted-foreground shrink-0" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected users table */}
            {selectedUsers.length > 0 && (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-3 py-2 font-medium text-pm-text-muted">
                        {__('User')}
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-pm-text-muted w-36">
                        {__('Role')}
                      </th>
                      <th className="px-3 py-2 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={user.avatar_url} alt={getUserName(user)} />
                              <AvatarFallback className="text-[14px]">
                                {userInitials(getUserName(user))}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium truncate">{getUserName(user)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={String(user.roleId)}
                            onValueChange={(val) => handleRoleChange(user.id, Number(val))}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={String(role.id)}>
                                  {role.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Separator />

          {/* Notify Co-Workers */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="notify-users"
              checked={notifyUsers}
              onCheckedChange={(checked) => setNotifyUsers(checked === true)}
            />
            <Label htmlFor="notify-users" className="text-sm cursor-pointer">
              {__('Notify co-workers via email')}
            </Label>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t">
          <Button
            variant="outline"
            onClick={() => isEditMode ? dispatch(closeEditSheet()) : dispatch(setCreateSheetOpen(false))}
            disabled={isSaving}
          >
            {__('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {isSaving
              ? (isEditMode ? __('Updating...') : __('Creating...'))
              : (isEditMode ? __('Update Project') : __('Create Project'))}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

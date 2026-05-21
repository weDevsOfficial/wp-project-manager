import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import { cn } from '@/lib/utils';

const sizeMap = {
  xs: { avatar: 'h-4 w-4',   text: 'text-[6px]' },
  sm: { avatar: 'h-5 w-5',   text: 'text-[7px]' },
  md: { avatar: 'h-7 w-7',   text: 'text-[11px]' },
  lg: { avatar: 'h-8 w-8',   text: 'text-[13px]' },
  xl: { avatar: 'h-14 w-14', text: 'text-lg' },
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeAvatarUrl(url) {
  if (!url) return '';
  if (!/gravatar\.com\/avatar/i.test(url)) return url;
  // Force `d=404` so missing gravatars return HTTP 404. Radix AvatarImage
  // then fires onError and the AvatarFallback (initials) renders. Any other
  // default (blank/mp/identicon/custom URL) loads successfully and would
  // suppress the fallback.
  if (/[?&]d=/i.test(url)) {
    return url.replace(/([?&])d=[^&#]*/i, '$1d=404');
  }
  return url + (url.includes('?') ? '&' : '?') + 'd=404';
}

export function UserAvatar({ user, size = 'md', className, fallbackClassName, ...props }) {
  const s = sizeMap[size] || sizeMap.md;
  const name = user?.display_name || user?.username || '';
  const avatarUrl = normalizeAvatarUrl(user?.avatar_url || '');

  return (
    <Avatar className={cn(s.avatar, 'shrink-0', className)} {...props}>
      {avatarUrl && (
        <AvatarImage src={avatarUrl} alt={name} loading="lazy" />
      )}
      <AvatarFallback
        className={cn(s.text, 'font-semibold bg-primary/10 text-primary', fallbackClassName)}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

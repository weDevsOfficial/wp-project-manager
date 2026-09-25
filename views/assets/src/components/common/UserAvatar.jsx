import React from 'react';
import { Avatar, AvatarImage } from '@components/ui/avatar';
import { cn } from '@/lib/utils';

// Gravatar answers `d=blank` with a transparent PNG for anyone who has never
// set an avatar, so the initials painted underneath show through and the
// browser logs nothing. Remembering the URLs that did fail (a broken custom
// avatar, an offline host) lets later renders skip the <img> altogether. Per
// page load by design, so a newly uploaded gravatar shows up on the next
// refresh.
const failedAvatarUrls = new Set();

const sizeMap = {
  xs: { avatar: 'h-4 w-4',   text: 'text-[6px]' },
  sm: { avatar: 'h-7 w-7',   text: 'text-[11px]' },
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
  // Force `d=blank`: a missing gravatar comes back as a transparent 200 that
  // lets the initials underneath show through. `d=404` also worked, through
  // AvatarFallback, but every avatarless user cost a 404 in the console.
  if (/[?&]d=/i.test(url)) {
    return url.replace(/([?&])d=[^&#]*/i, '$1d=blank');
  }
  return url + (url.includes('?') ? '&' : '?') + 'd=blank';
}

export function UserAvatar({ user, size = 'md', className, fallbackClassName, ...props }) {
  const s = sizeMap[size] || sizeMap.md;
  const name = user?.display_name || user?.username || '';
  const avatarUrl = normalizeAvatarUrl(user?.avatar_url || '');
  // Derived, not state, so it re-evaluates when the same component renders a
  // different user.
  const [, rerender] = React.useReducer(x => x + 1, 0);
  const alreadyFailed = avatarUrl ? failedAvatarUrls.has(avatarUrl) : true;

  return (
    <Avatar className={cn(s.avatar, 'shrink-0', className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          s.text,
          'absolute inset-0 flex items-center justify-center font-semibold bg-pm-accent-light text-pm-accent',
          fallbackClassName,
        )}
      >
        {getInitials(name)}
      </span>
      {avatarUrl && !alreadyFailed && (
        <AvatarImage
          src={avatarUrl}
          alt={name}
          loading="lazy"
          className="relative"
          onLoadingStatusChange={status => {
            if (status === 'error' && !failedAvatarUrls.has(avatarUrl)) {
              failedAvatarUrls.add(avatarUrl);
              rerender();
            }
          }}
        />
      )}
    </Avatar>
  );
}

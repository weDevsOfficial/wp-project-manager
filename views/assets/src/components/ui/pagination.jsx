import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { __ } from "@wordpress/i18n"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label={__('pagination', 'wedevs-project-manager')}
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1 list-none p-0 m-0", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("list-none", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(buttonVariants({
      variant: isActive ? "outline" : "ghost",
      size,
    }), "cursor-pointer", className)}
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label={__('Go to previous page', 'wedevs-project-manager')}
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>{__('Previous', 'wedevs-project-manager')}</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label={__('Go to next page', 'wedevs-project-manager')}
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}>
    <span>{__('Next', 'wedevs-project-manager')}</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">{__('More pages', 'wedevs-project-manager')}</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// Windowed page list: [1, 'ellipsis', 27, 28, 29, 'ellipsis', 51].
// siblingCount = pages shown on each side of the current page.
function getPageWindow(currentPage, totalPages, siblingCount = 1) {
  const total = Math.max(1, totalPages || 1)
  const current = Math.min(Math.max(1, currentPage || 1), total)
  const range = (start, end) =>
    Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i)

  // first + last + current + 2*siblings + 2 ellipses ⇒ show all below this
  const totalPageNumbers = siblingCount * 2 + 5
  if (total <= totalPageNumbers) return range(1, total)

  const leftSibling = Math.max(current - siblingCount, 1)
  const rightSibling = Math.min(current + siblingCount, total)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < total - 1
  const edgeCount = 3 + 2 * siblingCount

  if (!showLeftDots && showRightDots) {
    return [...range(1, edgeCount), 'ellipsis', total]
  }
  if (showLeftDots && !showRightDots) {
    return [1, 'ellipsis', ...range(total - edgeCount + 1, total)]
  }
  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', total]
}

// One numbered, windowed pagination bar used everywhere (free + pro via window.PM).
// props: page (1-based), totalPages, onPageChange(page), siblingCount?, className?
function PaginationNav({ page, totalPages, onPageChange, siblingCount = 1, className }) {
  const total = Math.max(1, totalPages || 1)
  const current = Math.min(Math.max(1, page || 1), total)
  if (total <= 1) return null

  const go = (p) => {
    if (p >= 1 && p <= total && p !== current && typeof onPageChange === 'function') {
      onPageChange(p)
    }
  }
  const pages = getPageWindow(current, total, siblingCount)

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-label={__('Go to previous page', 'wedevs-project-manager')}
            className={cn(current === 1 && 'pointer-events-none opacity-50')}
            onClick={() => go(current - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {pages.map((p, i) => (
          <PaginationItem key={`${p}-${i}`}>
            {p === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={p === current} onClick={() => go(p)}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            aria-label={__('Go to next page', 'wedevs-project-manager')}
            className={cn(current === total && 'pointer-events-none opacity-50')}
            onClick={() => go(current + 1)}>
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
PaginationNav.displayName = "PaginationNav"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationNav,
  getPageWindow,
}

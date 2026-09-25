import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  // A foreground tint (about 1.4:1 on white) so the loading shape is actually visible, in dark mode too.
  return (<div className={cn("animate-pulse rounded-md bg-foreground/15", className)} {...props} />);
}

export { Skeleton }

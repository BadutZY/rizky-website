import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted/50 relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.08) 50%, transparent 100%)',
          animation: 'skeletonShimmer 2s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export { Skeleton };

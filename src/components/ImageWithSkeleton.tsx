import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

const ImageWithSkeleton = ({ className, skeletonClassName, onLoad, style, ...props }: ImageWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <Skeleton className={cn("absolute inset-0 w-full h-full", skeletonClassName)} />
      )}
      <img
        {...props}
        className={cn(className, !loaded && 'opacity-0')}
        style={{
          ...style,
          transition: [
            'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            'filter 1s cubic-bezier(0.4, 0, 0.2, 1)',
            'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          ].join(', '),
        }}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
};

export default ImageWithSkeleton;

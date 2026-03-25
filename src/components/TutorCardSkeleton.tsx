import { Card, CardContent } from "@/components/ui/card";

const TutorCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row animate-pulse">
          {/* Avatar Skeleton */}
          <div className="h-48 w-full bg-muted sm:h-auto sm:w-40 sm:min-h-[200px]" />

          {/* Content Skeleton */}
          <div className="flex flex-1 flex-col p-5">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="space-y-2">
                <div className="h-5 w-36 rounded bg-muted" />
                <div className="h-3.5 w-24 rounded bg-muted" />
              </div>
              <div className="h-7 w-16 rounded-full bg-muted" />
            </div>

            {/* Subject Badges */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              <div className="h-6 w-20 rounded-full bg-muted" />
              <div className="h-6 w-16 rounded-full bg-muted" />
              <div className="h-6 w-24 rounded-full bg-muted" />
            </div>

            {/* Bio */}
            <div className="mb-4 flex-1 space-y-2">
              <div className="h-3.5 w-full rounded bg-muted" />
              <div className="h-3.5 w-3/4 rounded bg-muted" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-14 rounded bg-muted" />
              </div>
              <div className="h-9 w-24 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCardSkeleton;

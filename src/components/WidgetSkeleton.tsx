'use client';

export default function WidgetSkeleton() {
    return (
        <div className="animate-pulse space-y-8 p-4">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="space-y-2 w-full">
                    <div className="h-6 bg-zinc-200 rounded-full w-1/3"></div>
                    <div className="h-3 bg-zinc-100 rounded-full w-1/2"></div>
                </div>
            </div>

            {/* Form Skeleton */}
            <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl space-y-4">
                <div className="h-4 bg-zinc-200 rounded-full w-1/4 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-10 bg-zinc-100 rounded-xl w-full"></div>
                    <div className="h-24 bg-zinc-100 rounded-xl w-full"></div>
                    <div className="h-12 bg-zinc-300 rounded-xl w-full"></div>
                </div>
            </div>

            {/* Ideas List Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white border border-zinc-100 rounded-2xl">
                        {/* Upvote box */}
                        <div className="w-14 h-16 bg-zinc-50 rounded-xl border border-zinc-100 flex-shrink-0"></div>
                        {/* Content lines */}
                        <div className="flex-1 space-y-3 py-1">
                            <div className="h-4 bg-zinc-200 rounded-full w-3/4"></div>
                            <div className="h-3 bg-zinc-100 rounded-full w-full"></div>
                            <div className="h-3 bg-zinc-100 rounded-full w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Watermark Skeleton */}
            <div className="flex justify-center">
                <div className="h-3 bg-zinc-100 rounded-full w-24"></div>
            </div>
        </div>
    );
}

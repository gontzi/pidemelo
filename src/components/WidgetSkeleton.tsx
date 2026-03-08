'use client';

import { usePathname, useSearchParams } from 'next/navigation';

export default function WidgetSkeleton() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // We can confidently read these in 'use client' components inside Suspense
    const isDarkMode = searchParams.get('darkMode') === 'true';
    const isForm = pathname?.includes('/form');
    const isBoard = pathname?.includes('/board');

    // Dynamic classes based on theme
    const bgContainer = isDarkMode ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-900';
    const skeletonBg = isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100';
    const skeletonAccent = isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200';
    const border = isDarkMode ? 'border-zinc-800' : 'border-zinc-100';

    return (
        <div className={`animate-pulse min-h-screen p-4 flex flex-col ${bgContainer}`}>
            {isForm && (
                <div className="space-y-8 flex-1">
                    {/* Header Skeleton */}
                    <div className={`flex items-center justify-between pb-4 border-b ${border}`}>
                        <div className="space-y-3 w-full">
                            <div className={`h-7 ${skeletonAccent} rounded-full w-1/3`}></div>
                            <div className={`h-3 ${skeletonBg} rounded-full w-1/2`}></div>
                        </div>
                    </div>

                    {/* Form Skeleton */}
                    <div className={`${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-50/50'} border ${border} p-6 rounded-2xl space-y-4`}>
                        <div className={`h-4 ${skeletonAccent} rounded-full w-1/4 mb-6`}></div>
                        <div className="space-y-3">
                            <div className={`h-12 md:h-14 ${skeletonBg} rounded-2xl w-full`}></div>
                            <div className={`h-32 md:h-40 ${skeletonBg} rounded-2xl w-full`}></div>
                            <div className={`h-12 md:h-14 ${skeletonAccent} rounded-full w-full mt-4`}></div>
                        </div>
                    </div>
                </div>
            )}

            {isBoard && (
                <div className="space-y-6 flex-1">
                    {/* Board Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className={`h-8 ${skeletonAccent} rounded-full w-1/3`}></div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className={`h-11 ${skeletonBg} rounded-2xl w-full sm:w-64 border ${border}`}></div>
                            <div className={`h-11 ${skeletonBg} rounded-2xl min-w-[160px] border ${border}`}></div>
                        </div>
                    </div>

                    {/* Ideas List Skeleton */}
                    <div className="space-y-3 md:space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex gap-3 md:gap-5 p-4 md:p-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border ${border} rounded-2xl md:rounded-3xl`}>
                                {/* Upvote box */}
                                <div className={`w-14 md:w-16 h-18 md:h-20 ${skeletonBg} rounded-xl md:rounded-2xl border ${border} flex-shrink-0`}></div>
                                {/* Content lines */}
                                <div className="flex-1 space-y-3 py-1">
                                    <div className={`h-5 sm:h-6 ${skeletonAccent} rounded-full w-3/4 mb-2`}></div>
                                    <div className={`h-3 ${skeletonBg} rounded-full w-full`}></div>
                                    <div className={`h-3 ${skeletonBg} rounded-full w-5/6`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Si por algún motivo no detecta la ruta, mostramos un fallback genérico mínimo */}
            {!isForm && !isBoard && (
                <div className="space-y-6 flex-1">
                    {[1, 2].map((i) => (
                        <div key={i} className={`h-32 ${skeletonBg} rounded-2xl w-full`}></div>
                    ))}
                </div>
            )}

            {/* Watermark Skeleton */}
            <div className="flex justify-center mt-auto pt-8 opacity-50">
                <div className={`h-3 ${skeletonAccent} rounded-full w-32`}></div>
            </div>
        </div>
    );
}

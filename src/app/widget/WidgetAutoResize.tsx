'use client';

import { useEffect, useRef } from 'react';

export const RESIZE_MESSAGE = 'pidemelo:resize';

// Informa a la página anfitriona de la altura real del contenido para que el
// script del código de inserción ajuste el iframe (sin barras de scroll internas).
export default function WidgetAutoResize({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node || window.parent === window) return;

        let last = 0;
        const post = () => {
            const height = Math.ceil(node.getBoundingClientRect().height);
            if (height === last) return;
            last = height;
            window.parent.postMessage({ type: RESIZE_MESSAGE, height }, '*');
        };

        const observer = new ResizeObserver(post);
        observer.observe(node);
        post();
        return () => observer.disconnect();
    }, []);

    return <div ref={ref}>{children}</div>;
}

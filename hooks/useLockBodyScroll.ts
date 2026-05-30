'use client';

import { useEffect, useRef } from 'react';

/**
 * Prevents body scroll when `shouldLock` is true.
 * Uses a module-level counter to safely handle multiple overlays.
 * On iOS Safari, uses position: fixed to prevent background scrolling.
 */
let lockCount = 0;
let previousOverflow: string | null = null;
let previousPosition: string | null = null;
let previousWidth: string | null = null;
let previousTop: string | null = null;
let scrollYAtLock = 0;

function lock() {
    lockCount += 1;
    if (lockCount > 1) return; // already locked by another overlay

    const body = document.body;
    scrollYAtLock = window.scrollY;

    previousOverflow = body.style.overflow;
    previousPosition = body.style.position;
    previousWidth = body.style.width;
    previousTop = body.style.top;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = `-${scrollYAtLock}px`;
}

function unlock() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return; // another overlay is still open

    const body = document.body;

    body.style.overflow = previousOverflow ?? '';
    body.style.position = previousPosition ?? '';
    body.style.width = previousWidth ?? '';
    body.style.top = previousTop ?? '';

    window.scrollTo(0, scrollYAtLock);

    previousOverflow = null;
    previousPosition = null;
    previousWidth = null;
    previousTop = null;
    scrollYAtLock = 0;
}

/**
 * Hook to lock body scroll when an overlay/modal is open.
 * Prevents the background page from scrolling while the overlay is shown.
 *
 * @param shouldLock - Whether body scroll should be locked
 *
 * @example
 * ```tsx
 * const MyOverlay = ({ isOpen }) => {
 *     useLockBodyScroll(isOpen);
 *     if (!isOpen) return null;
 *     return <div className="fixed inset-0 ...">...</div>;
 * };
 * ```
 */
export function useLockBodyScroll(shouldLock: boolean) {
    const wasLocked = useRef(false);

    useEffect(() => {
        if (shouldLock) {
            lock();
            wasLocked.current = true;
        } else {
            wasLocked.current = false;
        }

        return () => {
            if (wasLocked.current) {
                unlock();
                wasLocked.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldLock]);
}

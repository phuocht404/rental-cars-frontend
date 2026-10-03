'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Thanh tiến trình mảnh ở đầu trang khi chuyển trang: bắt đầu ngay lúc bấm link nội bộ,
 * chạy hết khi URL đã đổi. Cho người dùng phản hồi tức thì kể cả khi trang mới cần tải dữ liệu.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}?${searchParams.toString()}`;

  // URL tại thời điểm bấm link. Còn bằng URL hiện tại = đang tải; khác = đã chuyển xong
  const [startedFrom, setStartedFrom] = useState<string | null>(null);
  const loading = startedFrom === currentUrl;
  const done = startedFrom !== null && !loading;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

      if (sameOrigin && !samePage) {
        const from = `${window.location.pathname}?${window.location.search.replace(/^\?/, '')}`;
        setStartedFrom(from);
        // Điều hướng bị huỷ/chuyển về chính trang này thì không để thanh treo mãi
        setTimeout(() => setStartedFrom((current) => (current === from ? null : current)), 10_000);
      }
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden"
      style={{
        opacity: loading ? 1 : 0,
        // Khi xong: chạy hết thanh rồi mới mờ dần
        transition: done ? 'opacity 300ms ease 200ms' : 'opacity 150ms',
      }}
      onTransitionEnd={(event) => {
        if (done && event.propertyName === 'opacity') setStartedFrom(null);
      }}
    >
      <div
        className="h-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.7)]"
        style={{
          width: loading ? '80%' : done ? '100%' : '0%',
          transition: loading ? 'width 8s cubic-bezier(0.1, 0.7, 0.2, 1)' : done ? 'width 200ms ease-out' : 'none',
        }}
      />
    </div>
  );
}

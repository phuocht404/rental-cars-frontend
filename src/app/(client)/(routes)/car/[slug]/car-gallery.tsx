'use client';

import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CarGalleryProps {
  images: string[];
  name: string;
}

/**
 * Desktop: ảnh lớn + 3 ảnh nhỏ cùng chiều cao. Mobile: vuốt ngang có số thứ tự.
 * Bấm vào ảnh bất kỳ để mở trình xem toàn màn hình (phím ←/→, Esc).
 */
const CarGallery = ({ images, name }: CarGalleryProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const open = (index: number) => setViewerIndex(index);
  const step = useCallback(
    (delta: number) => setViewerIndex((current) => (current === null ? null : (current + delta + total) % total)),
    [total],
  );

  useEffect(() => {
    if (viewerIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIndex, step]);

  // Chỉ cập nhật state khi sang ảnh khác (không cập nhật theo từng pixel cuộn)
  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== slide) setSlide(index);
  };

  if (total === 0) return null;

  return (
    <>
      {/* Desktop / tablet */}
      <div className="grid h-[460px] grid-cols-[2fr_1fr] grid-rows-3 gap-3 lg:h-[380px] md:hidden">
        <div className="relative row-span-3 overflow-hidden rounded-2xl bg-muted">
          <button
            type="button"
            onClick={() => open(0)}
            className="group absolute inset-0"
            aria-label={`Xem ảnh lớn xe ${name}`}
          >
            <Image
              src={images[0]}
              alt={`Xe ${name}`}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 66vw, 900px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>

          {total > 1 && (
            <button
              type="button"
              onClick={() => open(0)}
              className="absolute bottom-3 left-3 flex h-9 items-center gap-2 rounded-full bg-background/90 px-4 text-sm font-medium shadow backdrop-blur transition hover:bg-background"
            >
              <ImageIcon size={16} aria-hidden />
              Xem {total} ảnh
            </button>
          )}
        </div>

        {images.slice(1, 4).map((image, index) => (
          <button
            type="button"
            key={image}
            onClick={() => open(index + 1)}
            className="group relative overflow-hidden rounded-2xl bg-muted"
            aria-label={`Xem ảnh ${index + 2}`}
          >
            <Image
              src={image}
              alt={`Xe ${name} - ảnh ${index + 2}`}
              fill
              sizes="(max-width: 1024px) 33vw, 440px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {index === 2 && total > 4 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-semibold text-white">
                +{total - 4} ảnh
              </span>
            )}
          </button>
        ))}

      </div>

      {/* Mobile: vuốt ngang */}
      <div className="relative -mx-4 hidden md:block">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={image}
              onClick={() => open(index)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-muted"
              aria-label={`Xem ảnh ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Xe ${name} - ảnh ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <span className="absolute bottom-3 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {slide + 1}/{total}
        </span>
      </div>

      {/* Trình xem toàn màn hình */}
      <Dialog open={viewerIndex !== null} onOpenChange={(value) => !value && setViewerIndex(null)}>
        <DialogContent className="flex h-[100dvh] max-h-none w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-none bg-black/95 p-0 text-white md:p-0 [&>button:last-child]:hidden">
          <DialogTitle className="sr-only">Ảnh xe {name}</DialogTitle>
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              {(viewerIndex ?? 0) + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => setViewerIndex(null)}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label="Đóng"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative flex-1">
            {viewerIndex !== null && (
              <Image
                key={images[viewerIndex]}
                src={images[viewerIndex]}
                alt={`Xe ${name} - ảnh ${viewerIndex + 1}`}
                fill
                sizes="100vw"
                className="animate-in fade-in object-contain duration-200"
              />
            )}
            {total > 1 && (
              <>
                <ViewerArrow side="left" onClick={() => step(-1)} />
                <ViewerArrow side="right" onClick={() => step(1)} />
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3">
            {images.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setViewerIndex(index)}
                aria-label={`Ảnh ${index + 1}`}
                aria-current={index === viewerIndex}
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-md opacity-50 transition-opacity hover:opacity-90',
                  index === viewerIndex && 'opacity-100 ring-2 ring-white',
                )}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ViewerArrow = ({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={side === 'left' ? 'Ảnh trước' : 'Ảnh sau'}
    className={cn(
      'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20',
      side === 'left' ? 'left-4' : 'right-4',
    )}
  >
    {side === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
  </button>
);

export default CarGallery;

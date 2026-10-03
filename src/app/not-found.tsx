import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="text-8xl font-bold tracking-tight text-primary">404</p>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
        <p className="max-w-[40ch] text-muted-foreground">
          Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex h-11 items-center whitespace-nowrap rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        Về trang chủ
      </Link>
    </div>
  );
}

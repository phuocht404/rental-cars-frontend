'use client';

import {
  BaggageClaim,
  Car,
  LayoutDashboard,
  LogOut,
  Users,
  ScanBarcode,
  Caravan,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const menuAdmin = [
  {
    icon: <LayoutDashboard className="h-4 w-4 " />,
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    icon: <Users className="h-4 w-4" />,
    title: 'Người dùng',
    href: '/admin/users',
  },
  {
    icon: <Car className="h-4 w-4" />,
    title: 'Xe',
    href: '/admin/cars',
  },
  {
    icon: <BaggageClaim className="h-4 w-4" />,
    title: 'Đơn hàng',
    href: '/admin/orders',
  },
];

const menuRegistration = [
  {
    icon: <Caravan className="h-4 w-4" />,
    title: 'Đăng ký xe',
    href: '/admin/car-registration',
  },
  {
    icon: <ScanBarcode className="h-4 w-4" />,
    title: 'Đăng ký chủ xe',
    href: '/admin/owner-registration',
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    toast.info('Đã đăng xuất!!!');
    window.location.assign(new URL('/signin', window.location.origin).href);
  };

  return (
    <div
      className={cn(
        'sticky left-0 right-0 top-0 z-40 min-w-[183px] bg-white pb-12 text-gray-500 shadow-xl dark:bg-black' +
          ' lg:min-w-fit' +
          ' lg:w-auto',
        className,
      )}
    >
      <div className="h-full space-y-4 py-4">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-primary lg:hidden">
            Rental Cars
          </h1>
        </div>

        <div className="h-full px-3 py-2">
          <div className="flex h-full flex-col items-start justify-between">
            <div>
              <div className="w-full">
                <h2 className="mb-2 px-6 text-lg font-semibold tracking-tight lg:hidden">
                  Dashboard
                </h2>
                <div className="space-y-1 rounded">
                  {menuAdmin.map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={cn(
                        'flex items-center justify-start gap-2 rounded px-4 py-3 transition-colors duration-200' +
                          ' hover:bg-primary/5 active:scale-95 dark:hover:bg-primary/20',
                        pathname.startsWith(item.href) &&
                          'bg-primary/20 text-blue-600 hover:bg-primary/40 dark:hover:bg-primary/50',
                      )}
                    >
                      {item.icon}
                      <span className="text-sm font-medium lg:hidden">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 w-full">
                <h2 className="mb-2 px-6 text-lg font-semibold tracking-tight lg:hidden">
                  Yêu cầu
                </h2>
                <div className="space-y-1 rounded">
                  {menuRegistration.map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={cn(
                        'flex items-center justify-start gap-2 rounded px-4 py-3 transition-colors duration-200' +
                          ' hover:bg-primary/5 active:scale-95 dark:hover:bg-primary/20',
                        pathname.startsWith(item.href) &&
                          'bg-primary/20 text-blue-600 hover:bg-primary/40 dark:hover:bg-primary/50',
                      )}
                    >
                      {item.icon}
                      <span className="text-sm font-medium lg:hidden">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full">
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-50 lg:w-auto dark:bg-black"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 rotate-180 text-black dark:text-white" />
                <p className="ml-1 lg:hidden">Đăng xuất</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

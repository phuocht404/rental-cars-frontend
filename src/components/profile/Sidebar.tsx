'use client';

import {
  CarFront,
  Heart,
  ListOrdered,
  LockKeyhole,
  LogOut,
  Map,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { CookiesStorage } from '@/config/cookie';
import { cn } from '@/lib/utils';
import { logout } from '@/stores/reducers/authReducer';
import { setDependence } from '@/stores/reducers/depReducer';

const ProfileMenu: { icon: ReactElement; href: string; label: string }[] = [
  {
    icon: <User size={24} />,
    href: '/profile',
    label: 'Tài khoản của tôi',
  },
  {
    icon: <Map size={24} />,
    href: '/mytrips',
    label: 'Lịch sử thuê xe',
  },
  {
    icon: <LockKeyhole size={24} />,
    href: '/resetpw',
    label: 'Đổi mật khẩu',
  },
];

const Sidebar = ({ className }: { className?: string }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string>('');
  const [menu, setMenu] = useState<any[]>(ProfileMenu);

  useEffect(() => {
    const userInfo: any = JSON.parse(localStorage.getItem('user') || '{}');
    if (userInfo) {
      setUsername(userInfo?.username);

      if (userInfo.role && userInfo?.role === 'CAROWNER') {
        setMenu([
          ...ProfileMenu,
          {
            icon: <CarFront size={24} />,
            href: '/mycars',
            label: 'Xe của tôi',
          },
          {
            icon: <ListOrdered size={24} />,
            href: '/myorders',
            label: 'Đơn đặt xe',
          },
        ]);
      }
    }
  }, []);

  const handleLogout = () => {
    // clear local storage
    localStorage.removeItem('user');

    // clear redux store
    dispatch(logout());
    dispatch(setDependence({}));

    // clear cookie storage
    CookiesStorage.clearAllCookies();

    setIsLogged(false);

    router.push('/');
    toast.info('Đã đăng xuất!!!');
  };

  return (
    <aside
      className={cn(
        'flex flex-col gap-6 rounded-2xl border border-border bg-card p-4 lg:p-3',
        className,
      )}
    >
      <h2 className="px-2 text-xl font-bold">Xin chào {username}!</h2>

      <nav
        aria-label="Tài khoản"
        className="flex flex-col gap-1 lg:flex-row lg:overflow-x-auto"
      >
        {menu.map(({ icon, href, label }) => {
          const active = href === '/' + pathname.split('/')[1];

          return (
            <Link
              href={href}
              key={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 whitespace-nowrap rounded-lg border-l-4 px-3 py-3 text-sm transition-colors lg:border-l-0',
                active
                  ? 'border-primary bg-primary/10 font-semibold text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <Button
        variant="outline"
        className="w-full justify-start gap-3 px-3 text-sm font-normal"
        onClick={handleLogout}
        isLoading={isLogged}
      >
        <LogOut size={20} className="rotate-180" />
        Đăng xuất
      </Button>
    </aside>
  );
};

export default Sidebar;

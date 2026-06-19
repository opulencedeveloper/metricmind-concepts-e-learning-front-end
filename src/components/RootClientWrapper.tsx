'use client';

import { Provider } from 'react-redux';
import store from '@/store/redux';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';
import { useHttp } from '@/hooks/useHttp';
import { getAuthToken } from '@/lib/utils/auth';
import { HttpMethod } from '@/types/http';

interface RootClientWrapperProps {
  children: ReactNode;
}

// Inner component to initialize wishlist after Provider is set up
function WishlistInitializer({ children }: { children: ReactNode }) {
  const { isFetched, setWishlist, setLoading } = useWishlist();
  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    // Only fetch if not already fetched and user is authenticated
    if (!isFetched && getAuthToken()) {
      let retryCount = 0;
      const maxRetries = 5;
      let retryTimeoutId: NodeJS.Timeout;

      const fetchWishlist = async () => {
        console.log('[WISHLIST_INIT] Fetching wishlist...');
        setLoading(true);

        await sendHttpRequest({
          requestConfig: {
            method: HttpMethod.GET,
            url: '/student/wishlist',
            isAuth: true,
          },
          successRes: (data: any) => {
            console.log('[WISHLIST_INIT] Success! Loaded', data.data?.length || data.wishlist?.length || 0, 'courses');
            setWishlist(data.data || data.wishlist || []);
            setLoading(false);
          },
          errorRes: (err: any) => {
            retryCount++;
            console.log('[WISHLIST_INIT] Error:', err);
            if (retryCount < maxRetries) {
              // Exponential backoff: 1s, 2s, 4s, 8s, 16s
              const delayMs = Math.pow(2, retryCount - 1) * 1000;
              console.log(`[WISHLIST_INIT] Retry ${retryCount}/${maxRetries} in ${delayMs}ms`);
              retryTimeoutId = setTimeout(fetchWishlist, delayMs);
            } else {
              // Max retries exceeded - fail silently, don't set error
              console.log('[WISHLIST_INIT] Max retries exceeded, gave up silently');
              setLoading(false);
            }
          },
        });
      };

      fetchWishlist();

      // Cleanup timeout on unmount
      return () => {
        if (retryTimeoutId) clearTimeout(retryTimeoutId);
      };
    }
  }, [isFetched, setWishlist, setLoading, sendHttpRequest]);

  return <>{children}</>;
}

export default function RootClientWrapper({ children }: RootClientWrapperProps) {
  const pathname = usePathname()
  const isDashboardPage = pathname.startsWith('/student-dashboard')

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <WishlistInitializer>
          <div className="flex flex-col min-h-screen">
            {!isDashboardPage && <Header />}
            <main className={`flex-1 ${!isDashboardPage ? 'pt-16' : ''}`}>
              {children}
            </main>
            {!isDashboardPage && <Footer />}
          </div>
        </WishlistInitializer>
      </ErrorBoundary>
    </Provider>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const router = useRouter();

  // Auto-retry mechanism mỗi 8 giây
  useEffect(() => {
    if (!autoRetryEnabled) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRetry();
          return 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRetryEnabled]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      reset();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleManualRetry = () => {
    setAutoRetryEnabled(false);
    handleRetry();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Không thể tải sản phẩm
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-2">Đã xảy ra lỗi khi tải thông tin sản phẩm.</p>
            <p className="text-sm text-gray-500">
              {error.message || 'Vui lòng thử lại sau ít phút.'}
            </p>
          </div>

          {autoRetryEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  Tự động thử lại sau {countdown} giây
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleManualRetry}
              disabled={isRetrying}
              className="w-full"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Đang thử lại...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Thử lại ngay
                </>
              )}
            </Button>

            <Button 
              onClick={goHome}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>

            {autoRetryEnabled && (
              <Button 
                onClick={() => setAutoRetryEnabled(false)}
                variant="ghost"
                className="w-full text-gray-500"
                size="sm"
              >
                Tắt tự động thử lại
              </Button>
            )}
          </div>

          {error.digest && (
            <div className="text-xs text-gray-400 text-center border-t pt-3">
              Mã lỗi: {error.digest}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
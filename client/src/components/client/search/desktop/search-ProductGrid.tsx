"use client";

import { ClientProduct } from '@/types/client.products.interface';
import ProductItem from '@/components/ui/product-component/product-Item';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useProductsContext } from '../context/ProductsContext';
import { useSearchParams } from 'next/navigation';

interface SearchProductGridProps {
  categoryId?: string | null;
}

export default function SearchProductGrid({ categoryId }: SearchProductGridProps) {
  // Lấy search query từ URL để đảm bảo re-render khi thay đổi
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Ghi log để debug
  console.log("SearchProductGrid rendering with:", { categoryId, searchQuery });
  
  // Sử dụng ProductsContext để lấy dữ liệu
  const { 
    products, 
    metadata, 
    isLoading, 
    isError, 
    error, 
    currentPage,
    handlePageChange,
    paginationData
  } = useProductsContext();

  const { totalPages, hasNextPage, hasPrevPage } = paginationData;

  console.log(" check: ", products)

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10).fill(null).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (isError) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Hiển thị khi không có sản phẩm
  if (products.length === 0 && !isLoading) {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('q');
    
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-black text-lg mb-2">
          {searchQuery 
            ? `Không tìm thấy kết quả nào cho từ khóa "${searchQuery}"` 
            : categoryId 
              ? "Không tìm thấy sản phẩm nào trong danh mục này" 
              : "Không tìm thấy sản phẩm nào"}
        </div>
      </div>
    );
  }

  // Function để hiển thị danh sách trang
  const renderPaginationItems = () => {
    // Nếu chỉ có 1 trang, không hiển thị phân trang
    if (totalPages <= 1) return null;
    
    const items = [];
    
    // Hiển thị max 5 trang và sử dụng "..." cho các trang khác
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;
    
    if (totalPages > maxVisiblePages) {
      // Tính toán startPage và endPage để hiển thị 5 trang xung quanh trang hiện tại
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // Gần đầu: hiển thị 1 -> maxVisiblePages
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // Gần cuối: hiển thị (totalPages - maxVisiblePages + 1) -> totalPages
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        // Ở giữa: hiển thị (currentPage - halfVisible) -> (currentPage + halfVisible)
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }
    
    // Hiển thị trang đầu tiên nếu cần
    if (startPage > 1) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink 
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Hiển thị dấu "..." nếu không bắt đầu từ trang 2
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Hiển thị các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Hiển thị trang cuối cùng nếu cần
    if (endPage < totalPages) {
      // Hiển thị dấu "..." nếu không kết thúc ở trang gần cuối
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Hiển thị danh sách sản phẩm và phân trang
  return (
    <div className="space-y-8">
      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: ClientProduct) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      
      {/* Phân trang */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {/* Nút Previous */}
            {hasPrevPage && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)} 
                />
              </PaginationItem>
            )}
            
            {/* Danh sách trang */}
            {renderPaginationItems()}
            
            {/* Nút Next */}
            {hasNextPage && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
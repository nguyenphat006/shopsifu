"use client";

import { useRef } from 'react';
// @ts-ignore
import Barcode from 'react-barcode';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductColumn } from './useProducts';
import { QrCode, Download, Printer } from 'lucide-react';

interface ProductModalBarcodeProps {
  product: ProductColumn | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModalBarcode({ product, isOpen, onClose }: ProductModalBarcodeProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  // Tạo barcode ngắn từ ID sản phẩm
  const barcodeValue = product.id.toString().padStart(6, '0');

  const handleDownload = () => {
    if (barcodeRef.current) {
      const svg = barcodeRef.current.querySelector('svg');
      if (svg) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          
          const link = document.createElement('a');
          link.download = `barcode-${product.id}.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        
        img.src = url;
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && barcodeRef.current) {
      const barcodeContent = barcodeRef.current.innerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode - ${product.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0;
                background: white;
              }
              .barcode-container { 
                text-align: center; 
                padding: 20px;
                border: 1px solid #ddd;
              }
              .product-info { 
                margin-top: 15px; 
                font-size: 14px; 
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <h3>Mã vạch sản phẩm</h3>
              ${barcodeContent}
              <div class="product-info">
                <strong>${product.name}</strong><br>
                ID: ${product.id}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
   <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="w-auto max-w-[90vw] sm:max-w-lg max-h-[90vh] overflow-hidden">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <QrCode className="h-5 w-5" />
        Mã vạch sản phẩm
      </DialogTitle>
      <DialogDescription>
        Mã vạch được tạo từ ID sản phẩm: {product.id}
      </DialogDescription>
    </DialogHeader>
    
    <div className="flex flex-col items-center space-y-4 py-6 overflow-hidden">
      {/* Barcode container with proper sizing */}
      <div 
        className="bg-white p-4 border rounded-lg shadow-sm w-full max-w-full overflow-hidden flex justify-center" 
        ref={barcodeRef}
      >
        <div className="max-w-full overflow-hidden flex justify-center">
          <Barcode 
            value={barcodeValue}
            width={1}                // giảm width để tránh tràn
            height={60}              // giảm height cho phù hợp
            fontSize={12}            // giảm font size
            background="white"
            lineColor="black"
            margin={5}               // thêm margin nhỏ
            displayValue={true}      // hiển thị giá trị
          />
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600 space-y-1 w-full px-2">
        <div className="font-semibold text-base break-words">{product.name}</div>
        <div className="break-all">ID: {product.id}</div>
        <div>Giá: {new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(product.price || 0)}</div>
      </div>
    </div>
    
    <div className="flex flex-wrap justify-center gap-2 pt-4">
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />
        Tải xuống
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        In
      </Button>
      <Button onClick={onClose}>
        Đóng
      </Button>
    </div>
  </DialogContent>
</Dialog>
  );
}

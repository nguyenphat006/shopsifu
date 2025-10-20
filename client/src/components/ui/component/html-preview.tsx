"use client";

import React from "react";
import DOMPurify from "dompurify";

interface HTMLPreviewProps {
  content?: string;
  className?: string;
}

/**
 * Component hiển thị nội dung HTML một cách an toàn
 * Sử dụng DOMPurify để làm sạch HTML trước khi render
 */
export default function HTMLPreview({ content, className = "" }: HTMLPreviewProps) {
  // Nếu không có nội dung, trả về null
  if (!content) return null;

  // Chuyển đổi ký tự xuống dòng thành thẻ <br> để hiển thị đúng trên HTML
  const formattedContent = content.replace(/\n/g, '<br />');

  // Làm sạch HTML để ngăn chặn XSS
  const sanitizedContent = DOMPurify.sanitize(formattedContent, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "strong", "em", 
      "u", "s", "blockquote", "ul", "ol", "li", "a", "img", "hr",
      "table", "thead", "tbody", "tr", "th", "td", "span", "div"
    ],
    ALLOWED_ATTR: [
      "href", "target", "src", "alt", "title", "width", "height", 
      "style", "class", "id", "name"
    ]
  });

  return (
    <div 
      className={`product-description prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

import React from 'react';

// Dữ liệu có cấu trúc (schema.org) giúp Google hiểu nội dung trang và hiển thị rich result
const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    // Escape "<" để nội dung do người dùng nhập không thể đóng thẻ script
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);

export default JsonLd;

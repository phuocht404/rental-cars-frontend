import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      // Import thừa được xoá tự động khi chạy `eslint --fix`
      'unused-imports/no-unused-imports': 'warn',
      // Hooks phải được gọi đúng quy tắc, nếu không sẽ gây lỗi khó tìm khi render
      'react-hooks/rules-of-hooks': 'error',
      // Các rule mới của React Compiler: giữ ở mức cảnh báo để sửa dần
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'next-env.d.ts']),
]);

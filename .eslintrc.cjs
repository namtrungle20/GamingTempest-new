module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // Tắt lỗi yêu cầu import React trong mỗi file
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '19.2' } },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  rules: {
    // Nhóm React Refresh: Đảm bảo tính năng cập nhật nhanh không bị lỗi
    'react-refresh/only-export-components': 'warn', // Chỉ cho phép export component, không export biến phụ kèm theo

    // Nhóm React Hooks: Tránh các lỗi logic khi sử dụng Hook
    'react-hooks/rules-of-hooks': 'error', // Bắt buộc tuân thủ luật gọi Hook (không gọi trong if/vòng lặp)
    'react-hooks/exhaustive-deps': 'warn', // Cảnh báo khi thiếu biến trong mảng dependency của useEffect/useMemo

    // Nhóm Cấu hình React: Tắt các kiểm tra không cần thiết
    'react/prop-types': 0, // Tắt kiểm tra prop-types (hữu ích khi dùng TypeScript hoặc không cần check kiểu)
    'react/display-name': 0, // Không bắt buộc đặt tên hiển thị cho component (đỡ phiền khi dùng forwardRef)

    // Nhóm Clean Code: Loại bỏ code thừa và log dư
    'no-console': 1, // Cảnh báo khi để lại console.log (nên xóa trước khi build sản phẩm)
    'no-lonely-if': 1, // Không cho phép if nằm lẻ loi trong else, bắt gộp thành else if cho gọn
    'no-unused-vars': 1, // Cảnh báo khi khai báo biến mà không sử dụng
    'no-trailing-spaces': 1, // Không cho phép có khoảng trắng thừa ở cuối dòng
    'no-multi-spaces': 1, // Không cho phép dùng nhiều dấu cách liên tiếp
    'no-multiple-empty-lines': 1, // Không cho phép để quá nhiều dòng trống liên tiếp

    // Nhóm Định dạng (Format): Giúp code đẹp và nhất quán
    'space-before-blocks': ['error', 'always'], // Phải có khoảng cách trước dấu ngoặc nhọn {
    'object-curly-spacing': [1, 'always'], // Phải có khoảng cách bên trong dấu ngoặc nhọn object { name: 'Vite' }
    'indent': ['warn', 2], // Thụt đầu dòng chuẩn 2 khoảng trắng
    'semi': [1, 'never'], // Không sử dụng dấu chấm phẩy ở cuối câu (phong cách hiện đại)
    'quotes': ['error', 'single'], // Bắt buộc sử dụng dấu nháy đơn ' cho chuỗi
    'array-bracket-spacing': 1, // Kiểm soát khoảng cách bên trong dấu ngoặc vuông của mảng
    'linebreak-style': 0, // Tắt kiểm tra lỗi xuống dòng (tránh xung đột giữa Windows và MacOS/Linux)
    'no-unexpected-multiline': 'warn', // Cảnh báo những lỗi xuống dòng có thể gây hiểu lầm cho trình biên dịch
    'keyword-spacing': 1, // Phải có khoảng cách sau các từ khóa như if, else, return
    'comma-dangle': 1, // Kiểm soát dấu phẩy cuối cùng trong mảng/object (tránh lỗi khi git diff)
    'comma-spacing': 1, // Phải có khoảng cách sau dấu phẩy
    'arrow-spacing': 1 // Phải có khoảng cách quanh mũi tên hàm () => {}
  }
}
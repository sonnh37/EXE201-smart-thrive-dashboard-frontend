export const toSlug = (title: string): string => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Loại bỏ các dấu
        .replace(/đ/g, 'd')  // Thay thế "đ" bằng "d"
        .replace(/[^a-z0-9 ]/g, '')  // Loại bỏ các ký tự không phải chữ cái, số, hoặc khoảng trắng
        .replace(/\s+/g, '-')  // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/-+$/, '')  // Loại bỏ các dấu gạch ngang dư thừa ở cuối
        .trim();  // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
};
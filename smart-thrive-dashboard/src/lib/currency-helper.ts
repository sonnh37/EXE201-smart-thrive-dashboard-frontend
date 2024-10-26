export const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
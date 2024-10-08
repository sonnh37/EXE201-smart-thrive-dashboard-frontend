export const toSlug = (title: string): string => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+$/, '')
        .trim();
};
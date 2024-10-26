export const convertToISODate = (date: Date | null | undefined): string | null => {
    if (!date) return null;
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};
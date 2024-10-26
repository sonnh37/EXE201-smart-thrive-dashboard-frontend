export const formatTimeSpan = (time: string): string => {
    // Chia tách giờ và phút
    const [hours, minutes] = time.split(':');
  
    // Trả về định dạng "HH:mm:ss.ssssss"
    return `${hours}:${minutes}:00.0000000`;
  };
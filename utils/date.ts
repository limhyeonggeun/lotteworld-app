export function generateNext7Days(startDate: Date = new Date()) {
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
  
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekday = dayLabels[date.getDay()];
  
      return {
        id: `${i}`,
        label: `${day} ${weekday}`,
        fullLabel: `${month}. ${day} ${weekday}`,
        dateObj: date,
      };
    });
  }
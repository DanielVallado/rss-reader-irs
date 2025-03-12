export function FormatDate(dateString: string): string | undefined {
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) {
    return undefined;
  }

  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(dateObj);
  const month = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(dateObj);
  const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${weekdayCapitalized} ${day} de ${month} de ${year}`;
}

export default FormatDate;

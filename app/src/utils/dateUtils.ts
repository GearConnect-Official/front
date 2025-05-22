import { format, isToday, isYesterday, differenceInDays, isSameYear } from 'date-fns';

/**
 * Formate une date de publication selon les critères suivants :
 * - "Today" pour les posts d'aujourd'hui
 * - "Yesterday" pour les posts d'hier
 * - "X days ago" pour les posts jusqu'à 7 jours
 * - "M-D" (ex: "5-12") pour les posts de l'année en cours
 * - "YYYY-M-D" (ex: "2024-11-7") pour les posts des années précédentes
 */
export const formatPostDate = (date: Date | string): string => {
  const postDate = typeof date === 'string' ? new Date(date) : date;
  
  // Pour aujourd'hui
  if (isToday(postDate)) {
    return 'Today';
  }
  
  // Pour hier
  if (isYesterday(postDate)) {
    return 'Yesterday';
  }
  
  // Pour les 7 derniers jours
  const daysDifference = differenceInDays(new Date(), postDate);
  if (daysDifference > 0 && daysDifference <= 7) {
    return `${daysDifference} days ago`;
  }
  
  // Pour cette année (mais plus de 7 jours)
  if (isSameYear(postDate, new Date())) {
    return format(postDate, 'M-d');
  }
  
  // Pour les années précédentes
  return format(postDate, 'yyyy-M-d');
};

// Fonction pour déterminer si un post est d'aujourd'hui
export const isPostFromToday = (date: Date | string): boolean => {
  const postDate = typeof date === 'string' ? new Date(date) : date;
  return isToday(postDate);
}; 
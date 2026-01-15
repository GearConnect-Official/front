import { Event } from '../services/eventService';

export interface MissingInfo {
  trackCondition: boolean;
  eventResultsLink: boolean;
  seasonResultsLink: boolean;
  hasMissingInfo: boolean;
  missingCount: number;
}

/**
 * Vérifie quelles informations manquent pour un événement passé
 */
export const checkMissingEventInfo = (event: Event): MissingInfo => {
  const now = new Date();
  const eventDate = new Date(event.date);
  const isPast = eventDate < now;

  // Si l'événement n'est pas encore passé, pas besoin de vérifier
  if (!isPast) {
    return {
      trackCondition: false,
      eventResultsLink: false,
      seasonResultsLink: false,
      hasMissingInfo: false,
      missingCount: 0,
    };
  }

  const meteo = event.meteo || {};
  const missingTrackCondition = !meteo.trackCondition;
  const missingEventResultsLink = !meteo.eventResultsLink || meteo.eventResultsLink.trim() === '';
  const missingSeasonResultsLink = !meteo.seasonResultsLink || meteo.seasonResultsLink.trim() === '';

  const missingCount = 
    (missingTrackCondition ? 1 : 0) +
    (missingEventResultsLink ? 1 : 0) +
    (missingSeasonResultsLink ? 1 : 0);

  return {
    trackCondition: missingTrackCondition,
    eventResultsLink: missingEventResultsLink,
    seasonResultsLink: missingSeasonResultsLink,
    hasMissingInfo: missingCount > 0,
    missingCount,
  };
};

/**
 * Compte le nombre d'événements avec des informations manquantes
 */
export const countEventsWithMissingInfo = (events: Event[]): number => {
  return events.filter(event => {
    const missingInfo = checkMissingEventInfo(event);
    return missingInfo.hasMissingInfo;
  }).length;
};

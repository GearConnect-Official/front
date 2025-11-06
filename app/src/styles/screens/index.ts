// Screen styles organized by categories

// Common styles
export * from './common';

// User-related styles
export * from './user';

// Social features styles
export * from './social';

// Groups features styles
export * from './groups';

// Messages features styles
export * from './messages';

// Events features styles
export * from './events';

// Jobs features styles
export * from './jobs';

// Products features styles
export * from './products';

// Legacy exports for backward compatibility (deprecated - use category imports instead)
export { default as homeStyles } from './user/homeStyles';
export { default as postDetailStyles } from './social/postDetailStyles';
export { default as createEventStyles } from './events/createEventStyles';
export { default as favoritesStyles } from './social/favoritesStyles';
export { default as eventDetailStyles } from './events/eventDetailStyles';
export { default as welcomeStyles } from './user/welcomeStyles';
export { default as jobsStyles } from './jobs/jobsStyles';
export { default as loadingStyles } from './common/loadingStyles';
export { default as publicationStyles } from './social/publicationStyles';
export { default as friendRequestItemStyles } from './social/friendRequestItemStyles';
export { default as friendRequestStyles } from './social/friendRequestStyles';
export { default as createJobOfferStyles } from './jobs/createJobOfferStyles';
export { default as eventsStyles } from './events/eventsStyles';
export { default as messagesScreenStyles } from './messages/messagesScreenStyles';
export { default as conversationScreenStyles } from './messages/conversationScreenStyles';
export { default as newConversationScreenStyles } from './messages/newConversationScreenStyles';
export { default as groupsScreenStyles } from './groups/groupsScreenStyles';
export { default as groupDetailScreenStyles } from './groups/groupDetailScreenStyles';
export { default as groupChannelScreenStyles } from './groups/groupChannelScreenStyles';

// Default export to prevent Expo Router warnings
export { default } from '../../NoRoute'; 
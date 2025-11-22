// Icon Helper Utilities
// Provides consistent icon/emoji mapping for different entity types

export type IconCategory = 'activity' | 'meal' | 'hobby' | 'mood';

/**
 * Get icon/emoji for activity based on name
 */
export const getActivityIcon = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('run') || lowerName.includes('jog')) return '🏃';
  if (lowerName.includes('walk')) return '🚶';
  if (lowerName.includes('bike') || lowerName.includes('cycle')) return '🚴';
  if (lowerName.includes('swim')) return '🏊';
  if (lowerName.includes('gym') || lowerName.includes('workout')) return '💪';
  if (lowerName.includes('yoga')) return '🧘';
  if (lowerName.includes('dance')) return '💃';
  if (lowerName.includes('hike')) return '🥾';
  return '🏃';
};

/**
 * Get icon/emoji for meal type
 */
export const getMealIcon = (mealType: string): string => {
  const lowerType = mealType.toLowerCase();
  if (lowerType.includes('breakfast')) return '🌅';
  if (lowerType.includes('lunch')) return '☀️';
  if (lowerType.includes('dinner')) return '🌙';
  if (lowerType.includes('snack')) return '🍪';
  if (lowerType.includes('drink')) return '🥤';
  return '🍽️';
};

/**
 * Get icon/emoji for hobby based on name
 */
export const getHobbyIcon = (name: string): string => {
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('read') || lowerName.includes('book')) return '📚';
  if (lowerName.includes('music') || lowerName.includes('sing')) return '🎵';
  if (
    lowerName.includes('art') ||
    lowerName.includes('draw') ||
    lowerName.includes('paint')
  )
    return '🎨';
  if (lowerName.includes('game') || lowerName.includes('gaming')) return '🎮';
  if (lowerName.includes('photo') || lowerName.includes('camera'))
    return '📸';
  if (lowerName.includes('cook') || lowerName.includes('bake')) return '👨‍🍳';
  if (lowerName.includes('garden') || lowerName.includes('plant'))
    return '🌱';
  if (lowerName.includes('craft') || lowerName.includes('make')) return '✂️';
  if (lowerName.includes('write') || lowerName.includes('journal'))
    return '✍️';
  if (lowerName.includes('movie') || lowerName.includes('film')) return '🎬';
  return '🎨';
};

/**
 * Get icon/emoji for mood type
 */
export const getMoodEmoji = (moodType: string): string => {
  const lowerType = (moodType || '').toLowerCase();
  if (lowerType.includes('happy') || lowerType.includes('joy')) return '😀';
  if (lowerType.includes('excited')) return '🤩';
  if (lowerType.includes('relaxed') || lowerType.includes('calm')) return '😌';
  if (lowerType.includes('energetic')) return '⚡';
  if (lowerType.includes('grateful')) return '🙏';
  if (lowerType.includes('motivated')) return '🚀';
  if (lowerType.includes('okay') || lowerType.includes('neutral')) return '😐';
  if (lowerType.includes('tired')) return '😴';
  if (lowerType.includes('bored')) return '😑';
  if (lowerType.includes('focused')) return '🎯';
  if (lowerType.includes('sad')) return '😔';
  if (lowerType.includes('anxious') || lowerType.includes('worried'))
    return '😟';
  if (lowerType.includes('angry') || lowerType.includes('mad')) return '😡';
  if (lowerType.includes('stressed')) return '😣';
  if (lowerType.includes('lonely')) return '😞';
  if (lowerType.includes('overwhelmed')) return '😵';
  return '😊';
};

/**
 * Universal icon getter - routes to appropriate function based on category
 */
export const getIcon = (
  value: string,
  category: IconCategory
): string => {
  switch (category) {
    case 'activity':
      return getActivityIcon(value);
    case 'meal':
      return getMealIcon(value);
    case 'hobby':
      return getHobbyIcon(value);
    case 'mood':
      return getMoodEmoji(value);
    default:
      return '📝';
  }
};


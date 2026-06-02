export const getTmdbImageUrl = (path: string | null | undefined, size: 'poster' | 'backdrop' | 'profile' = 'poster') => {
  if (!path) return '/placeholder-image.jpg'; // We can use a fallback or return null
  
  if (size === 'poster') return `https://image.tmdb.org/t/p/w500${path}`;
  if (size === 'backdrop') return `https://image.tmdb.org/t/p/original${path}`;
  if (size === 'profile') return `https://image.tmdb.org/t/p/w185${path}`;
  
  return `https://image.tmdb.org/t/p/w500${path}`;
};

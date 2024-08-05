// actions.js
export const addFavorite = (playlist) => ({
  type: 'ADD_FAVORITE',
  payload: playlist,
});

export const removeFavorite = (playlistId) => ({
  type: 'REMOVE_FAVORITE',
  payload: playlistId,
});

export const addFavoriteTrack = (track) => ({
  type: 'ADD_FAVORITE_TRACK',
  payload: track,
});

export const removeFavoriteTrack = (trackId) => ({
  type: 'REMOVE_FAVORITE_TRACK',
  payload: trackId,
});

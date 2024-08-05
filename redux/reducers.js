// reducers.js
const initialState = {
  favorites: [],
  favoriteTracks: [],
  favoritePlaylists: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter(
          (playlist) => playlist.id !== action.payload
        ),
      };
    case "ADD_FAVORITE_TRACK":
      return {
        ...state,
        favoriteTracks: [...state.favoriteTracks, action.payload],
      };
    case "REMOVE_FAVORITE_TRACK":
      return {
        ...state,
        favoriteTracks: state.favoriteTracks.filter(
          (track) => track.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default rootReducer;

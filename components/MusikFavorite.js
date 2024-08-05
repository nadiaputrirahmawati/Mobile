import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MusikFavorite = ({ navigation }) => {
  const favorites = useSelector((state) => state.favorites || []);
  const favoriteTracks = useSelector((state) => state.favoriteTracks || []);
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);

  const handlePlaylistPress = (playlist) => {
    navigation.navigate('PlaylistDetail', { playlist });
  };

  const handleRemoveFavoriteTrack = (trackId) => {
    dispatch({ type: 'REMOVE_FAVORITE_TRACK', payload: trackId });
  };

  const renderPlaylistItem = ({ item }) => {
    if (!item || !item.images) return null;

    return (
      <TouchableOpacity onPress={() => handlePlaylistPress(item)} style={styles.playlistContainer}>
        {item.images.length > 0 && (
          <Image source={{ uri: item.images[0].url }} style={styles.playlistImage} />
        )}
        <Text style={styles.playlistName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderTrackItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Detail', { track: item })} 
      style={styles.trackContainer}
    >
      <Image source={{ uri: item.album.images[0]?.url }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.artists.map(artist => artist.name).join(', ')}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFavoriteTrack(item.id)} style={styles.loveButton}>
        <Ionicons name="heart" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 && (
        <>
          <Text style={styles.title}>Favorite Playlist</Text>
          <View style={styles.playlistWrapper}>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id}
              horizontal={true}
              renderItem={renderPlaylistItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playlistList}
            />
            {showAll && (
              <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                horizontal={true}
                renderItem={renderPlaylistItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.playlistList}
              />
            )}
          </View>
        </>
      )}
      {favoriteTracks.length > 0 && (
        <>
          <Text style={styles.title_lagu}>Favorite Music</Text>
          <FlatList
            data={favoriteTracks}
            keyExtractor={(item) => item.id}
            renderItem={renderTrackItem}
            contentContainerStyle={styles.flatListContent}
          />
        </>
      )}
      {favorites.length === 0 && favoriteTracks.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tidak Ada Daftar Playlist atau Lagu Favorite.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  title_lagu: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 30,
    marginBottom: 10,
  },
  playlistWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playlistList: {
    flexGrow: 0,
  },
  playlistContainer: {
    marginRight: 15,
    width: 100,
    alignItems: 'center',
  },
  playlistImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loveButton: {
    padding: 10,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  flatListContent: {
    // Custom styling if needed
  },
});

export default MusikFavorite;

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/actions';
import { getAccessToken } from '../konfigurasi_api'; 

const PlaylistDetail = ({ route, navigation }) => {
  const { playlist } = route.params;
  const [tracks, setTracks] = useState([]);
  const [tokenAkses, setTokenAkses] = useState('');
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const isFavorite = favorites.some(fav => fav.id === playlist.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        setTokenAkses(token);
        fetchTracks(token);
      } catch (error) {
        console.error('Error getting access token', error);
      }
    };

    fetchData();
  }, [playlist.id]);

  const fetchTracks = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, options);
      const data = await response.json();
      setTracks(data.items);
    } catch (error) {
      console.error('Error fetching playlist tracks', error);
    }
  };

  const handleRemoveFavorite = (playlistId) => {
    dispatch(removeFavorite(playlistId));
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      handleRemoveFavorite(playlist.id); // Pastikan ID playlist dikirim dengan benar
    } else {
      dispatch(addFavorite(playlist));
    }
  };

  const TrackItem = ({ track }) => (
    <TouchableOpacity style={styles.trackItem} onPress={() => navigation.navigate('Detail', { track })}>
      <Image source={{ uri: track.album.images[0]?.url }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>{track.name}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artists.map(artist => artist.name).join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: playlist.images[0]?.url }} style={styles.playlistImage} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{playlist.name}</Text>
          <Text style={styles.playlistDescription}>{playlist.description || 'No description available'}</Text>
          <Text style={styles.trackCount}>{`${playlist.tracks.total} Songs`}</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite} >
            <Icon name={isFavorite ? 'heart' : 'heart-o'} size={30} color={isFavorite ? '#FF0303' : '#666'} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.track.id}
        renderItem={({ item }) => <TrackItem track={item.track} />}
        contentContainerStyle={styles.flatListContent}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 10,
    borderBottomColor: '#f5f5f5',
  },
  playlistImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 6,
    marginBottom: 2,
  },
  playlistDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  trackCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
    marginBottom: 3,
  },
  favoriteButton: {
    marginTop: 2,
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
  trackItem: {
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
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#666',
    fontSize: 14,
  },
});

export default PlaylistDetail;

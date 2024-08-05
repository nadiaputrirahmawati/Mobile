import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
// import konfigurasi api untuk mengambil data api
import { getAccessToken } from '../konfigurasi_api'; 


// navigation ini merupakan props 
const Home = ({ navigation }) => {
  const [playlists, setPlaylists] = useState([]);
  const [tokenAkses, setTokenAkses] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = await getAccessToken();
        setTokenAkses(token);
        
        const options = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };

        const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists`, options);
        const data = await response.json();
        setPlaylists(data.playlists.items);
      } catch (error) {
        console.error('Eror Tidak Mendapatkan Data Playlist', error);
      }
    };

    fetchPlaylists();
  }, []);

  const PlaylistItem = ({ playlist }) => (
    <TouchableOpacity 
      style={styles.playlistItem} 
      onPress={() => navigation.navigate('PlaylistDetail', { playlist })}>
      <Image source={{ uri: playlist.images[0]?.url }} style={styles.playlistImage} />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName} numberOfLines={1}>{playlist.name}</Text>
        <Text style={styles.playlistDescription} numberOfLines={1}>{playlist.description || 'No description'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Featured Playlist</Text>
        <Text style={styles.sectionTitle}>Playlists</Text>
        <View style={styles.playlistGrid}>
          {(showAll ? playlists : playlists.slice(0, 4)).map((playlist) => (
            <PlaylistItem key={playlist.id} playlist={playlist} />
          ))}
        </View>
        <TouchableOpacity 
          style={styles.seeAllButton} 
          onPress={() => setShowAll(!showAll)} 
        >
          <Text style={styles.seeAllButtonText}>{showAll ? 'Show less' : 'See all playlists'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlistItem: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  playlistInfo: {
    padding: 10,
  },
  playlistName: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistDescription: {
    color: '#666666',
    fontSize: 14,
  },
  seeAllButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  seeAllButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Home;

import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteTrack, removeFavoriteTrack } from '../redux/actions';
import { getAccessToken } from '../konfigurasi_api';

const SearchMusik = ({ navigation }) => {
  const [pencarian, setPencarian] = useState('');
  const [lagu, setLagu] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState('tracks');
  const [tokenAkses, setTokenAkses] = useState('');
  const [hasilPencarian, setHasilPencarian] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favoriteTracks);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessToken();
        setTokenAkses(token);
      } catch (error) {
        console.error('Error fetching access token', error);
      }
    };

    fetchToken();
  }, []);

  const cari = async () => {
    if (!pencarian.trim()) return;

    const opsiPencarian = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + tokenAkses
      }
    };

    try {
      const respon = await fetch(`https://api.spotify.com/v1/search?q=${pencarian}&type=track,playlist`, opsiPencarian);
      const data = await respon.json();
      setLagu(data.tracks.items);
      setPlaylists(data.playlists.items);
      setHasilPencarian(true);
    } catch (error) {
      console.error('Error searching', error);
    }
  };

  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id);
  };

  const toggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      dispatch(removeFavoriteTrack(item.id));
    } else {
      dispatch(addFavoriteTrack(item));
    }
  };



  const renderTrackItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { track: item })}
        style={styles.trackInfo}
      >
        {item.album.images && item.album.images[0] && (
          <Image source={{ uri: item.album.images[0].url }} style={styles.itemImage} />
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.artists[0].name}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Icon name={isFavorite(item) ? 'heart' : 'heart-o'} size={24} color={isFavorite(item) ? 'red' : 'grey'} />
      </TouchableOpacity>
    </View>
  );

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PlaylistDetail', { playlist: item })}
      style={styles.itemContainer}
    >
      {item.images && item.images[0] && (
        <Image source={{ uri: item.images[0].url }} style={styles.itemImage} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.owner.display_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Cari lagu atau playlist"
            value={pencarian}
            onChangeText={setPencarian}
          />
          <TouchableOpacity style={styles.searchButton} onPress={cari}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tracks' && styles.activeTab]}
            onPress={() => setActiveTab('tracks')}
          >
            <Text style={[styles.tabText, activeTab === 'tracks' && styles.activeTabText]}>Lagu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
            onPress={() => setActiveTab('playlists')}
          >
            <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>Playlist</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'tracks' && (
          <FlatList
            data={lagu}
            keyExtractor={(item) => item.id}
            renderItem={renderTrackItem}
            contentContainerStyle={styles.flatListContent}
          />
        )}

        {activeTab === 'playlists' && (
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaylistItem}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1,
    padding: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff'
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    marginBottom: 20
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3
  },
  tabText: {
    fontSize: 16,
    color: '#fff'
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  itemContainer: {
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
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10
  },
  itemInfo: {
    flex: 1
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  flatListContent: {
    paddingBottom: 20
  }
});

export default SearchMusik;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TrackMusik = ({ track, onPress, onToggleFavorite, isFavorite }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.trackInfo}>
        <Image source={{ uri: track.album.images[0]?.url }} style={styles.albumImage} />
        <View style={styles.textContainer}>
          <Text style={styles.trackTitle}>{track.name}</Text>
          <Text style={styles.artistName}>{track.artists.map(artist => artist.name).join(', ')}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
        <Icon name={isFavorite ? 'heart' : 'heart-o'} size={25} color={isFavorite ? 'red' : 'grey'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: 'grey',
  },
  favoriteButton: {
    marginLeft: 10,
  },
});

export default TrackMusik;

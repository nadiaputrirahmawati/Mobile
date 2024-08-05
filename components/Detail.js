import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { addFavoriteTrack, removeFavoriteTrack } from "../redux/actions";

const Detail = ({ route }) => {
  const { track } = route.params;
  const [sedangDiputar, setSedangDiputar] = useState(false);
  const [posisi, setPosisi] = useState(0); // Mulai dari 0:00
  const [durasi, setDurasi] = useState(143); // 2:23 dalam detik

  const dispatch = useDispatch();
  const favoriteTracks = useSelector((state) => state.favoriteTracks);
  const isFavorite = favoriteTracks.some((fav) => fav.id === track.id);

  useEffect(() => {
    if (track.duration_ms) {
      setDurasi(track.duration_ms / 1000);
    }
  }, [track]);

  useEffect(() => {
    let interval = null;
    if (sedangDiputar) {
      interval = setInterval(() => {
        setPosisi((prev) => {
          const newPosition = prev + 1;
          if (newPosition >= durasi) {
            clearInterval(interval);
            setSedangDiputar(false);
            return durasi;
          }
          return newPosition;
        });
      }, 1000);
    } else if (!sedangDiputar && posisi !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sedangDiputar, posisi, durasi]);

  const togglePlayback = () => {
    setSedangDiputar(!sedangDiputar);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteTrack(track.id));
    } else {
      dispatch(addFavoriteTrack(track));
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: track.album.images[0].url }}
        style={styles.albumImage}
      />
      <Text style={styles.trackName}>{track.name}</Text>
      <Text style={styles.artistName}>{track.artists[0].name}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durasi}
        value={posisi}
        onValueChange={(value) => setPosisi(value)}
        minimumTrackTintColor="#000"
        maximumTrackTintColor="#666666"
        thumbTintColor="#000"
      />

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(posisi)}</Text>
        <Text style={styles.timeText}>{formatTime(durasi)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity >
          <Icon name="random" size={30} color="#000" />
          {/* <Text style={styles.shuffleText}>Shuffle play</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="step-backward" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Icon
            name={sedangDiputar ? "pause" : "play"}
            size={25}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="step-forward" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Icon
            name={isFavorite ? "heart" : "heart-o"}
            size={33}
            color={isFavorite ? "#FF0303" : "#666"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ECEFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  albumImage: {
    width: 280,
    height: 280,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: "#000",
    borderWidth: 3,
  },
  trackName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  artistName: {
    fontSize: 18,
    color: "#757575",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 30,
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  shuffleText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  favoriteButton: {
    marginTop: 2,
  },
});

export default Detail;

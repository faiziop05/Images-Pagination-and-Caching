import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Modal } from "react-native";

const Home = () => {
  const API_KEY = "?key=45879582-bc1603d7f0be54f14915d5fbc";
  const URI = "https://pixabay.com/api/" + API_KEY + "&q=";
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [ishasMore, setIshasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (images.length <= 0) {
          setInitialLoading(true);
          setIsLoading(false);
        } else {
          setIsLoading(true);
        }

        const res = await axios.get(
          URI + "nature&image_type=photo&page" + "=" + page
        );
        const data = await res.data?.hits;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setImages([...images, ...data]);
        setInitialLoading(false);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIshasMore(false);
      }
    };
    fetch();
  }, [page]);
  const saveFileToGallery = async (uri) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access media library was denied");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      setIsModalVisible(true); // show modal after saving
    } catch (e) {
      console.error("Failed to save to gallery:", e);
    }
  };

  const downloadImage = async (file) => {
    try {
      const filename = `${file.id}.jpg`;
      const uri = FileSystem.documentDirectory + filename;

      const result = await FileSystem.downloadAsync(file.largeImageURL, uri);

      await saveFileToGallery(result.uri);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleEndReached = () => {
    if (ishasMore && !isLoading) {
      setPage(page + 1);
    }
  };

  const RenderItem = ({ data }) => {
    const aspectRatio = data.imageWidth / data.imageHeight;
    return (
      <View style={styles.EachItemWraper}>
        <View style={styles.UserIconInfoWrapper}>
          {data.userImageURL ? (
            <Image
              width={30}
              height={30}
              source={{ uri: data.userImageURL }}
              style={styles.userIcon}
            />
          ) : (
            <FontAwesome name="user-circle-o" size={30} color="white" />
          )}
          <Text style={styles.UerName}>{data.user}</Text>
        </View>

        <Image
          style={{ aspectRatio: aspectRatio }}
          source={{ uri: data?.largeImageURL }}
          contentFit="cover"
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <View style={{ ...styles.row, gap: 25 }}>
            <View style={styles.row}>
              <Feather name="heart" size={20} color="white" />
              <Text style={{ color: "white" }}>{data?.likes}</Text>
            </View>
            <View style={styles.row}>
              <Feather name="eye" size={20} color="white" />
              <Text style={{ color: "white" }}>{data?.views}</Text>
            </View>
            <View style={styles.row}>
              <FontAwesome5 name="comment" size={20} color="white" />
              <Text style={{ color: "white" }}>{data?.comments}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => downloadImage(data)}>
            <Feather name="download" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.Title}>Explore</Text>
      {initialLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <ActivityIndicator color={"white"} size={30} />
        </View>
      )}
      {!initialLoading && (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={images}
          renderItem={(item) => <RenderItem data={item.item} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          ListFooterComponent={() => {
            return (
              <View
                style={{
                  padding: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 100,
                }}
              >
                {isLoading && <ActivityIndicator color={"white"} size={30} />}
              </View>
            );
          }}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Download Complete</Text>
            <Text style={styles.modalMessage}>Image saved to gallery.</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#04192C",
    flex: 1,
  },
  Title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  MainImage: {
    flex: 1,
    // width: "100%",
  },
  image: {
    alignSelf: "center",
  },
  UserIconInfoWrapper: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },
  UerName: {
    marginLeft: 10,
    color: "#fff",
  },
  userIcon: {
    borderRadius: 100,
  },
  EachItemWraper: {
    marginBottom: 10,
    backgroundColor: "#000a0f",
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 25,
    width: "80%",
    alignItems: "center",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },

  modalMessage: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },

  modalButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
});

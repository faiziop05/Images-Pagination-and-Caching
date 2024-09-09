import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dimensions } from "react-native";
const screenwidth = Dimensions.get("screen").width;
const screenheight = Dimensions.get("screen").height;
import { Image as ExpoImage } from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const Home = () => {
  const API_KEY = "?key=45879582-bc1603d7f0be54f14915d5fbc";
  const URI = "https://pixabay.com/api/" + API_KEY + "&q=";
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(1);
  const [ishasMore, setIshasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrollingBack, setIsScrollingBack] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(URI + "nature&image_type=photo&page" + "=" + page);
        const data = await res.data?.hits;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setImages([...images, ...data]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIshasMore(false);
      }
    };
    fetch();
  }, [page]);

  const handleEndReached = () => {
    if (ishasMore && !isLoading) {
      setPage(page + 1);
    }
  };

  const RenderItem = ({ data }) => {
    return (
      <View style={styles.EachItemWraper}>
        <View>
          <ExpoImage
            width={screenwidth}
            height={screenheight}
            source={{
              uri: data.largeImageURL,
            }}
            style={styles.image}
          />
        </View>
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
      </View>
    );
  };

  const onScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    if (scrollPosition < 0) {
      setIsScrollingBack(true);
    } else {
      setIsScrollingBack(false);
    }
  };

  return (
    // <SafeAreaView style={{ backgroundColor: "black" }}>
    <View style={styles.container}>
      <Text>Home</Text>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={images}
        renderItem={(item) => <RenderItem data={item.item} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        pagingEnabled
        onScroll={onScroll}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        ListFooterComponent={() => {
          return (
            <View>
              {isLoading && <ActivityIndicator color={"white"} size={30} />}
            </View>
          );
        }}
      />
    </View>
    // </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
  },
  EachItemWraper: {
    position: "relative",
  },
  UserIconInfoWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: screenheight - 100,
    left: 20,
  },
  UerName: {
    marginLeft: 10,
    color: "#fff",
  },
  userIcon: {
    borderRadius: 100,
  },
});

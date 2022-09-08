import { View, Text, Image } from "react-native";
import React from "react";
import { Ionicons, EvilIcons, FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useWatchList } from "../../../../context/WatchlistContext";

const CoinDetailHeader = ({ coin }) => {
  const navigation = useNavigation();
  const { watchListCoinIds, storeWatchListCoinId, removeWatchListCoinId } =
    useWatchList();
  const {
    id,
    image: { small },
    name,
    symbol,
    market_data: { market_cap_rank },
  } = coin;
  const checkIfCoinIsWatchListed = () =>
    watchListCoinIds.some((coinIdValue) => coinIdValue === id);

  const handleWatchListCoin = () => {
    if (checkIfCoinIsWatchListed()) {
      return removeWatchListCoinId(id);
    }
    return storeWatchListCoinId(id);
  };

  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name="chevron-back-sharp"
        size={30}
        color="white"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.tickerContainer}>
        <Image source={{ uri: small }} style={{ width: 30, height: 30 }} />
        <Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            #{market_cap_rank}
          </Text>
        </View>
      </View>

      <FontAwesome
        onPress={handleWatchListCoin}
        name={checkIfCoinIsWatchListed() ? "star" : "star-o"}
        size={25}
        color={checkIfCoinIsWatchListed() ? "#FFBF00" : "white"}
      />
    </View>
  );
};

export default CoinDetailHeader;

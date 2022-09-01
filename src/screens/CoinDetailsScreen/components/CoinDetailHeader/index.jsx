import { View, Text, Image } from "react-native";
import React from "react";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import styles from "./styles";

const CoinDetailHeader = ({ Coin }) => {
  const {
    image: { small },
    name,
    symbol,
    market_data: { market_cap_rank },
  } = Coin;
  return (
    <View style={styles.headerContainer}>
      <Ionicons name="chevron-back-sharp" size={30} color="white" />
      <View style={styles.tickerContainer}>
        <Image source={{ uri: small }} style={{ width: 30, height: 30 }} />
        <Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            #{market_cap_rank}
          </Text>
        </View>
      </View>

      <EvilIcons name="user" size={30} color="white" />
    </View>
  );
};

export default CoinDetailHeader;

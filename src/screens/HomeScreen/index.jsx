import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { getMarketData } from "../../services/requests";
import CoinItem from "../../components/CoinItem";
import cryptoCurrencies from "../../../assets/data/cryptocurrencies.json";

const HomeScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);
    setCoins((existingCoins) => [...existingCoins, ...coinsData]);
    setLoading(false);
  };

  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    setCoins(coinsData);
    setLoading(false);
  };
  useEffect(() => {
    fetchCoins();
  }, []);
  return (
    <FlatList
      data={coins}
      onEndReached={() => fetchCoins(coins.length / 50 + 1)}
      renderItem={({ item }) => <CoinItem marketCoin={item} />}
      refreshControl={
        <RefreshControl
          onRefresh={refetchCoins}
          refreshing={loading}
          tintColor="white"
        />
      }
    />
  );
};

export default HomeScreen;

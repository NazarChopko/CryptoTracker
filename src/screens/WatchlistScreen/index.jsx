import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { useWatchList } from "../../context/WatchlistContext";
import CoinItem from "../../components/CoinItem";
import { getWatchListedCoins } from "../../services/requests";

const WatchListScreen = () => {
  const { watchListCoinIds } = useWatchList();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const transformIds = () => {
    return watchListCoinIds.join("%2C");
  };
  const fetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const watchListedCoinData = await getWatchListedCoins(1, transformIds());
    setCoins(watchListedCoinData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [watchListCoinIds]);

  return (
    <FlatList
      data={coins}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          tintColor="white"
          onRefresh={fetchCoins}
        />
      }
      renderItem={({ item }) => <CoinItem marketCoin={item} />}
    />
  );
};

export default WatchListScreen;

import { selector } from "recoil";
import { allPortfolioBoughtAssetsInStorage } from "./atom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWatchListedCoins } from "../services/requests";

export const allPortfolioBoughtAssets = selector({
  key: "allPortfolioBoughtAssets",
  get: async () => {
    const jsonValue = await AsyncStorage.getItem("@portfolio_coins");
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  },
});

export const allPortfolioBoughtAssetsFromAPI = selector({
  key: "allPortfolioBoughtAssetsFromAPI",
  get: async ({ get }) => {
    const boughtPortfolioAssets = get(allPortfolioBoughtAssetsInStorage);
    const portfolioAssetsMarketData = await getWatchListedCoins(
      1,
      boughtPortfolioAssets.map((portfolioAsset) => portfolioAsset.id).join(",")
    );
    const boughtAssets = boughtPortfolioAssets.map((boughtAsset) => {
      const portfolioAsset = portfolioAssetsMarketData.filter(
        (item) => boughtAsset.id === item.id
      )[0];
      return {
        ...boughtAsset,
        currentPrice: portfolioAsset.current_price,
        priceChangePercentage: portfolioAsset.price_change_percentage_24h,
      };
    });

    return boughtAssets.sort(
      (item1, item2) =>
        item1.quantityBought * item1.currentPrice <
        item2.quantityBought * item2.currentPrice
    );
  },
});

import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import styles from "./style";
import PortfolioAssetsItem from "../PortfolioAssetsItem";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  allPortfolioAssets,
  allPortfolioBoughtAssetsInStorage,
} from "../../../../state/atom";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PortfolioAssetsList = () => {
  const assets = useRecoilValue(allPortfolioAssets);
  const [storageAssets, setStorageAssets] = useRecoilState(
    allPortfolioBoughtAssetsInStorage
  );
  const navigation = useNavigation();

  const getCurrentBalance = () => {
    return assets
      .reduce(
        (total, currentAsset) =>
          total + currentAsset.currentPrice * currentAsset.quantityBought,
        0
      )
      .toFixed(3);
  };

  const getCurrentValueChange = () => {
    const currentBalance = getCurrentBalance();
    const bought = assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.priceBought * currentAsset.quantityBought,
      0
    );

    return (currentBalance - bought).toFixed(2);
  };

  const getCurrentPercentageChange = () => {
    const currentBalance = getCurrentBalance();
    const bought = assets.reduce(
      (total, currentAsset) =>
        total + currentAsset.priceBought * currentAsset.quantityBought,
      0
    );

    return (((currentBalance - bought) / bought) * 100).toFixed(2) || 0;
  };

  const onDeleteAsset = async (asset) => {
    const newAssets = storageAssets.filter(
      (coin, index) => coin.unique_id !== asset.item.unique_id
    );
    const jsonValue = JSON.stringify(newAssets);
    await AsyncStorage.setItem("@portfolio_coins", jsonValue);
    setStorageAssets(newAssets);
  };

  const renderDeleteButton = (data) => {
    return (
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "#EA3943",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: 28,
          marginLeft: 20,
        }}
        onPress={() => onDeleteAsset(data)}
      >
        <FontAwesome name="trash-o" size={24} color="white" />
      </Pressable>
    );
  };

  return (
    <SwipeListView
      data={assets}
      renderItem={({ item }) => <PortfolioAssetsItem assetItem={item} />}
      rightOpenValue={-75}
      disableRightSwipe
      closeOnRowPress
      keyExtractor={({ id }, index) => `${id}${index}`}
      renderHiddenItem={(data) => renderDeleteButton(data)}
      ListHeaderComponent={
        <>
          <View style={styles.balanceContainer}>
            <View>
              <Text style={styles.currentBalance}>Current Balance</Text>
              <Text style={styles.currentBalanceValue}>
                ${getCurrentBalance()}
              </Text>
              <Text
                style={{
                  ...styles.valueChange,
                  color: getCurrentValueChange() > 0 ? "#16c784" : "#ea3943",
                }}
              >
                ${getCurrentValueChange()} (All Time)
              </Text>
            </View>

            <View
              style={{
                ...styles.priceChangePercentageContainer,
                backgroundColor:
                  getCurrentPercentageChange() > 0 ? "#16c784" : "#ea3943",
              }}
            >
              <AntDesign
                name={
                  getCurrentPercentageChange() > 0 ? "caretup" : "caretdown"
                }
                size={12}
                color={"white"}
                style={{
                  alignSelf: "center",
                  marginRight: 5,
                }}
              />
              <Text style={styles.percentageChange}>
                {getCurrentPercentageChange()}%
              </Text>
            </View>
          </View>

          <Text style={styles.assetsLabel}>Your Assets</Text>
        </>
      }
      ListFooterComponent={
        <Pressable
          style={styles.buttonContainer}
          onPress={() => {
            navigation.navigate("AddNewAssetsScreen");
          }}
        >
          <Text style={styles.buttonText}>Add new assets</Text>
        </Pressable>
      }
    />
  );
};

export default PortfolioAssetsList;

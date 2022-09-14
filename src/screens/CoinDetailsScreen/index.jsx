import {
  View,
  Text,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRoute } from "@react-navigation/native";

import CoinDetailHeader from "./components/CoinDetailHeader";
import styles from "./styles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  getDetailCoinData,
  getCoinMarketChart,
  getCandleChartData,
} from "../../services/requests";
import FilterComponent from "./components/FilterComponent";

import { LineChart, CandlestickChart } from "react-native-wagmi-charts";

const screenWidth = Dimensions.get("window").width;
const filterDays = [
  { filterDay: "1", filterText: "24" },
  { filterDay: "7", filterText: "7d" },
  { filterDay: "30", filterText: "30d" },
  { filterDay: "365", filterText: "1y" },
  { filterDay: "max", filterText: "All" },
];

const CoinDetail = () => {
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [selectedRange, setSelectedRange] = useState("1");
  const [coinCandleChartData, setCoinCandleChartData] = useState(null);
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);
  const route = useRoute();
  const {
    params: { coinId },
  } = route;

  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState("1");
  const [usdValue, setUsdValue] = useState("");

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchedCoinData = await getDetailCoinData(coinId);
    const fetchedCoinMarketData = await getCoinMarketChart(
      coinId,
      selectedRange
    );
    setCoin(fetchedCoinData);
    setCoinMarketData(fetchedCoinMarketData);
    setUsdValue(fetchedCoinData.market_data.current_price.usd.toString());
    setLoading(false);
  };

  const fetchMarketCoinData = async (selectedRangeValue) => {
    const fetchedCoinMarketData = await getCoinMarketChart(
      coinId,
      selectedRangeValue
    );
    setCoinMarketData(fetchedCoinMarketData);
  };

  const fetchCandleStickChartData = async (selectedRangeValue) => {
    const fetchSelectedCandleChartData = await getCandleChartData(
      coinId,
      selectedRangeValue
    );
    setCoinCandleChartData(fetchSelectedCandleChartData);
  };

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
    fetchCandleStickChartData();
  }, []);

  const onSelectedRangeChange = async (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  const memoOnSelectedRangeChange = useCallback(
    (range) => onSelectedRangeChange(range),
    []
  );

  if (loading || !coin || !coinMarketData || !coinCandleChartData) {
    return <ActivityIndicator size="large" />;
  }

  const {
    image: { small },
    name,
    symbol,
    market_data: {
      market_cap_rank,
      price_change_percentage_24h,
      current_price: { usd },
    },
  } = coin;
  const { prices } = coinMarketData;

  const percentageColor =
    price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";
  const chartColor = usd > prices[0][1] ? "#16c784" : "#ea3943";

  function formatCurrency({ value }) {
    "worklet";
    if (value < 100) {
      if (value < 1) {
        return `$${usd}`;
      }
    }
    return `$${parseFloat(value).toFixed(2)}`;
  }

  const changeCoinValue = (value) => {
    setCoinValue(value);
    const floatValue = parseFloat(value.replace(",", ".")) || 0;
    setUsdValue((floatValue * usd).toString());
  };
  const changeUsdValue = (value) => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(",", ".")) || 0;
    setCoinValue((floatValue / usd).toString());
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <CoinDetailHeader coin={coin} />
      <LineChart.Provider
        data={prices.map(([x, y]) => ({ timestamp: y, value: y }))}
      >
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <LineChart.PriceText
              format={formatCurrency}
              style={styles.currentPrice}
            />
          </View>
          <View
            style={{
              backgroundColor: percentageColor,
              paddingHorizontal: 3,
              paddingVertical: 8,
              borderRadius: 5,
              flexDirection: "row",
            }}
          >
            <AntDesign
              name={price_change_percentage_24h < 0 ? "caretdown" : "caretup"}
              size={12}
              color={"white"}
              style={{
                alignSelf: "center",
                marginRight: 5,
              }}
            />
            <Text style={styles.priceChange}>
              {price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        </View>
        <View style={styles.filterContainer}>
          {filterDays.map((day) => (
            <FilterComponent
              key={day.filterText}
              filterText={day.filterText}
              filterDay={day.filterDay}
              selectedRange={selectedRange}
              setSelectedRange={memoOnSelectedRangeChange}
            />
          ))}
          {isCandleChartVisible ? (
            <MaterialIcons
              name="show-chart"
              size={24}
              color="#16c784"
              onPress={() => setIsCandleChartVisible(false)}
            />
          ) : (
            <MaterialIcons
              name="waterfall-chart"
              size={24}
              color="#16c784"
              onPress={() => setIsCandleChartVisible(true)}
            />
          )}
        </View>
        {isCandleChartVisible ? (
          <CandlestickChart.Provider
            data={coinCandleChartData.map(
              ([timestamp, open, high, low, close]) => ({
                timestamp,
                open,
                high,
                low,
                close,
              })
            )}
          >
            <CandlestickChart height={screenWidth / 2} width={screenWidth}>
              <CandlestickChart.Candles />
              <CandlestickChart.Crosshair>
                <CandlestickChart.Tooltip
                  textStyle={{
                    color: "white",
                    backgroundColor: "grey",
                    width: 80,
                    padding: 3,
                    borderRadius: 3,
                  }}
                />
              </CandlestickChart.Crosshair>
            </CandlestickChart>
            <View style={styles.candleStickDataContainer}>
              <View>
                <Text style={styles.candleStickTextLabel}>Open</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="open"
                />
              </View>
              <View>
                <Text style={styles.candleStickTextLabel}>High</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="high"
                />
              </View>
              <View>
                <Text style={styles.candleStickTextLabel}>Low</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="low"
                />
              </View>
              <View>
                <Text style={styles.candleStickTextLabel}>Close</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="close"
                />
              </View>
            </View>
            <CandlestickChart.DatetimeText
              style={{ color: "white", fontWeight: "700", margin: 10 }}
            />
          </CandlestickChart.Provider>
        ) : (
          <>
            <LineChart width={screenWidth} height={screenWidth / 2}>
              <LineChart.Path color={chartColor} />
              <LineChart.CursorCrosshair color={chartColor} />
            </LineChart>
          </>
        )}

        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text style={{ color: "white", alignSelf: "center" }}>
              {symbol.toUpperCase()}
            </Text>
            <TextInput
              style={styles.input}
              value={coinValue}
              keyboardType="numeric"
              onChangeText={changeCoinValue}
            />
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text style={{ color: "white", alignSelf: "center" }}>USD</Text>
            <TextInput
              style={styles.input}
              value={usdValue}
              keyboardType="numeric"
              onChangeText={changeUsdValue}
            />
          </View>
        </View>
      </LineChart.Provider>
    </View>
  );
};

export default CoinDetail;

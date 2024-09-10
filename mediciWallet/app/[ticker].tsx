
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import RealtimeDetails from "@/components/RealTimeDetails";
import { LineChart } from "react-native-gifted-charts";
import { formatCurrency } from "@/utils/formatCurrency";
import { StoreContext } from "./_layout";

import StockDetails from "@/components/StockDetails"; 

import { Stock, StockPrice } from "@/services/apiService/responseTypes";
import { apiService } from "@/services/apiService/apiService";
export default function TickerScreen() {
  const options = ["Description", "Live"];
  const { ticker } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { likedStocks, updateLikedStocks } = useContext(StoreContext);
  const [stock, setStock] = useState<Stock | null>(null);
  const [stockPrices, setStockPrices] = useState<StockPrice[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockData = await apiService.getStockDetails(ticker as string);
        const pricesData = await apiService.getStockPrices(ticker as string);

        setStock(stockData);
        setStockPrices(pricesData);
      } catch (error) {
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  const positiveOverallPriceChange =
    stockPrices &&
    stockPrices[0].value < stockPrices[stockPrices.length - 1].value;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20, marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 25,
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            color={"white"}
            size={40}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (likedStocks.includes(ticker as string))
              return updateLikedStocks(ticker as string, "del");
            updateLikedStocks(ticker as string, "add");
          }}
        >
          <MaterialCommunityIcons
            name={
              likedStocks.includes(ticker as string) ? "star" : "star-outline"
            }
            color={"white"}
            size={40}
          />
        </Pressable>
      </View>

      {stock ? (
        <FlatList
          data={[1]}
          renderItem={() => (
            <View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={stock.image}
                  style={{ height: 50, width: 50 }}
                  contentFit="contain"
                />
                <View style={{ paddingLeft: 20 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                    {stock.ticker}
                  </Text>
                  <Text variant="labelMedium">{stock.companyName}</Text>
                </View>
              </View>
              <View style={{ paddingTop: 20 }}>
                <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
                  {formatCurrency(stock.price)}
                </Text>
                <Text
                  variant="labelLarge"
                  style={{
                    color:
                      stock.priceChange < 0
                        ? "red"
                        : stock.priceChange > 0
                        ? "lightgreen"
                        : "auto",
                  }}
                >
                  {formatCurrency(stock.priceChange)}{" "}
                  {stock.priceChangePercentage.toFixed(2)}%
                </Text>
              </View>
              <LineChart
                areaChart
                data={stockPrices ?? []}
                rotateLabel
                labelsExtraHeight={20}
                hideDataPoints
                spacing={width / (stockPrices?.length ?? 1) - 2}
                color={positiveOverallPriceChange ? "green" : "red"}
                thickness={2}
                startFillColor={positiveOverallPriceChange ? "green" : "red"}
                endFillColor={positiveOverallPriceChange ? "green" : "red"}
                startOpacity={0.9}
                endOpacity={0.2}
                initialSpacing={0}
                hideYAxisText={true}
                rulesType="solid"
                rulesColor="black"
                xAxisColor="lightgray"
                pointerConfig={{
                  pointerStripHeight: 140,
                  pointerStripColor: "lightgray",
                  pointerStripWidth: 2,
                  pointerColor: "lightgray",
                  radius: 6,
                  pointerLabelWidth: 100,
                  pointerLabelHeight: 90,
                  activatePointersOnLongPress: true,
                  autoAdjustPointerLabelPosition: false,
                  pointerLabelComponent: (items: any) => {
                    return (
                      <View
                        style={{
                          height: 90,
                          width: 100,
                          justifyContent: "center",
                          marginTop: -30,
                          marginLeft: -40,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 14,
                            marginBottom: 6,
                            textAlign: "center",
                          }}
                        >
                          {items[0].date}
                        </Text>

                        <View
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: "white",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              textAlign: "center",
                              color: "black",
                            }}
                          >
                            {"$" + items[0].value}
                          </Text>
                        </View>
                      </View>
                    );
                  },
                }}
              />

              <FlatList
                data={options}
                keyExtractor={(item) => item}
                horizontal
                style={{ marginTop: 80 }}
                renderItem={({ item }) => (
                  <Button
                    onPress={() => setSelectedOption(item)}
                    mode={item === selectedOption ? "contained" : "outlined"}
                    style={{ marginRight: 10 }}
                  >
                    {item}
                  </Button>
                )}
              />

              {selectedOption === "Live" ? (
                <RealtimeDetails ticker={ticker as string} />
              ) : (
                <StockDetails stock={stock} />
              )}
            </View>
          )}
        />
      ) : (
        <Text>Stock Not Available</Text>
      )}
    </SafeAreaView>
  );
}

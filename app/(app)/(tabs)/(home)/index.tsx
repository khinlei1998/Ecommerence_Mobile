import { useState, useCallback } from "react";
import { ScrollView, Text, Dimensions, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { HStack } from "@/components/ui/hstack";
import Cart from "@/components/shop/Cart";
import { Pressable } from "@/components/ui/pressable";
import Ttitle from "@/components/shop/Ttitle";
import { Box } from "@/components/ui/box";
import Category from "@/components/shop/Category";
import { FlashList } from "@shopify/flash-list";
import { categories, products } from "@/data";
import Product from "@/components/shop/Product";
import { router } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function HomeScreen() {
  const width = Dimensions.get("screen").width;

  const [select, setSelect] = useState(1);

  const numColumns = width < 600 ? 2 : width < 768 ? 3 : 4;

  const onSelectHandler = useCallback((id: number) => {
    setSelect(id);
  }, []);

  const handleProductDetail = (id: number) => {
    router.navigate({ pathname: "/product-detail", params: { id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HStack className="my-2 items-center justify-between px-5">
        <Pressable>
          <Image
            style={{ width: 50, height: 25 }}
            source={require("@/assets/images/n.png")}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </Pressable>

        <Cart />
      </HStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={{
            width: "100%",
            aspectRatio: 20 / 9,
          }}
          source={require("@/assets/images/banner6.png")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Box className="mt-3 px-5 pb-40">
          <Ttitle title="Shop By Category" actionText="View All" />
          <FlashList
            data={categories}
            extraData={select} //to render after update select state
            renderItem={({ item }) => (
              <Category {...item} onSelect={onSelectHandler} select={select} />
            )}
            horizontal
            estimatedItemSize={80}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 7 }}
          />

          <Ttitle title="Recommended For You" actionText="View All" />
          <FlashList
            data={products}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <Product
                {...item}
                onCallRoute={() => handleProductDetail(item.id)}
              />
            )}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 4 }}
          />
          {/* <FlatList
            // key={Math.ceil(CategoryList.length / 2) ?? 4}
            // horizontal
            // numColumns={numColumns}
            key={"#"}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            data={products}
            renderItem={({ item }) => (
              <Product
                {...item}
                onCallRoute={() => handleProductDetail(item.id)}
              />
            )}
          /> */}

          <Button className="mx-auto mt-8 h-14 w-[200px] rounded-lg bg-blue-500 text-white">
            <ButtonText size="lg" className="font-bold">
              Explore More
            </ButtonText>
            <ButtonIcon as={ArrowUpRight} className="ml-2" />
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

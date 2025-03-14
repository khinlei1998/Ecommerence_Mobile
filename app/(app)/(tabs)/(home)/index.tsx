import { useState, useCallback, useEffect } from "react";
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
import { CategoryType, ProductType } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useMutationState,
} from "@tanstack/react-query";
import api from "@/api/axios";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface ProductApiResponse {
  products: ProductType[];
  [key: string]: any;
}
export default function HomeScreen() {
  const width = Dimensions.get("screen").width;

  const [select, setSelect] = useState(1);

  const queryClient = useQueryClient();

  const numColumns = width < 600 ? 2 : width < 768 ? 3 : 4;

  const onSelectHandler = useCallback((id: number) => {
    setSelect(id);
  }, []);

  const handleProductDetail = (id: number) => {
    router.navigate({ pathname: "/product-detail", params: { id } });
  };

  const fetchCatgory = async (): Promise<CategoryType[]> => {
    const response = await api.get("categories");
    return response.data;
  };

  const fetchProduct = async (select = 1): Promise<ProductApiResponse> => {
    const response = await api.get(`/products?limit=8&category=${select}`);
    return response.data;
  };

  // Queries
  const {
    data: categories,
    isLoading: isCategoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useQuery({ queryKey: ["categories"], queryFn: fetchCatgory });
  const {
    data: products,
    isLoading: isLoadingProduct,
    error: productError,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ["products", select],
    queryFn: () => fetchProduct(select),
    staleTime: 300000, //5min of ms
  });

  const toggleFavorite = async ({
    productId,
    favourite,
  }: {
    productId: number;
    favourite: boolean;
  }) => {
    console.log("productId", productId);
    const response = await api.post(`/products/favourite-toggle`, {
      productId,
      favourite,
    });
    // console.log("response", response.data);

    return response.data;
  };

  const toggleFavoriteMutation = useMutation({
    //optimistic update
    mutationFn: toggleFavorite,

    onMutate: async ({ productId, favourite }) => {
      //can click another time before the first one is done
      await queryClient.cancelQueries({ queryKey: ["products", select] });
      const previousProducts = queryClient.getQueryData<ProductApiResponse>([
        "products",
        select,
      ]);

      queryClient.setQueryData<ProductApiResponse>(
        ["products", select],
        (oldData: any) => {
          if (oldData) return oldData;
          const favoriteData = favourite ? [{ id: 1 }] : [];
          return {
            ...oldData,
            products: oldData?.products.map((product: any) =>
              product.id === productId
                ? { ...product, users: favoriteData }
                : product,
            ),
          };
        },
      );
      return previousProducts;
      // })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["products", select], context?.previousProducts);
    },
    onSuccess: () => {
      //data is change xo we need to recall api
      queryClient.invalidateQueries({ queryKey: ["products", select] });
    },
  });

  const handleToggleFavorite = (productId: number, favourite: boolean) => {
    toggleFavoriteMutation.mutate({ productId, favourite });
  };

  // if (isCategoryLoading || isLoadingProduct) {
  //   return <Text>Loading...</Text>;
  // }

  // useEffect(() => {
  //   if (categories) {
  //     setSelect(categories[0].id);
  //   }
  // }, [categories]);

  const data = {
    brand: "H&M",
    categoryId: 1,
    discount: 0,
    id: 8,
    image: "w5.png",
    price: 220,
    quantity: 234,
    star: 4.5,
    title: "Loose Fit T-Shirt",
    users: [],
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
          {!isCategoryLoading ? (
            <FlashList
              data={categories}
              extraData={select}
              renderItem={({ item }) => (
                <Category
                  {...item}
                  onSelect={onSelectHandler}
                  select={select}
                />
              )}
              horizontal
              estimatedItemSize={80}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 7 }}
            />
          ) : (
            <HStack className="my-4 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="circular"
                  className="h-[56px] w-[56px]"
                />
              ))}
            </HStack>
          )}

          <Ttitle title="Recommended For You" actionText="View All" />
          {!isLoadingProduct && (
            <FlashList
              data={products?.data}
              numColumns={numColumns}
              renderItem={({ item }) => (
                <Product
                  {...item}
                  onCallRoute={() => handleProductDetail(item.id)}
                  toggleFavorite={handleToggleFavorite}
                />
              )}
              estimatedItemSize={200}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 4 }}
            />
          )}
          {!isLoadingProduct && products?.data.length == 0 && (
            <Box className="h-52 w-full items-center justify-center rounded-lg bg-slate-50 p-5">
              <Text>Empty Product</Text>
            </Box>
          )}
          {!isLoadingProduct && (
            <Button className="mx-auto mt-8 h-14 w-[200px] rounded-lg bg-blue-500 text-white">
              <ButtonText size="lg" className="font-bold">
                Explore More
              </ButtonText>
              <ButtonIcon as={ArrowUpRight} className="ml-2" />
            </Button>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

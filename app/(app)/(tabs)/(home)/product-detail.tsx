import React, { useState, memo } from "react";
import { ScrollView } from "react-native";
import { Heart, StarIcon } from "lucide-react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import {
  useQueries,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
// import { products } from "@/data";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import Cart from "@/components/shop/Cart";
import PagerViewScreen from "@/components/shop/PagerView";
import { HStack } from "@/components/ui/hstack";
import {
  AddIcon,
  CheckIcon,
  CloseCircleIcon,
  Icon,
  RemoveIcon,
  SearchIcon,
} from "@/components/ui/icon";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckboxGroup,
} from "@/components/ui/checkbox";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import api from "@/api/axios";
import { ProductType, CartItem } from "@/types";
import { products } from "@/data";

type CartProps = {
  id: number;
  color: string;
  size: string;
  quantity: number;
};

export default function ProductDetail() {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartProps[]>([]);
  const [toastId, setToastId] = useState(0);

  const { id } = useLocalSearchParams();

  const queryClient = useQueryClient();

  // const product = products.find((p) => p.id === +id); //convert id to number

  const [showActionsheet, setShowActionsheet] = React.useState(false);

  const fetchProduct = async (productId: number): Promise<ProductType> => {
    const response = await api.get(`products/${productId}`);
    return response.data;
  };

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(+id),
    staleTime: 1000 * 60 * 5, //recall api after 5min
  });

  const handleClose = () => {
    setShowActionsheet(false);
    if (quantity === 0) return;
    colors.forEach((color) => {
      sizes.forEach((size) => {
        setCart((prev) => [
          { id: Math.random(), color, size, quantity },
          ...prev,
        ]);
      });
    });
    //reset
    setColors([]);
    setSizes([]);
    setQuantity(1);
  };

  const toast = useToast();

  const handleToast = (title: string, description: string) => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast(title, description);
    }
  };

  const showNewToast = (title: string, description: string) => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 2000,
      render: (id) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="info" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const toggleFavorite = async (productId: number) => {
    const response = await api.post(`/products/favourite-toggle`, {
      productId,
      favourite: product?.users.length === 0, //if no user then add to favorite
    });
    // console.log("response", response.data);

    return response.data;
  };

  const toggleFavoriteMutation = useMutation({
    //optimistic update (update from cache)
    mutationFn: toggleFavorite,

    onMutate: async (id) => {
      //can click another time before the first one is done
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      const previousProduct = queryClient.getQueryData(["product", id]);
      console.log("previousProduct", previousProduct);

      queryClient.setQueryData(["product", id], (oldData: any) => {
        // if (oldData) return oldData;
        const favoriteData = product?.users.length === 0 ? [{ id: 1 }] : [];
        console.log("favoriteData", favoriteData);
        return {
          ...oldData,
          users: favoriteData,
        };
      });
      return { test: 1 };
      // })
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["product", id], context?.previousProduct);
      handleToast("Error", err.message || "Something went wrong");
    },
    onSuccess: () => {
      //data is change xo we need to recall api
      queryClient.invalidateQueries({
        queryKey: ["products", product?.categoryId],
      });
    },
  });

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate(+id);
  };

  if (isLoading) {
    <VStack className="flex-1 items-center justify-center">
      <Text>Loading....</Text>
    </VStack>;
  }
  if (error) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text className="mb-4">Error : {error?.message}</Text>
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {
            refetch();
          }}
        >
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  console.log("product", product);

  return (
    <VStack className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Product Detail",
          headerBackTitle: "Home",
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "black",
          headerRight: () => (
            <Pressable>
              <Cart />
            </Pressable>
          ),
        }}
      />
      <PagerViewScreen />

      <ScrollView>
        <VStack space="sm" className="mt-4 px-5">
          <HStack space="sm" className="items-center justify-between">
            <VStack space="sm">
              <HStack space="sm" className="items-center">
                <Text className="font-semibold text-gray-500">
                  {product?.brand}
                </Text>
                <Icon as={StarIcon} size="xs" className="text-orange-500" />
                <Text size="sm">{product?.star}</Text>
                <Text size="xs" className="text-gray-500">
                  {product?.quantity}
                </Text>
              </HStack>
              <Text className="line-clamp-1 font-bold">{product?.title}</Text>
              <HStack space="sm" className="items-center">
                <Text className="font-semibold text-green-700">
                  ${product?.price.toFixed(2)}
                </Text>
                {product?.discount! > 0 && (
                  <Text className="text-gray-500 line-through">
                    ${product?.discount.toFixed(2)}
                  </Text>
                )}
              </HStack>
            </VStack>

            <Pressable onPress={handleToggleFavorite}>
              <Icon
                as={Heart}
                className={`m-1 h-5 w-5 text-red-500 ${product!?.users?.length > 0 && "fill-red-500"}`} //true must
              />
            </Pressable>
          </HStack>
          <Text>{product?.description}</Text>
          <Text className="mb-1 mt-2 font-medium">Choose Colours</Text>

          <CheckboxGroup
            value={colors}
            onChange={(keys) => {
              setColors(keys);
            }}
          >
            <HStack space="xl" className="flex-wrap">
              {product?.colors.map((item) => {
                // if (!item.color.stock) {
                //   return null;
                // }
                return (
                  <Checkbox value={item.color.name} key={item.color.id}>
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>{item.color.name}</CheckboxLabel>
                  </Checkbox>
                );
              })}
            </HStack>
          </CheckboxGroup>

          <Text className="mb-1 mt-2 font-medium">Choose Sizes</Text>

          <CheckboxGroup
            value={sizes}
            onChange={(keys) => {
              setSizes(keys);
            }}
          >
            <HStack space="xl" className="flex-wrap">
              {product?.sizes.map((item) => {
                // if (!size.stock) {
                //   return null;
                // }
                return (
                  <Checkbox value={item.size.name} key={item.size.id}>
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>{item.size.name}</CheckboxLabel>
                  </Checkbox>
                );
              })}
            </HStack>
          </CheckboxGroup>
          <Box className="mt-6 self-start">
            <Button
              size="lg"
              variant="solid"
              action="primary"
              className="rounded-lg bg-sky-500"
              onPress={() => {
                if (colors.length > 0 && sizes.length > 0) {
                  setShowActionsheet(true);
                  return;
                }
                const title = `Must Choose ${colors.length === 0 ? "color -" : ""} ${sizes.length === 0 ? "Sizes -" : ""}`;
                const description = "Please set quantity after choosing";
                handleToast(title, description);
              }}
            >
              <ButtonText>Set Quantity</ButtonText>
            </Button>
          </Box>

          {cart.length > 0 && (
            <VStack space="sm">
              {cart.map((item) => (
                <HStack
                  key={item.id}
                  className="items-center justify-between rounded-md bg-slate-100 px-2 py-1"
                >
                  <HStack space="md" className="items-center">
                    <Icon as={AddIcon} size="sm" />
                    <Text>
                      {item.size} - {item.color}({item.quantity})
                    </Text>
                  </HStack>
                  <Button
                    size="md"
                    className="mr-4"
                    variant="link"
                    onPress={() =>
                      setCart((prev) => prev.filter((c) => c.id !== item.id))
                    }
                  >
                    <ButtonIcon as={CloseCircleIcon} />
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
        <Box className="mb-48" />
      </ScrollView>

      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full items-center justify-center pt-5">
            <Text bold>You Choose colors and sizes</Text>
            <Text>
              {colors}- {sizes}
            </Text>
            <Text bold className="mt-8">
              Please set quantity
            </Text>

            <Text bold className="my-8 text-5xl">
              {quantity}
            </Text>
            <HStack className="w-full" space="lg">
              <Button
                size="lg"
                className="flex-1 bg-sky-500"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <ButtonText>Increase</ButtonText>
                <ButtonIcon as={AddIcon}></ButtonIcon>
              </Button>

              <Button
                size="lg"
                className="flex-1 bg-sky-500"
                onPress={() => {
                  if (quantity === 0) return;
                  setQuantity((q) => q - 1);
                }}
              >
                <ButtonText>Decrease</ButtonText>
                <ButtonIcon as={RemoveIcon}></ButtonIcon>
              </Button>
            </HStack>
            <Button
              size="lg"
              className={`mb-12 mt-6 w-full ${quantity > 0 ? "bg-green-500" : "bg-gray-500"}`}
              onPress={handleClose}
            >
              <ButtonText className="font-bold">
                {quantity === 0 ? "Cancel" : "Confirm"}
              </ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      <Box className="self-end">
        <Fab size="md" className="bottom-28 bg-green-500">
          <FabIcon as={AddIcon} size="md" />
          <FabLabel bold>Add to Cart</FabLabel>
        </Fab>
      </Box>
    </VStack>
  );
}

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Pressable } from "../ui/pressable";
import { Image } from "expo-image";
import { Icon, StarIcon } from "../ui/icon";
import { Heart } from "lucide-react-native";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { ProductType } from "@/types";
import { IMG_URL } from "@/config";

interface ProductProps extends ProductType {
  onCallRoute: (id: number) => void;
  toggleFavorite: (productId: number, favourite: boolean) => void;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
export default function Product({
  id,
  brand,
  title,
  star,
  quantity,
  price,
  discount,
  image,
  users,
  onCallRoute,
  toggleFavorite,
}: ProductProps) {
  const [fill, setFill] = useState(false);
  console.log("users", users.length);
  return (
    <Pressable className="flex-1" onPress={() => onCallRoute(id)}>
      <Card className="relative p-2">
        <Image
          style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 5 }}
          source={IMG_URL + image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Pressable
          className="absolute right-4 top-4 rounded-full bg-zinc-300/40"
          onPress={() => toggleFavorite(id, users.length === 0)}
        >
          <Icon
            as={Heart}
            className={`m-2 h-5 w-5 text-red-400 ${users.length > 0 && "fill-red-400"}`}
          />
        </Pressable>
        <VStack className="mt-2">
          <HStack space="sm" className="items-center">
            <Text className="font-semibold text-gray-500">{brand}</Text>
            <Icon as={StarIcon} size="xs" className="text-orange-500" />
            <Text size="sm">{star}</Text>
            <Text size="xs" className="text-gray-500">
              ({quantity})
            </Text>
          </HStack>
          <Text className="line-clamp-1 font-medium">{title}</Text>
          <HStack space="sm" className="items-center">
            <Text className="font-semibold text-green-700">
              ${price.toFixed(2)}
            </Text>
            {discount > 0 && (
              <Text className="text-gray-500 line-through">
                ${discount.toFixed(2)}
              </Text>
            )}
          </HStack>
        </VStack>
      </Card>
    </Pressable>
    // <Card className="flex-1 rounded-lg" variant="filled">
    //   <Image
    //     style={{
    //       width: "100%",
    //       aspectRatio: 3 / 2,
    //       borderRadius: 20,
    //     }}
    //     source={image}
    //     placeholder={{ blurhash }}
    //     contentFit="cover"
    //     transition={1000}
    //   />
    //   <Text size="lg" bold className="text-center">
    //     hello
    //   </Text>
    //   <HStack className="items-center justify-between">
    //     <Text size="xs" className="bg-orange rounded-full p-2 text-white">
    //       Breakfast
    //     </Text>
    //     <Text>5 Ingredient</Text>
    //   </HStack>
    //   {/* <Icon
    //       as={Heart}
    //       className={`m-2 h-5 w-5 text-red-400 ${fill && "fill-red-400"}`}
    //     /> */}
    // </Card>
  );
}

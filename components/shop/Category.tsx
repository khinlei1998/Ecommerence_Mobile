import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Pressable } from "../ui/pressable";
import { Image } from "expo-image";
import { CategoryType } from "@/types";
import { IMG_URL } from "@/config";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface CategoryProps extends CategoryType {
  onSelect: (id: number) => void;
  select: number;
}
function Category({ id, name, image, onSelect, select }: CategoryProps) {
  return (
    <Pressable onPress={() => onSelect(id)}>
      <Card className="items-center">
        <Image
          style={[
            { width: 56, height: 56 },
            select === id
              ? { borderRadius: 28, borderWidth: 2, borderColor: "orange" }
              : { borderRadius: 28 },
          ]}
          source={IMG_URL + image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Text size="sm" bold className="mt-3">
          {name}
        </Text>
      </Card>
    </Pressable>
  );
}
export default memo(Category);

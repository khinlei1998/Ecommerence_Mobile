import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Pressable } from "../ui/pressable";
import { Image } from "expo-image";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type CategoryProps = {
  id: number;
  name: string;
  image: string;
  onSelect: (id: number) => void;
  select: number;
};
function Category({ id, name, image, onSelect, select }: CategoryProps) {
  console.log("Category Render---", id);
  return (
    <Pressable onPress={() => onSelect(id)}>
      <Card className="items-center" variant="filled">
        <Image
          style={[
            { width: 56, height: 56 },
            select === id
              ? { borderRadius: 28, borderWidth: 2, borderColor: "orange" }
              : { borderRadius: 28 },
          ]}
          source={image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Text size="sm" bold>
          {name}
        </Text>
      </Card>
    </Pressable>
  );
}
export default memo(Category);

import React, { memo } from "react";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
type TitleProps = {
  title: string;
  actionText: string;
};

function Ttitle({ title, actionText }: TitleProps) {
  return (
    <HStack className="items-center justify-between">
      <Text size="lg" className="font-medium text-black">
        {title}
      </Text>
      <Pressable>
        <Text className="font-medium text-gray-500">{actionText}</Text>
      </Pressable>
    </HStack>
  );
}

export default memo(Ttitle);

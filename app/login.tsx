import React, { useContext, useState } from "react";
import { router } from "expo-router";
import { useSession } from "@/provider/auth_ctx";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

const SignIn = () => {
  const { signIn } = useSession();
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const onSubmit = async (formState: any) => {
    console.log("formState", formState);
    await signIn(formState);
    router.replace("/");
  };
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HStack space="sm" className="mt-3 items-center justify-end">
          <Image
            source={require("@/assets/images/react-logo.png")}
            alt="fashion"
            className="h-8 w-8"
          />
          <Text size="xl" bold>
            Fashion
          </Text>
        </HStack>

        <VStack space="4xl">
          <VStack space="lg">
            <Heading size="3xl" bold className="leading-snug">
              Sign in {"\n"}to your account
            </Heading>
            <Text size="lg" className="font-semibold text-gray-500">
              Enter your phone & password to login
            </Text>
          </VStack>

          {/* Form */}

          <FormControl
            isInvalid={false}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={true}
          >
            <VStack space="xs">
              <FormControlLabel>
                <FormControlLabelText className="text-lg font-semibold text-gray-500">
                  Phone Number
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "This is required.",
                  },
                  minLength: {
                    value: 7,
                    message: "Enter atleat seven number .",
                  },
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className="h-16 rounded-lg border-gray-200 bg-white"
                    size="xl"
                  >
                    <InputField
                      placeholder="09****"
                      inputMode="numeric"
                      maxLength={12}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                )}
                name="phone"
              />
              {errors.phone && (
                <Text size="md" className="text-red-400">
                  {errors.phone.message}
                </Text>
              )}
            </VStack>

            <VStack space="xs" className="mt-5">
              <FormControlLabel>
                <FormControlLabelText className="text-lg font-semibold text-gray-500">
                  Password
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "This is required.",
                  },
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 digits.",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "Please Enter digits only.",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    className="h-16 rounded-lg border-gray-200 bg-white"
                    size="xl"
                  >
                    <InputField
                      type={showPassword ? "text" : "password"}
                      placeholder="***"
                      inputMode="numeric"
                      maxLength={17}
                      value={value}
                      onChangeText={onChange}
                    />
                    <InputSlot className="pr-3" onPress={handleState}>
                      <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                  </Input>
                )}
                name="password"
              />
              {errors.password && (
                <Text size="md" className="text-red-400">
                  {errors.password.message}
                </Text>
              )}
              <FormControlHelper>
                <FormControlHelperText>
                  Must be atleast 8 characters.
                </FormControlHelperText>
              </FormControlHelper>
            </VStack>
          </FormControl>
          <Text size="md" bold className="text-right text-blue-500">
            Forgot Password?
          </Text>

          <Button
            className="h-16 rounded-lg bg-blue-600"
            onPress={handleSubmit(onSubmit)}
          >
            <ButtonText className="text-lg font-bold">Log In</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignIn;

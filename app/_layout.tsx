import { Slot } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SessionProvider } from "@/provider/auth_ctx";
import { SafeAreaView } from "react-native";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// Create a client

const queryClient = new QueryClient();

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <SessionProvider>
          <Slot />
        </SessionProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

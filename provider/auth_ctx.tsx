import { View, Text } from "react-native";
import React, { useState } from "react";
export const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState();

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setSession("session");
          // Perform sign-in logic here
        },
        signOut: () => {
          setSession(null);
          // Perform sign-out logic here
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 *
 * This file was strongly inspired by expo docs guide: https://docs.expo.dev/router/reference/authentication
 *
 */
import * as React from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  createdAt: string;
  lastLoginAt: string;
}

interface ContextInterface {
  user: User | null;
  signIn: React.Dispatch<React.SetStateAction<User | null>>;
  signOut: React.Dispatch<React.SetStateAction<User | null>>;
}

// create context
const AuthContext = React.createContext<ContextInterface | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a Provider");
  }

  return context;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    // this prevent navigation before root navigation is mounted
    if (!navigationState?.key) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/(tabs)");
    }
  }, [user, segments, navigationState]);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = React.useState<User | null>(null);

  useProtectedRoute(user);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const dataWeCareAbout: User = {
          uid: user.uid,
          displayName: user.displayName!,
          photoURL: user.photoURL ?? "",
          providerId: user.providerId,
          createdAt: user.metadata.creationTime!,
          lastLoginAt: user.metadata.lastSignInTime!,
        };
        setUser(dataWeCareAbout);
      } else {
        console.log("user is not authenticated");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn: setUser, signOut: () => setUser(null) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

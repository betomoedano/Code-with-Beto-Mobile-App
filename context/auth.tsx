/**
 *
 * This file was strongly inspired by expo docs guide: https://docs.expo.dev/router/reference/authentication
 *
 */
import * as React from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

const userInitialState = {
  uid: "",
  createdAt: "",
  displayName: "",
  lastLoginAt: "",
  photoURL: "",
  providerId: "",
  email: "",
};

const contextInitialState: ContextInterface = {
  user: userInitialState,
  signIn: () => {},
  signOut: () => {},
};

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  createdAt: string;
  lastLoginAt: string;
  email: string;
}

interface ContextInterface {
  user: User | null;
  signIn: React.Dispatch<React.SetStateAction<User>>;
  signOut: () => void;
}

// create context
const AuthContext = React.createContext<ContextInterface>(contextInitialState);

// This hook can be used to access the user info.
export function useAuth(): ContextInterface {
  const context = React.useContext<ContextInterface>(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a Provider");
  }

  return context;
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const [hasNavigated, setHasNavigated] = React.useState(false);

  React.useEffect(() => {
    if (!navigationState?.key || hasNavigated) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!user.uid && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
      setHasNavigated(true);
    } else if (user.uid && inAuthGroup) {
      router.replace("/(tabs)");
      setHasNavigated(true);
    }
  }, [user.uid, segments, navigationState, hasNavigated]);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = React.useState<User>(userInitialState);

  useProtectedRoute(user);

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        const dataWeCareAbout: User = {
          uid: user.uid,
          displayName: user.providerData[0].displayName ?? "",
          photoURL: user.providerData[0].photoURL ?? "",
          providerId: user.providerData[0].providerId,
          email: user.providerData[0].email ?? "",
          createdAt: user.metadata.creationTime!,
          lastLoginAt: user.metadata.lastSignInTime!,
        };
        setUser(dataWeCareAbout);
        router.replace("/(tabs)");
      } else {
        console.log("user is not authenticated");
        router.replace("/(auth)/sign-in");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: setUser,
        signOut: () => {
          setUser(userInitialState);
          signOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

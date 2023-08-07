import * as React from "react";
import { router, useSegments } from "expo-router";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  createdAt: string;
  lastLoginAt: string;
}

// create context
const AuthContext = React.createContext(null);

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

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, segments]);
}

export function Provider({ children }: React.PropsWithChildren) {
  const [user, setUser] = React.useState<User | null>(null);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

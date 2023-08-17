import { Text, View } from "@/components/Themed";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import * as React from "react";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { auth } from "@/firebaseConfig";
import { createTokenWithCode } from "@/utils/createGitHubToken";
import { Image, StyleSheet, useColorScheme } from "react-native";
import AppleLoginButton from "@/components/AppleLoginButton";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function Index(): JSX.Element {
  const currentTheme = useColorScheme();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: ["identity", "user:email", "user:follow"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {
    if (response?.type === "success") {
      const { code } = response.params;
      const { token_type, scope, access_token } = await createTokenWithCode(
        code
      );
      console.log("getGithubTokenAsync: ", {
        token_type,
        scope,
        access_token,
      });

      if (!access_token) return;
      const credential = GithubAuthProvider.credential(access_token);
      const data = await signInWithCredential(auth, credential);

      fetch("https://api.github.com/user/following/betomoedano", {
        method: "PUT",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            console.log("Successfully followed!");
          } else {
            console.log("Failed to follow.");
          }
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });

      console.log("credential: ", credential);
      console.log("data: ", JSON.stringify(data, null, 2));
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 50 }}
      />
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>
        Code with Beto
      </Text>
      <Text style={{ marginBottom: 90 }}>Visit codewithbeto.dev today!</Text>
      <View>
        <Icon.Button
          name="github"
          color={currentTheme === "dark" ? "white" : "black"}
          backgroundColor="transparent"
          size={30}
          onPress={() => {
            promptAsync({ windowName: "Code with Beto" });
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            Sign In with Github
          </Text>
        </Icon.Button>
      </View>
      <AppleLoginButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

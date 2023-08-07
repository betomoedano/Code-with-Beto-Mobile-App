import { Text, View } from "@/components/Themed";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import * as React from "react";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { auth } from "@/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

async function createTokenWithCode(code: string) {
  const url =
    `https://github.com/login/oauth/access_token` +
    `?client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}` +
    `&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}` +
    `&code=${code}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export default function Auth(): JSX.Element {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: ["identity"],
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
      console.log("credential: ", credential);
      console.log("data: ", JSON.stringify(data, null, 2));
    }
  }

  return (
    <View>
      <Text>Sign In with GitHub</Text>
      <Icon.Button
        name="github"
        color="white"
        backgroundColor="transparent"
        onPress={() => {
          promptAsync();
        }}
      >
        Sign In with Github
      </Icon.Button>
    </View>
  );
}

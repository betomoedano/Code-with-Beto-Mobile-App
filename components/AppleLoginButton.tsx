import * as React from "react";
import { Alert, useColorScheme } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { auth } from "../firebaseConfig";
import { signInWithCredential, OAuthProvider } from "firebase/auth";

export default function AppleLoginButton(): JSX.Element {
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] =
    React.useState<boolean>(false);
  const currentTheme = useColorScheme();
  const btnStyle =
    currentTheme == "dark"
      ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
      : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK;

  React.useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
  }, []);

  const handleSignInWithApple = async () => {
    const nonce = Math.random().toString(36).substring(2, 10);

    try {
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const appletAuthCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
        nonce: hashedNonce,
      });
      const { identityToken } = appletAuthCredential;
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken!,
        rawNonce: nonce,
      });
      // console.log("Credential from Apple", appletAuthCredential);
      // console.log("Credential", credential);

      const data = await signInWithCredential(auth, credential);
      // console.log(JSON.stringify(data, null, 2));
      return data;
    } catch (e) {
      Alert.alert("Something went wrong", "Please try again :(");
    }
  };

  if (!isAppleLoginAvailable) return <></>;
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={btnStyle}
      cornerRadius={5}
      style={{ width: "100%", height: 44 }}
      onPress={handleSignInWithApple}
    />
  );
}

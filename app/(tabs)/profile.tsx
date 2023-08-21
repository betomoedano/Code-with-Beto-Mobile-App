import { Button, Image, SafeAreaView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/auth";

export default function Profile() {
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {user?.photoURL && (
          <Image
            source={{ uri: user.photoURL }}
            width={80}
            height={80}
            style={{ borderRadius: 100 }}
          />
        )}

        <Text>Name: {user?.displayName}</Text>
        <Text>{user?.createdAt}</Text>
        <Text>{user?.lastLoginAt}</Text>
        <Text>{user?.providerId}</Text>
        <Text>{user?.email}</Text>
        <Text>{user?.uid}</Text>
        <Button title="sign out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

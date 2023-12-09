import { Text, View } from "@/components/Themed";
import { useCreatePostMutation } from "@/services/posts";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet } from "react-native";

export default function CreateTodo(): JSX.Element {
  const [createPost, { isLoading, isError, data }] = useCreatePostMutation();

  function handleCreatePost() {
    createPost({ author: "Alberto", content: "Random content" });
  }

  return (
    <View style={styles.container}>
      {isError && <Text style={styles.title}>Something went wrong</Text>}
      {isLoading && <Text style={styles.title}>Is Creating</Text>}
      {data && (
        <Text style={styles.title}>
          new post: {data.content} date:{" "}
          {new Date(data.createdAt).toLocaleString()}
        </Text>
      )}
      <Text style={styles.title}>Create Post</Text>
      <Link href={"/(tabs)/"} asChild>
        <Button title="Close" />
      </Link>
      <Button title="Create Post" onPress={handleCreatePost} />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

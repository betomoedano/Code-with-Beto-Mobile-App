import { Button, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  useDeletePostMutation,
  useFindAllPostsQuery,
  useUpdatePostMutation,
} from "@/services/posts";

export default function TabOneScreen() {
  const { isLoading, data, error } = useFindAllPostsQuery();
  const [deletePost, { data: deletePostData }] = useDeletePostMutation();
  const [updatePost, { data: updatePostData }] = useUpdatePostMutation();

  if (isLoading)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading</Text>
      </View>
    );
  if (error) return <Text style={styles.title}>Error</Text>;
  return (
    <View style={styles.container}>
      {data?.map((todo) => (
        <View key={todo.id}>
          <Text style={styles.title}>{todo.content}</Text>
          <Text style={styles.title}>
            {new Date(todo.createdAt).toLocaleTimeString()}
          </Text>
          <Button title="Delete" onPress={() => deletePost(todo.id)} />
          <Button
            title="updatePost"
            onPress={() => updatePost({ id: todo.id, content: "updated! 🎉" })}
          />
        </View>
      ))}
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

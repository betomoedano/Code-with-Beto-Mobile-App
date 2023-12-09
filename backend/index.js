const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const myDB = [];

app.get("/posts", (req, res) => {
  res.json(myDB);
});

app.post("/posts", (req, res) => {
  const newPost = {
    id: myDB.length + 1,
    author: req.body.author,
    content: req.body.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  myDB.push(newPost);
  setTimeout(() => {
    res.status(201).json(newPost);
  }, 2000);
});

app.put("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = myDB.findIndex((post) => post.id === postId);

  if (postIndex > -1) {
    myDB[postIndex] = {
      ...myDB[postIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(myDB[postIndex]);
  } else {
    res.status(404).send("Post not found");
  }
});

app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = myDB.findIndex((post) => post.id === postId);

  if (postIndex > -1) {
    myDB.splice(postIndex, 1);
    res.send(`Post with id ${postId} deleted`);
  } else {
    res.status(404).send("Post not found");
  }

  console.log("Deleted, this is the current data", myDB);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

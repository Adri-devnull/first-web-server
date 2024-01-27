const { v4 } = require("uuid");
const PORT = 3000;
const path = require("path");
const fsPromises = require("fs/promises");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const data = await fsPromises.readFile(fileData);
    const jsonData = await JSON.parse(data);
    res.send(jsonData);
  } catch (err) {
    return res.send("Fail reading users");
  }
});

app.post("/", async (req, res) => {
  try {
    const data = await fsPromises.readFile(fileData);
    const jsonUsersData = await JSON.parse(data);

    const infoNewUser = req.body;
    const newUserData = { userId: v4(), ...infoNewUser };

    const usersList = [...jsonUsersData, newUserData];

    res.send("User created");
    await fsPromises.writeFile(fileData, JSON.stringify(usersList));
  } catch (err) {
    return res.send("Error creating user");
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const data = await fsPromises.readFile(fileData);
    const jsonUsersData = await JSON.parse(data);

    const { id } = req.params;
    const modifiedUsers = jsonUsersData.map((user) => {
      if (user.userId === id) {
        return {
          ...user,
          name: req.body.name,
          email: req.body.email,
        };
      }
      return user;
    });

    await fsPromises.writeFile(fileData, JSON.stringify(modifiedUsers));

    res.send("Modified user");
  } catch (err) {
    return res.send("We can't fin user ID");
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const data = await fsPromises.readFile(fileData);
    const jsonUsersData = await JSON.parse(data);

    const { id } = req.params;
    const modifiedUsers = jsonUsersData.filter((users) => users.userId !== id);

    await fsPromises.writeFile(fileData, JSON.stringify(modifiedUsers));

    res.send("Deleting user");
  } catch (err) {
    return res.send("User not found");
  }
});

const fileData = path.resolve(__dirname, "data/users.json");
console.log(fileData);

app.listen(PORT, () => {
  console.log("Server Listen");
});

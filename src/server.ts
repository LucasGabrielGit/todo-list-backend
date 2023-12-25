import fastify from "fastify";
import "dotenv/config";
import { UserController } from "./controllers/userController";
import { CategoryController } from "./controllers/categoryController";
import { TodoController } from "./controllers/todoController";

const app = fastify();
const userController = new UserController();
const categoryController = new CategoryController();
const todoController = new TodoController();

// User controllers
app.post("/user/create", userController.createUser);
app.get("/users", userController.findAllUsers);
app.post("/user/find", userController.findUser);
app.put("/user/update/:id", userController.updateUser);
app.delete("/user/:id", userController.deleteUser);

// Category controllers
app.post("/category/create", categoryController.create);
app.get("/category/findAll", categoryController.findAll);
app.post("/category/find", categoryController.findByDescription);
app.put("/category/update/:id", categoryController.update);
app.delete("/category/delete/:id", categoryController.delete);

// Todo controllers
app.post("/todo/create", todoController.create);
app.get("/todo/findAll", todoController.findAll);

app
  .listen({
    port: Number(process.env.PORT || 3000),
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server listening on port " + process.env.PORT);
  });

import { prisma } from "../client/prisma";

test("should return 400 if title or body is empty", async () => {
  const response = await prisma.todo.create({
    data: {
      title: "",
      body: "",
      is_done: false,
      category_id: 1,
      user_id: 1,
    },
  });

  expect(response.body).toEqual({
    message: "Title or body cannot be empty",
    data: undefined,
  });
});

test("should create a todo with the given title and body", async () => {
  const response = await prisma.todo.create({
    data: {
      title: "Test Title",
      body: "Test Body",
      is_done: false,
      category_id: 1,
      user_id: 1,
    },
  });

  expect(response).toEqual({
    message: "Todo created successfully",
    data: {
      title: "My Todo",
      body: "This is my todo",
    },
  });
});

import { Todo } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../client/prisma";

export class TodoController {
  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const data = req.body as Todo;

      if (data.title === "" || data.title === "") {
        throw new Error("Title or body cannot be empty");
      }

      await prisma.todo
        .create({
          data,
        })
        .then(() => {
          return res
            .status(201)
            .send({ message: "Todo created successfully", data: data });
        });
    } catch (err: any) {
      return res.status(500).send({ message: err.message, data: err.data });
    }
  }

  async findAll(req: FastifyRequest, res: FastifyReply) {
    try {
      const todos = await prisma.todo.findMany({
        include: {
          category: {
            select: {
              description: true,
            },
          },
          user: {
            select: {
              username: true,
              login: true,
            },
          },
        },
      });

      if (!todos || todos.length === 0) {
        return res.status(404).send({ message: "No todos found" });
      }

      return res.send(todos);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  }

  async findByTitle(req: FastifyRequest, res: FastifyReply) {
    try {
      const { title } = req.body as { title: string };
      console.log(title);
      const todo = await prisma.todo.findMany({
        where: {
          title: { contains: title },
        },
        include: {
          category: {
            select: {
              description: true,
            },
          },
          user: {
            select: {
              username: true,
              login: true,
            },
          },
        },
      });
      console.log(todo);

      if (!todo || todo.length === 0) {
        return res.status(404).send({ message: "Todo not found" });
      }

      return res.send(todo);
    } catch (err: any) {
      return res.status(500).send({ message: err.message });
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: string };

      const todo = await prisma.todo.findUniqueOrThrow({
        where: {
          id: parseInt(id),
        },
      });

      console.log(todo);
    } catch (error) {}
  }
}

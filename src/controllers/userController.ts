import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../client/prisma";

export class UserController {
  async createUser(req: FastifyRequest, res: FastifyReply) {
    try {
      const user = req.body as User;

      const userLogin = await prisma.user.findFirst({
        where: {
          login: user.login,
        },
      });

      const userUsername = await prisma.user.findFirst({
        where: {
          username: user.username,
        },
      });

      if (userLogin && userUsername) {
        return res.status(409).send({
          message: "User already exists",
        });
      }

      if (!userLogin && !userUsername) {
        await prisma.user
          .create({
            data: user,
          })
          .then(() =>
            res.status(200).send({ message: "User created successfully" })
          );
      }
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }

  async findAllUsers(req: FastifyRequest, res: FastifyReply) {
    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      return res.status(404).send({
        message: "Users not found",
      });
    }

    return res.send(users);
  }

  async findUser(req: FastifyRequest, res: FastifyReply) {
    try {
      const { param } = req.body as { param: string };

      const user = await prisma.user.findFirst({
        where: {
          username: param,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.send(user);
    } catch (error) {
      return res.status(500).send({
        message: `Internal Server Error: ${error}`,
      });
    }
  }

  async deleteUser(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: string };

      const user = await prisma.user.findFirst({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      await prisma.user.delete({ where: { id: user.id } }).then(() => {
        return res.status(200).send({ error: "User deleted successfully" });
      });
    } catch (error) {
      return res
        .status(404)
        .send({ error: "An error occurred when trying to delete the user" });
    }
  }

  async updateUser(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      const userData = req.body as User;

      if (userExists) {
        const updatedUser = await prisma.user.update({
          data: userData,
          where: { id: userExists.id },
        });
        return res
          .status(200)
          .send({
            message: `User successfully updated`,
            updatedUser: updatedUser,
          });
      } else {
        return res.status(501).send({ error: "User not found" });
      }
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  }
}

import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../client/prisma";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

export class UserController {
  async createUser(req: FastifyRequest, res: FastifyReply) {
    try {
      const user = req.body as User;
      console.log(user);

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

      const hashedPassword = await hash(user.password, 8);

      if (!userLogin && !userUsername) {
        await prisma.user
          .create({
            data: { ...user, password: hashedPassword },
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
        return res.status(200).send({
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

  async signIn(req: FastifyRequest, res: FastifyReply) {
    try {
      const { login, password } = req.body as {
        login: string;
        password: string;
      };

      const user = await prisma.user.findFirst({
        where: {
          login,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const isPasswordCorrect = await compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).send({ message: "Invalid password" });
      }

      const token = sign({}, String(process.env.JWT_SECRET_KEY), {
        subject: user.id.toString(),
        expiresIn: "30m",
      });

      return res.status(200).send({ token: token, user: user });
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  }
}

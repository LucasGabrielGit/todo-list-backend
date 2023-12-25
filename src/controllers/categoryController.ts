import { Category } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../client/prisma";

export class CategoryController {
  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const data = req.body as Category;

      if (
        !(await prisma.category.findFirst({
          where: {
            description: data.description,
          },
        }))
      ) {
        await prisma.category.create({ data }).then((response) => {
          return res.status(201).send({
            message: "Category created successfully",
            data: response,
          });
        });
      } else {
        return res.status(501).send({ message: "Category already exists" });
      }
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  }

  async findByDescription(req: FastifyRequest, res: FastifyReply) {
    try {
      const { description } = req.body as { description: string };

      const category = await prisma.category.findFirst({
        where: {
          description,
        },
      });

      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }

      return res.send(category);
    } catch (error) {}
  }

  async findAll(req: FastifyRequest, res: FastifyReply) {
    try {
      const categories = await prisma.category.findMany();

      if (!categories || categories.length === 0) {
        return res.status(404).send({ message: "Not categories found" });
      }

      return res.send(categories);
    } catch (error) {}
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const data = req.body as Category;

      const oldCategory = await prisma.category.findUniqueOrThrow({
        where: { id: parseInt(id) },
      });

      if (!oldCategory) {
        return res.status(404).send({ error: "Category not found" });
      }

      await prisma.category
        .update({
          data,
          where: {
            id: oldCategory.id,
          },
        })
        .then(() => {
          return res.status(200).send({
            error: "Category successfully updated",
            oldCategory: oldCategory,
            updatedCategory: data,
          });
        });
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const { id } = req.params as { id: string };

      const category = await prisma.category.findUniqueOrThrow({
        where: { id: parseInt(id) },
      });

      if (!category) {
        return res.status(404).send({ error: "Category not found" });
      }

      await prisma.category
        .delete({
          where: {
            id: category.id,
          },
        })
        .then(() => {
          return res.status(200).send({
            error: "Category deleted successfully",
          });
        });
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
}

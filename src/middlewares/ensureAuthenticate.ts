import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";
import "dotenv/config";

export async function ensureAuthenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    reply.status(401).send({
      message: "Token is missing",
    });
    return;
  }

  const [, token] = authToken.split(" ");

  try {
    return verify(token, String(process.env.JWT_SECRET));
  } catch (err) {
    return reply.status(401).send({
      message: "Invalid Token",
    });
  }
}
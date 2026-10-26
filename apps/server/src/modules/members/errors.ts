import { ApplicationError } from "@/errors/error";

export const memberErrors = {
  nameNotFound: (name: string) => new ApplicationError("MEMBER_NOT_FOUND", 404, `${name} is not found.`),
  notFound: (id: bigint) => new ApplicationError("MEMBER_NOT_FOUND", 404, `ID ${id} is not found.`)
};

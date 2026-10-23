import { ApplicationError } from "@/errors/error";

export const memberErrors = {
  notFound: (id: bigint) => new ApplicationError("MEMBER_NOT_FOUND", 404, `ID ${id} is not found.`)
};

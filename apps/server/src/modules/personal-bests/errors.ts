import { ApplicationError } from "@/errors/error";

export const personalBestErrors = {
  notAwaitingReview: (id: number) =>
    new ApplicationError("PB_NOT_AWAITING_REVIEW", 409, `ID ${id} is not awaiting review.`),
  notFound: (id: number) => new ApplicationError("PB_NOT_FOUND", 404, `ID ${id} is not found.`)
};

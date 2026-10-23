import { ApplicationError } from "@/errors/error";

export const submissionErrors = {
  notAwaitingReview: (id: number) =>
    new ApplicationError("SUBMISSION_NOT_AWAITING_REVIEW", 409, `ID ${id} is not awaiting review.`),
  notFound: (id: number) => new ApplicationError("SUBMISSION_NOT_FOUND", 404, `ID ${id} is not found.`)
};

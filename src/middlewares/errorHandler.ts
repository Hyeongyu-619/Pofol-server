import { NextFunction, Request, Response } from "express";

function errorHandler(
  error: Error,
  req: any,
  res: Response,
  next: NextFunction
) {
  switch (error.name) {
    case "Unauthorized":
      res.status(401);
      break;
    case "Forbidden":
      res.status(403);
      break;
    case "NotFound":
      res.status(404);
      break;
    case "NotAcceptable":
      res.status(406);
      break;
    case "Conflict":
      res.status(409);
      break;
    default:
      res.status(400);
  }
  res.json({ result: error.name, reason: error.message });
}

export { errorHandler };

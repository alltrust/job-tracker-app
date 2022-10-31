import { Request, Response, NextFunction } from "express";

const notFoundMiddlware = (req: Request, res: Response, next: NextFunction) =>
  res.status(404).send("Route not found - from not-found MIDDLEWARE");

export default notFoundMiddlware;

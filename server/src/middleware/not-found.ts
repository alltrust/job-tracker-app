import { Request, Response} from "express";

const notFoundMiddlware = (req: Request, res: Response) =>
  res.status(404).send("Route not found - from not-found MIDDLEWARE");

export default notFoundMiddlware;

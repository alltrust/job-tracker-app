import { setupServer } from "msw/node";
import {
  Path,
  rest,
  RestContext,
  RestRequest,
  ResponseComposition,
  DefaultBodyType,
} from "msw";

interface IHandlerConfig {
  path: Path;
  res: (
    req: RestRequest,
    res: ResponseComposition<DefaultBodyType> | ((arg0: any) => any),
    ctx: RestContext
  ) => {};
}

export const createServer = (handlerConfig: IHandlerConfig[]) => {
  const handlers = handlerConfig.map((config) => {
    return rest.all(config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
  });
};



import express, { Application, RequestHandler, Router } from "express";
import { Server } from "http";
import { ServerConfiguration } from "./config";

interface RequestHandlerFactory {
  (): RequestHandler;
}

export interface BaseModule {
  createRequestHandler: RequestHandlerFactory;
}

export interface RouterModule extends BaseModule {
  route: string;
}

export function createSimpleRouterModule(
  route: string,
  factory: RequestHandlerFactory
): RouterModule {
  return {
    createRequestHandler: factory,
    route,
  };
}

export function createModuleFromMiddleware(
  factory: RequestHandlerFactory
): BaseModule {
  return {
    createRequestHandler: factory,
  };
}

class ServerModule {
  constructor(private config: ServerConfiguration, ...modules: BaseModule[]) {
    this.app = express();
    modules.forEach((mod) => {
      const { route } = mod as RouterModule;
      if (route) {
        this.app.use(route, mod.createRequestHandler());
      } else {
        this.app.use(mod.createRequestHandler());
      }
    });
  }

  private app: Application;
  private server?: Server;

  public start = async () => {
    console.log("Starting server...");
    if (!this.server) {
      this.server = await new Promise<Server>((resolve) => {
        const server = this.app.listen(this.config.getPort(), () => {
          console.log("Server started on port", this.config.getPort());
          resolve(server);
        });
      });
    } else {
      throw new Error("START FAILURE: Server already started");
    }
  };

  public stop = () => {
    if (this.server) {
      console.log("Stopping server...");
      this.server.close();
      console.log("Server stopped.");
    } else {
      throw new Error("STOP FAILURE: Server is not started.");
    }
  };
}

export default ServerModule;

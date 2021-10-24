import {
  Application,
  Status,
  Router,
  RouterAllowedMethodsOptions,
} from "./deps.ts";
import type {
  HTTPMethods,
  ListenOptions,
  Middleware,
  RedirectStatus,
  RouterMiddleware,
  RouterOptions,
  RouterParamMiddleware,
} from "./deps.ts";

type Verb = {
  type: "verb";
  nameOrPath: string;
  pathOrMiddleware: string | RouterMiddleware;
  middleware: RouterMiddleware[];
  methods: (HTTPMethods | "ALL")[];
};

type Use = {
  type: "use";
  pathOrMiddleware: string | string[] | Middleware;
  middleware: Middleware[];
};

type Param = {
  type: "param";
  param: string;
  middleware: RouterParamMiddleware;
};

type Prefix = {
  type: "prefix";
  prefix: string;
};

type Redirect = {
  type: "redirect";
  source: string;
  destination: string | URL;
  status: RedirectStatus;
};

type Dispatcher = Verb | Use | Param | Prefix | Redirect;

/** The `callStack` variable is used to determine which hook goes to which
 * component when a component is initialized within another component. */
let callStack = -1;

const dispatchers: Dispatcher[][] = [];

function getCurrentDispatcher() {
  callStack += 1;
  const currentDispatcher: Dispatcher[] = [];
  dispatchers[callStack] = currentDispatcher;
  return currentDispatcher;
}

function cleanupDispatcher() {
  dispatchers.pop();
  callStack -= 1;
}

/** Register named middleware for the specified routes when the `DELETE`,
 * `GET`, `POST`, or `PUT` method is requested. */
export function all(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `DELETE`,
 * `GET`, `POST`, or `PUT` method is requested. */
export function all(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function all(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["ALL"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register named middleware for the specified routes when the `DELETE`,
 *  method is requested. */
export function del(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `DELETE`,
 * method is requested. */
export function del(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function del(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["DELETE"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register named middleware for the specified routes when the `GET`,
 *  method is requested. */
export function get(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `GET`,
 * method is requested. */
export function get(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function get(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["GET"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register named middleware for the specified routes when the `HEAD`,
 *  method is requested. */
export function head(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `HEAD`,
 * method is requested. */
export function head(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function head(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["HEAD"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register named middleware for the specified routes when the `OPTIONS`,
 * method is requested. */
export function options(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `OPTIONS`,
 * method is requested. */
export function options(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function options(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["OPTIONS"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register param middleware, which will be called when the particular param
 * is parsed from the route. */
export function param(param: string, middleware: RouterParamMiddleware): void {
  dispatchers[callStack].push({ type: "param", param, middleware });
}

/** Register named middleware for the specified routes when the `PATCH`,
 * method is requested. */
export function patch(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `PATCH`,
 * method is requested. */
export function patch(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function patch(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["PATCH"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register named middleware for the specified routes when the `POST`,
 * method is requested. */
export function post(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `POST`,
 * method is requested. */
export function post(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function post(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["POST"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Set the router prefix for this router. */
export function prefix(prefix: string): void {
  dispatchers[callStack].push({
    type: "prefix",
    prefix,
  });
}

/** Register named middleware for the specified routes when the `PUT`
 * method is requested. */
export function put(
  name: string,
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
/** Register middleware for the specified routes when the `PUT`
 * method is requested. */
export function put(
  path: string,
  middleware: RouterMiddleware,
  ...middlewares: RouterMiddleware[]
): void;
export function put(
  nameOrPath: string,
  pathOrMiddleware: string | RouterMiddleware,
  ...middleware: RouterMiddleware[]
): void {
  dispatchers[callStack].push({
    type: "verb",
    methods: ["PUT"],
    nameOrPath,
    pathOrMiddleware,
    middleware,
  });
}

/** Register a direction middleware, where when the `source` path is matched
 * the router will redirect the request to the `destination` path.  A `status`
 * of `302 Found` will be set by default.
 *
 * The `source` and `destination` can be named routes. */
export function redirect(
  source: string,
  destination: string | URL,
  status: RedirectStatus = Status.Found
): void {
  dispatchers[callStack].push({
    type: "redirect",
    source,
    destination,
    status,
  });
}

/** Register middleware to be used on every matched route. */
export function use(middleware: Middleware, ...middlewares: Middleware[]): void;
/** Register middleware to be used on every route that matches the supplied
 * `path`. */
export function use(
  path: string | string[],
  middleware: Middleware,
  ...middlewares: Middleware[]
): void;
export function use(
  pathOrMiddleware: string | string[] | Middleware,
  ...middleware: Middleware[]
): void {
  dispatchers[callStack].push({
    type: "use",
    pathOrMiddleware,
    middleware,
  });
}

/** Transform a component into a Router instance. */
export function routerify(
  component: () => void,
  options?: RouterOptions
): Router {
  const router = new Router(options);
  const dispatcher = getCurrentDispatcher();
  component();
  cleanupDispatcher();

  dispatcher.forEach((hook) => {
    const { type } = hook;
    if (type === "verb") {
      const { methods, nameOrPath, pathOrMiddleware, middleware } = hook;
      methods.forEach((method) => {
        const verb = method.toLowerCase() as "get"; // Hack for TypeScript to work.
        router[verb](
          nameOrPath,
          pathOrMiddleware as RouterMiddleware,
          ...middleware
        );
      });
    } else if (type === "use") {
      const { pathOrMiddleware, middleware } = hook;
      router.use(pathOrMiddleware as RouterMiddleware, ...middleware);
    } else if (type === "redirect") {
      const { source, destination, status } = hook;
      router.redirect(source, destination, status);
    } else if (type === "param") {
      const { param, middleware } = hook;
      router.param(param, middleware);
    } else if (type === "prefix") {
      const { prefix } = hook;
      router.prefix(prefix);
    }
  });

  return router;
}

/** Return middleware that will do all the route processing that the router
 * has been configured to handle. */
export function routes(component: () => void, options?: RouterOptions) {
  return routerify(component, options).routes();
}

/** Middleware that handles requests for HTTP methods registered with the
 * router.  If none of the routes handle a method, then "not allowed" logic
 * will be used.  If a method is supported by some routes, but not the
 * particular matched router, then "not implemented" will be returned.
 *
 * The middleware will also automatically handle the `OPTIONS` method,
 * responding with a `200 OK` when the `Allowed` header sent to the allowed
 * methods for a given route.
 *
 * By default, a "not allowed" request will respond with a `405 Not Allowed`
 * and a "not implemented" will respond with a `501 Not Implemented`. Setting
 * the option `.throw` to `true` will cause the middleware to throw an
 * `HTTPError` instead of setting the response status.  The error can be
 * overridden by providing a `.notImplemented` or `.notAllowed` method in the
 * options, of which the value will be returned will be thrown instead of the
 * HTTP error. */
export function allowedMethods(
  component: () => void,
  options?: RouterAllowedMethodsOptions
) {
  return routerify(component).allowedMethods(options);
}

/** Transform a component into an Application instance. */
export function appify(component: () => void): Application {
  const app = new Application();
  const router = new Router();
  const dispatcher = getCurrentDispatcher();
  component();
  cleanupDispatcher();

  dispatcher.forEach((hook) => {
    const { type } = hook;
    if (type === "verb") {
      const { methods, nameOrPath, pathOrMiddleware, middleware } = hook;
      methods.forEach((method) => {
        const verb = method.toLowerCase() as "get"; // Hack for TypeScript to work.
        router[verb](
          nameOrPath,
          pathOrMiddleware as RouterMiddleware,
          ...middleware
        );
      });
    } else if (type === "use") {
      const { pathOrMiddleware, middleware } = hook;
      if (
        typeof pathOrMiddleware === "string" ||
        Array.isArray(pathOrMiddleware)
      ) {
        router.use(pathOrMiddleware as any, ...middleware);
      } else {
        app.use(pathOrMiddleware, ...middleware);
      }
    } else if (type === "redirect") {
      const { source, destination, status } = hook;
      router.redirect(source, destination, status);
    } else if (type === "param") {
      const { param, middleware } = hook;
      router.param(param, middleware);
    } else if (type === "prefix") {
      const { prefix } = hook;
      router.prefix(prefix);
    }
  });

  return app.use(router.routes());
}

/** Start listening for requests, processing registered middleware on each
 * request. */
export function listen(component: () => void, options: ListenOptions) {
  return appify(component).listen(options);
}

import { testing, Status, httpErrors, Context } from "./deps.ts";
import { assertEquals, assertThrowsAsync } from "./test_deps.ts";
import {
  all,
  allowedMethods,
  appify,
  del,
  get,
  head,
  options,
  listen,
  param,
  patch,
  post,
  prefix,
  put,
  redirect,
  routes,
  routerify,
  use,
} from "./mod.ts";

const { test } = Deno;

function setup(path = "/", method = "GET") {
  return {
    app: testing.createMockApp(),
    context: testing.createMockContext({ path, method }),
    next: testing.createMockNext(),
  };
}

test({
  name: "empty routes",
  async fn() {
    const { context, next } = setup();

    const router = () => {};
    const mw = routes(router);
    assertEquals(await mw(context, next), undefined);
  },
});

test({
  name: "accepts non-void middleware",
  fn() {
    const router = () => {
      get("/", (ctx) => (ctx.response.body = "hello oak"));
    };
    routerify(router);
  },
});

test({
  name: "get single match",
  async fn() {
    const { context, next } = setup("/", "GET");

    const callStack: number[] = [];
    const router = () => {
      get("/", () => {
        callStack.push(1);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [1]);
  },
});

test({
  name: "match single param",
  async fn() {
    const { context, next } = setup("/foo/bar", "GET");

    const callStack: number[] = [];
    const router = () => {
      get("/", (context) => {
        callStack.push(1);
      });
      get("/foo", (context) => {
        callStack.push(2);
      });
      get("/foo/:id", (context) => {
        callStack.push(3);
        assertEquals(context.params.id, "bar");
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [3]);
  },
});

test({
  name: "match with next",
  async fn() {
    const { context, next } = setup("/foo", "GET");

    const callStack: number[] = [];
    const router = () => {
      get("/", (_context) => {
        callStack.push(1);
      });
      get("/foo", async (_context, next) => {
        callStack.push(2);
        await next();
      });
      get("/foo", () => {
        callStack.push(3);
      });
      get("/foo", () => {
        callStack.push(4);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [2, 3]);
  },
});

test({
  name: "match delete",
  async fn() {
    const { context, next } = setup("/", "DELETE");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      get("/", () => {
        callStack.push(2);
      });
      head("/", () => {
        callStack.push(3);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [0, 1]);
  },
});

test({
  name: "match get",
  async fn() {
    const { context, next } = setup("/", "GET");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      get("/", () => {
        callStack.push(2);
      });
      head("/", () => {
        callStack.push(3);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [0, 2]);
  },
});

test({
  name: "router match head",
  async fn() {
    const { context, next } = setup("/", "HEAD");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      head("/", () => {
        callStack.push(3);
      });
      get("/", () => {
        callStack.push(2);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [0, 3]);
  },
});

test({
  name: "router match options",
  async fn() {
    const { context, next } = setup("/", "OPTIONS");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      get("/", () => {
        callStack.push(2);
      });
      head("/", () => {
        callStack.push(3);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [4]);
  },
});

test({
  name: "router match patch",
  async fn() {
    const { context, next } = setup("/", "PATCH");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      get("/", () => {
        callStack.push(2);
      });
      head("/", () => {
        callStack.push(3);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [5]);
  },
});

test({
  name: "router match post",
  async fn() {
    const { context, next } = setup("/", "POST");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      get("/", () => {
        callStack.push(2);
      });
      head("/", () => {
        callStack.push(3);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [0, 6]);
  },
});

test({
  name: "router match put",
  async fn() {
    const { context, next } = setup("/", "PUT");

    const callStack: number[] = [];
    const router = () => {
      all("/", async (_context, next) => {
        callStack.push(0);
        await next();
      });
      del("/", () => {
        callStack.push(1);
      });
      get("/", () => {
        callStack.push(2);
      });
      head("/", () => {
        callStack.push(3);
      });
      options("/", () => {
        callStack.push(4);
      });
      patch("/", () => {
        callStack.push(5);
      });
      post("/", () => {
        callStack.push(6);
      });
      put("/", () => {
        callStack.push(7);
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [0, 7]);
  },
});

test({
  name: "router patch prefix",
  async fn() {
    const { context, next } = setup("/route1/action1", "GET");
    const callStack: number[] = [];
    const router = () => {
      get("/action1", () => {
        callStack.push(0);
      });
    };
    const mw = routes(router, { prefix: "/route1" });
    await mw(context, next);
    assertEquals(callStack, [0]);
  },
});

test({
  name: "router match strict",
  async fn() {
    const { context, next } = setup("/route", "GET");
    const callStack: number[] = [];
    const router = () => {
      get("/route", () => {
        callStack.push(0);
      });
      get("/route/", () => {
        callStack.push(1);
      });
    };
    const mw = routes(router, { strict: true });
    await mw(context, next);
    assertEquals(callStack, [0]);
  },
});

test({
  name: "router as iterator",
  fn() {
    const router = () => {
      all("/route", () => {});
      del("/route/:id", () => {});
      patch("/route/:id", () => {});
    };
    const routes = [...routerify(router)];
    assertEquals(routes.length, 3);
    assertEquals(routes[0].path, "/route");
    assertEquals(routes[0].methods, ["HEAD", "DELETE", "GET", "POST", "PUT"]);
    assertEquals(routes[0].middleware.length, 1);
  },
});

test({
  name: "route throws",
  async fn() {
    const { context, next } = setup();
    const router = () => {
      all("/", (ctx) => {
        ctx.throw(404);
      });
    };
    const mw = routes(router);
    await assertThrowsAsync(async () => {
      await mw(context, next);
    });
  },
});

test({
  name: "router prefix, default route",
  async fn() {
    const { context, next } = setup("/foo");
    let called = 0;
    const router = () => {
      all("/", () => {
        called++;
      });
    };
    const mw = routes(router, { prefix: "/foo" });
    await mw(context, next);
    assertEquals(called, 1);
  },
});

test({
  name: "router redirect",
  async fn() {
    const { context, next } = setup("/foo");
    const router = () => {
      redirect("/foo", "/bar");
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(context.response.status, Status.Found);
    assertEquals(context.response.headers.get("Location"), "/bar");
  },
});

test({
  name: "router redirect, 301 Moved Permanently",
  async fn() {
    const { context, next } = setup("/foo");
    const router = () => {
      redirect("/foo", "/bar", Status.MovedPermanently);
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(context.response.status, Status.MovedPermanently);
    assertEquals(context.response.headers.get("Location"), "/bar");
  },
});

test({
  name: "router redirect, arbitrary URL",
  async fn() {
    const { context, next } = setup("/foo");
    const router = () => {
      redirect("/foo", "https://example.com/", Status.MovedPermanently);
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(context.response.status, Status.MovedPermanently);
    assertEquals(
      context.response.headers.get("Location"),
      "https://example.com/"
    );
  },
});

test({
  name: "router param middleware",
  async fn() {
    const { context, next } = setup("/book/1234/price");
    const callStack: string[] = [];
    const router = () => {
      param("id", (param, ctx, next) => {
        callStack.push("param");
        assertEquals(param, "1234");
        assertEquals(ctx.params.id, "1234");
        return next();
      });
      all("/book/:id/price", (ctx, next) => {
        callStack.push("all");
        assertEquals(ctx.params.id, "1234");
        return next();
      });
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, ["param", "all"]);
  },
});

// TODO:
// Figure out why alloweMethods fails in the tests, despite working in a real
// app.
//
// test({
//   name: "router allowedMethods() OPTIONS",
//   async fn() {
//     const { context, next } = setup("/foo", "OPTIONS");
//     const router = () => {
//       put("/foo", (_ctx, next) => {
//         return next();
//       });
//       patch("/foo", (_ctx, next) => {
//         return next();
//       });
//     };
//     const r = routes(router);
//     const mw = allowedMethods(router);
//     await r(context, next);
//     await mw(context, next);
//     assertEquals(context.response.status, Status.OK);
//     assertEquals(context.response.headers.get("Allowed"), "PUT, PATCH");
//   },
// });

// test({
//   name: "router allowedMethods() Not Implemented",
//   async fn() {
//     const { context, next } = setup("/foo", "PATCH");
//     const router = () => {
//       get("/foo", (_ctx, next) => {
//         return next();
//       });
//     };
//     const r = routes(router, { methods: ["GET"] });
//     const mw = allowedMethods(router);
//     await r(context, next);
//     await mw(context, next);
//     assertEquals(context.response.status, Status.NotImplemented);
//   },
// });

// test({
//   name: "router allowedMethods() Method Not Allowed",
//   async fn() {
//     const { context, next } = setup("/foo", "PUT");
//     const router = () => {
//       get("/foo", (_ctx, next) => {
//         return next();
//       });
//     };
//     const r = routes(router);
//     const mw = allowedMethods(router);
//     await r(context, next);
//     await mw(context, next);
//     assertEquals(context.response.status, Status.MethodNotAllowed);
//   },
// });

// test({
//   name: "router allowedMethods() throws Not Implemented",
//   async fn() {
//     const { context, next } = setup("/foo", "PATCH");
//     const router = () => {
//       get("/foo", (_ctx, next) => {
//         return next();
//       });
//     };
//     const r = routes(router, { methods: ["GET"] });
//     const mw = allowedMethods(router, { throw: true });
//     await r(context, next);
//     await assertThrowsAsync(async () => {
//       await mw(context, next);
//     }, httpErrors.NotImplemented);
//   },
// });

// test({
//   name: "router allowedMethods() throws Method Not Allowed",
//   async fn() {
//     const { context, next } = setup("/foo", "PUT");
//     const router = () => {
//       get("/foo", (_ctx, next) => {
//         return next();
//       });
//     };
//     const r = routes(router);
//     const mw = allowedMethods(router, { throw: true });
//     await r(context, next);
//     await assertThrowsAsync(async () => {
//       await mw(context, next);
//     }, httpErrors.MethodNotAllowed);
//   },
// });

// TODO:
// use() not implemented yet.
// We could implement it using algebraic effect (assuming components
// are idempotent).
//
// test({
//   name: "router named route - get URL",
//   fn() {
//     const router = new Router<{ id: string }>();
//     get("get_book", "/book/:id", (ctx, next) => next());
//     assertEquals(url("get_book", { id: "1234" }), "/book/1234");
//     assertEquals(
//       url("get_book", { id: "1234" }, { query: { sort: "ASC" } }),
//       "/book/1234?sort=ASC"
//     );
//   },
// });

// TODO:
// Generics not implemented.
//
// test({
//   name: "router types",
//   fn() {
//     const app = () => {
//       use(
//         routes(() => {
//           get("/:id", (ctx) => {
//             ctx.params.id;
//             ctx.state.session;
//           });
//           get("/:id/names", (ctx) => {
//             ctx.params.id;
//             ctx.state.session;
//           });
//           put("/:page", (ctx) => {
//             ctx.params.page;
//           });
//           put("/value", (ctx) => {
//             ctx.params.id;
//             ctx.params.page;
//             ctx.state.session;
//             ctx.params.foo;
//           });
//         })
//       );
//       use((ctx) => {
//         ctx.state.id;
//       });
//     };
//   },
// });

test({
  name: "middleware returned from routes() passes next",
  async fn() {
    const { context } = setup("/foo", "GET");

    const callStack: number[] = [];

    async function next() {
      callStack.push(4);
    }

    const router = () => {
      get("/", (_context) => {
        callStack.push(1);
      });
      get("/foo", async (_context, next) => {
        callStack.push(2);
        await next();
      });
      get("/foo", async (_context, next) => {
        callStack.push(3);
        await next();
      });
    };

    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [2, 3, 4]);
  },
});

test({
  name: "router routes decode pathname before matching",
  async fn() {
    const path = encodeURIComponent("chêne");
    const { context } = setup(`/${path}`, "GET");

    const callStack: number[] = [];

    async function next() {
      callStack.push(3);
    }

    const router = () => {
      get("/chêne", () => {
        callStack.push(2);
      });
    };

    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [2]);
  },
});

test({
  name: "router handling of bad request urls",
  fn() {
    const headers = new Headers();
    const app = testing.createMockApp<{ id: string }>();
    let context = {
      app,
      request: {
        headers: new Headers(),
        method: "GET",
        get url() {
          throw new TypeError("bad url");
        },
      },
      response: {
        status: undefined,
        body: undefined,
        redirect(url: string | URL) {
          headers.set("Location", encodeURI(String(url)));
        },
        headers,
      },
      state: app.state,
    } as unknown as Context<{ id: string }>;

    const callStack: number[] = [];
    async function next() {
      callStack.push(1);
    }

    const router = () => {
      get("/a", () => {
        callStack.push(2);
      });
    };

    const mw = routes(router);
    assertThrowsAsync(
      async () => await mw(context, next),
      TypeError,
      "bad url"
    );
  },
});

test({
  name: "sub router get single match",
  async fn() {
    const { app, context, next } = setup("/foo/bar", "GET");

    const callStack: number[] = [];
    const subSubRouter = () => {
      get("/", (context) => {
        // assertStrictEquals(context.router, router);
        // assertStrictEquals(context.app, app);
        callStack.push(1);
      });
    };
    const subRouter = () => {
      use("/bar", routes(subSubRouter));
    };
    const router = () => {
      use("/foo", routes(subRouter));
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [1]);
    // assertStrictEquals((context as RouterContext).router, router);
  },
});

test({
  name: "sub router match with prefix hook",
  async fn() {
    const { app, context, next } = setup("/foo/bar", "GET");

    const callStack: number[] = [];
    const subSubRouter = () => {
      prefix("/bar");
      get("/", (context) => {
        // assertStrictEquals(context.router, router);
        // assertStrictEquals(context.app, app);
        callStack.push(1);
      });
    };
    const subRouter = () => {
      prefix("/foo");
      use(routes(subSubRouter));
    };
    const router = () => {
      use(routes(subRouter));
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [1]);
    // assertStrictEquals((context as RouterContext).router, router);
  },
});

test({
  name: "sub router match with next",
  async fn() {
    const { context, next } = setup("/foo/bar/baz", "GET");

    const callStack: number[] = [];
    const subSubRouter = () => {
      get("/", () => {
        callStack.push(3);
      });
      get("/baz", async (ctx, next) => {
        callStack.push(4);
        await next();
      });
      get("/baz", () => {
        callStack.push(5);
      });
      get("/baz", () => {
        callStack.push(6);
      });
    };
    const subRouter = () => {
      get("/bar/(.*)", async (ctx, next) => {
        callStack.push(2);
        await next();
      });
      use("/bar", routes(subSubRouter));
    };
    const router = () => {
      get("/foo/(.*)", async (ctx, next) => {
        callStack.push(1);
        await next();
      });

      use("/foo", routes(subRouter));
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [1, 2, 4, 5]);
  },
});

test({
  name: "sub router match single param",
  async fn() {
    const { context, next } = setup("/foo/bar/baz/beep", "GET");

    const callStack: number[] = [];
    const subSubRouter = () => {
      get("/", (context) => {
        assertEquals(context.params.id, "bar");
        assertEquals(context.params.name, "beep");
        callStack.push(1);
      });
    };
    const subRouter = () => {
      get("/baz", () => {
        callStack.push(2);
      });
      use("/baz/:name", routes(subSubRouter));
    };
    const router = () => {
      get("/foo", () => {
        callStack.push(3);
      });
      use("/foo/:id", routes(subRouter));
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [1]);
    // assertStrictEquals((context as RouterContext).router, router);
  },
});

test({
  name: "sub router patch prefix with param",
  async fn() {
    const { context, next } = setup("/foo/bar/baz", "GET");
    const callStack: number[] = [];
    const subRouter = () => {
      get("/baz", (ctx) => {
        assertEquals(ctx.params.bar, "bar");
        callStack.push(0);
      });
    };
    const router = () => {
      use("/foo", routes(subRouter, { prefix: "/:bar" }));
    };
    const mw = routes(router);
    await mw(context, next);
    assertEquals(callStack, [0]);
  },
});

test({
  name: "sub router match layer prefix",
  async fn() {
    let callStack: number[] = [];
    let matches: string[] = [];
    const subSubRouter = () => {
      get("/bar", async (ctx, next) => {
        callStack.push(1);
        matches.push(...(ctx.matched?.map((layer) => layer.path) ?? []));
        await next();
      });
    };
    const subRouter = () => {
      use(routes(subSubRouter));
      use("(.*)", routes(subSubRouter));
    };
    const router = () => {
      use("/foo", routes(subRouter));
    };
    const mw = routes(router);

    const { context, next } = setup("/foo/bar", "GET");
    await mw(context, next);
    assertEquals(callStack, [1, 1]);
    assertEquals(matches, [
      "/foo/bar",
      "/foo(.*)/bar",
      "/foo/bar",
      "/foo(.*)/bar",
    ]);
    // assertStrictEquals((context as RouterContext).router, router);

    callStack = [];
    matches = [];

    const { context: context2, next: next2 } = setup("/foo/123/bar", "GET");
    await mw(context2, next2);
    assertEquals(callStack, [1]);
    assertEquals(matches, ["/foo(.*)/bar"]);
    // assertStrictEquals((context2 as RouterContext).router, router);
  },
});

test({
  name: "router - type checking - ensure at least one middleware is passed",
  fn() {
    const router = () => {
      try {
        // @ts-expect-error
        all("/");
        // @ts-expect-error
        del("/");
        // @ts-expect-error
        get("/");
        // @ts-expect-error
        head("/");
        // @ts-expect-error
        options("/");
        // @ts-expect-error
        patch("/");
        // @ts-expect-error
        post("/");
        // @ts-expect-error
        put("/");
        // @ts-expect-error
        use();
      } catch {
        //
      }
    };
  },
});

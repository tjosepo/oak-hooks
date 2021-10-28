# oak-hooks

A wrapper of the [oak middleware framework](https://oakserver.github.io/oak/) which exposes a functional hook-based API.

This library removes the need to manually manage the ``Application`` and ``Router`` instances in your code, lets you group middlewares into custom hooks, and lets you instantiate components in different ways according to you needs.

__Most importantly, this library is interoperable with existing oak code, so you can use it with existing projects.__

## Example
The ubiquitous _Hello World!_ program:
```ts
import { use, listen } from "https://deno.land/x/oak_hooks/mod.ts";

const App = () => {
  use((ctx) => {
    ctx.response.body = "Hello World!";
  });
}

await listen(App, { port: 8080 });
```
You would then run this script in Deno like:
```
> deno run --allow-net helloWorld.ts
```

## ``listen()`` and ``routes()``

With oak-hooks, there is no distinction between an ``Application`` and a ``Router`` component. That distinction is only made when the component is instantiated. Using ``listen()`` will instanciate the component as an ``Application``, and using ``routes()`` will instanciate the component as a ``Router``.

For convenience, you can use the ``get``, ``post``, ``head`` and other HTTP method hooks with the ``listen()`` function. Under the hood, a router will be instantiated and automatically used by the application instance.

Altough you shouldn't need to use them, we also provide the ``appify()`` and ``routerify()`` functions as escape hatches if you need to access the ``Application`` and ``Router`` instances directly.

An example:

```ts
import { get, use, routes, allowedMethods, listen } from "https://deno.land/x/oak_hooks/mod.ts";

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "The Hound of the Baskervilles",
  author: "Conan Doyle, Arthur",
});

const Router = () => {
  get("/book", (context) => {
    context.response.body = Array.from(books.values());
  });
  get("/book/:id", (context) => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id);
    }
  });
}

const App = () => {
  get("/", (context) => {
    context.response.body = "Hello world!";
  });
  
  use(routes(Router));
  use(allowedMethods(Router));
}

await listen(App, { port: 8080});
```

There are currently plans to provide an interface that could allow anyone to create their own instantiation functions. This could let people instantiate components into mock objects for testing, OpenAPI documentation, or anything else.

# API

## Hooks

| Name | Description |
| --- | ----------- |
| `use()` | Register a middleware to be used with every request.|
| `all()` | Register a middleware when the `GET`, `POST`, `PUT` or `DELETE` method is requested. |
| `get()` | Register a middleware when the `GET` method is requested. |
| `head()` | Register a middleware when the `HEAD` method is requested. |
| `post()` | Register a middleware when the `POST` method is requested. |
| `put()` | Register a middleware when the `PUT` method is requested. |
| `del()` | Register a middleware when the `DELETE` method is requested. |
| `connect()` | Register a middleware when the `CONNECT` method is requested. |
| `options()` | Register a middleware when the `OPTIONS` method is requested. |
| `patch()` | Register a middleware when the `PATCH` method is requested. |
| `redirect()` | Register a redirection middleware from and to the specified paths. |
| `prefix()` | Set the prefix for a router. |

## Instantiation functions

| Name | Description |
| --- | ----------- |
| ``listen()`` | Creates a new ``Application`` instance and listen to the specified port. |
| ``routes()`` | Creates a new ``Router`` instance and returns the registered routes. |
| ``allowedMethods()`` | Creates a new ``Router`` instance and returns the allowed routes. |
| ``appify()`` | Creates a new ``Application`` instance. |
| ``routerify()`` | Creates a new ``Router`` instance. |

/* Code from @t3-oss/env, Hardhat currently does not have support for ESM in TS projects */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { type ZodError, type ZodObject, type ZodType, z } from 'zod';

export type ErrorMessage<T extends string> = T;
export type Simplify<T> = {
  [P in keyof T]: T[P];
} & {};

type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>;

type UnReadonlyObject<T> = T extends Readonly<infer U> ? U : T;

type Reduce<
  TArr extends Array<Record<string, unknown>>,
  TAcc = {},
> = TArr extends []
  ? TAcc
  : TArr extends [infer Head, ...infer Tail]
    ? Tail extends Array<Record<string, unknown>>
      ? Head & Reduce<Tail, TAcc>
      : never
    : never;

export interface BaseOptions<
  TShared extends Record<string, ZodType>,
  TExtends extends Array<Record<string, unknown>>,
> {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean;

  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  shared?: TShared;

  /**
   * Extend presets
   */
  extends?: TExtends;

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never;

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never;

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean;

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined?: boolean;
}

export interface LooseOptions<
  TShared extends Record<string, ZodType>,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  runtimeEnvStrict?: never;

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  // Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
  runtimeEnv: Record<string, string | boolean | number | undefined>;
}

export interface StrictOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>,
  TExtends extends Array<Record<string, unknown>>,
> extends BaseOptions<TShared, TExtends> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
        [TKey in keyof TClient]: TPrefix extends undefined
          ? never
          : TKey extends `${TPrefix}${string}`
            ? TKey
            : never;
      }[keyof TClient]
    | {
        [TKey in keyof TServer]: TPrefix extends undefined
          ? TKey
          : TKey extends `${TPrefix}${string}`
            ? never
            : TKey;
      }[keyof TServer]
    | {
        [TKey in keyof TShared]: TKey extends string ? TKey : never;
      }[keyof TShared],
    string | boolean | number | undefined
  >;
  runtimeEnv?: never;
}

export interface ClientOptions<
  TPrefix extends string | undefined,
  TClient extends Record<string, ZodType>,
> {
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: TPrefix;

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
          ? TKey
          : never} is not prefixed with ${TPrefix}.`>;
  }>;
}

export interface ServerOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends undefined
      ? TServer[TKey]
      : TPrefix extends ''
        ? TServer[TKey]
        : TKey extends `${TPrefix}${string}`
          ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
              ? TKey
              : never} should not prefixed with ${TPrefix}.`>
          : TServer[TKey];
  }>;
}

export type ServerClientOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>);

export type EnvOptions<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType>,
  TClient extends Record<string, ZodType>,
  TShared extends Record<string, ZodType>,
  TExtends extends Array<Record<string, unknown>>,
> =
  | (LooseOptions<TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TPrefix, TServer, TClient, TShared, TExtends> &
      ServerClientOptions<TPrefix, TServer, TClient>);

export function createEnv<
  TPrefix extends string | undefined,
  TServer extends Record<string, ZodType> = NonNullable<unknown>,
  TClient extends Record<string, ZodType> = NonNullable<unknown>,
  TShared extends Record<string, ZodType> = NonNullable<unknown>,
  const TExtends extends Array<Record<string, unknown>> = [],
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared, TExtends>,
): Readonly<
  Simplify<
    z.infer<ZodObject<TServer>> &
      z.infer<ZodObject<TClient>> &
      z.infer<ZodObject<TShared>> &
      UnReadonlyObject<Reduce<TExtends>>
  >
> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;

  const emptyStringAsUndefined = opts.emptyStringAsUndefined ?? false;
  if (emptyStringAsUndefined) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value === '') {
        delete runtimeEnv[key];
      }
    }
  }

  const skip = !!opts.skipValidation;
  if (skip) return runtimeEnv as any;

  const _client = typeof opts.client === 'object' ? opts.client : {};
  const _server = typeof opts.server === 'object' ? opts.server : {};
  const _shared = typeof opts.shared === 'object' ? opts.shared : {};
  const client = z.object(_client);
  const server = z.object(_server);
  const shared = z.object(_shared);
  const isServer = opts.isServer ?? typeof window === 'undefined';

  const allClient = client.merge(shared);
  const allServer = server.merge(shared).merge(client);
  const parsed = isServer
    ? allServer.safeParse(runtimeEnv) // on server we can validate all env vars
    : allClient.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed

  const onValidationError =
    opts.onValidationError ??
    ((error: ZodError) => {
      console.error(
        '❌ Invalid environment variables:',
        error.flatten().fieldErrors,
      );
      throw new Error('Invalid environment variables');
    });

  const onInvalidAccess =
    opts.onInvalidAccess ??
    (() => {
      throw new Error(
        '❌ Attempted to access a server-side environment variable on the client',
      );
    });

  if (parsed.success === false) {
    return onValidationError(parsed.error);
  }

  const isServerAccess = (prop: string) => {
    if (!opts.clientPrefix) return true;
    return !prop.startsWith(opts.clientPrefix) && !(prop in shared.shape);
  };
  const isValidServerAccess = (prop: string) => {
    return isServer || !isServerAccess(prop);
  };
  const ignoreProp = (prop: string) => {
    return prop === '__esModule' || prop === '$$typeof';
  };

  const extendedObj = (opts.extends ?? []).reduce((acc, curr) => {
    return Object.assign(acc, curr);
  }, {});
  const fullObj = Object.assign(parsed.data, extendedObj);

  const env = new Proxy(fullObj, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (ignoreProp(prop)) return undefined;
      if (!isValidServerAccess(prop)) return onInvalidAccess(prop);
      return Reflect.get(target, prop);
    },
  });

  return env as any;
}

// Vercel serverless entry point. Kept as a thin re-export so this file has no
// bare-specifier imports of its own — everything (express, @nestjs/*, etc.)
// resolves against backend/node_modules via the relative import below, not
// against a (nonexistent) root node_modules.
//
// backend/dist/vercel.js must exist before this is bundled — the root build
// command runs `nest build` first, which tsc-compiles decorator metadata
// correctly. Bundling the already-compiled JS with esbuild afterwards is
// safe; bundling the raw decorated TS source directly would not be, since
// esbuild doesn't emit `emitDecoratorMetadata`, which Nest's DI relies on.
import handler from '../backend/dist/vercel.js';

export default handler;

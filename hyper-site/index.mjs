// Transitional public boundary over the canonical implementation in reference/.
// New framework consumers must enter through this package instead of the legacy
// all-in-one index. Physical source migration follows after vector packing is
// extracted from framework.ts.

export {
  compileSite,
  validateDesignSystemSuperset,
} from "../reference/dist/framework.js";

export * from "../reference/dist/browser-targets.js";
export * from "../reference/dist/css-modern.js";

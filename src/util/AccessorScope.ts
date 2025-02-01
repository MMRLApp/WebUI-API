import { ObjectScope, Scope } from "../types";

export const AccessorScope = {
  sanitizedModIdWithFile(scope: Scope): string {
    const sanitized = this.sanitizeScope(scope);

    return `${
      sanitized.length >= 2
        ? sanitized[0].toUpperCase() + sanitized[1]
        : sanitized.length > 0
        ? sanitized[0].toUpperCase()
        : ""
    }File`;
  },

  parseFileScope(scope: ObjectScope): object {
    if (typeof scope === "string") {
      return window[`$${this.sanitizedModIdWithFile(scope)}`];
    }

    return scope;
  },

  parseScope(scope: ObjectScope): object {
    if (typeof scope === "string") {
      const sanitizedScope = window[`$${this.sanitizeScope(scope)}`];
      const unsanitizedScope = window[`$${scope}`];

      if (typeof sanitizedScope !== "undefined") {
        return sanitizedScope;
      } else {
        return unsanitizedScope;
      }
    }

    return scope;
  },

  sanitizeScope(scope: Scope): Scope {
    return scope.replace(/[-.]/g, "_");
  },
};

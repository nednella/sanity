export const objectFunctionTypes = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Write a named function type as an object type with a call signature."
    },
    messages: {
      useCallSignature: "Write the function type as an object type with a call signature."
    },
    schema: []
  },
  create(context) {
    return {
      "TSTypeAliasDeclaration > TSFunctionType"(node) {
        context.report({
          node,
          messageId: "useCallSignature"
        });
      }
    };
  }
};

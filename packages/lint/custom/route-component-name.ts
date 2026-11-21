import { defineRule } from "@oxlint/plugins";

export const routeComponentName = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Name a route component Page or Layout."
    },
    messages: {
      renameComponent: "Name the route component Page or Layout."
    },
    schema: []
  },
  create(context) {
    return {
      "VariableDeclarator[id.name='Route'] > CallExpression > ObjectExpression > Property[key.name='component']:not([value.name=/^(Page|Layout)$/])"(
        node
      ) {
        context.report({
          node,
          messageId: "renameComponent"
        });
      }
    };
  }
});

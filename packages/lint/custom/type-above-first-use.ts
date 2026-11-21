import { type ESTree, defineRule } from "@oxlint/plugins";

import { type TopLevelStatement, typeReaders } from "./module-reads.ts";

/**
 * A private type sits right above the first statement that uses it, so a
 * reader finds it next to the code it describes. Other types may sit between
 * them, so a group of types can share one user.
 */
export const typeAboveFirstUse = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Put a private type right above the first statement that uses it."
    },
    messages: {
      moveAboveFirstUse: "Move '{{name}}' right above line {{line}}, where it is first used."
    },
    schema: []
  },
  create(context) {
    return {
      Program(program) {
        for (const [index, statement] of program.body.entries()) {
          if (!isType(statement) || statement.declare) continue;

          const firstUse = typeReaders(context.sourceCode, statement)[0];
          if (!firstUse) continue;

          const between = program.body.slice(index + 1, program.body.indexOf(firstUse));
          const isAbove = program.body.indexOf(firstUse) > index;
          if (isAbove && between.every((middle) => isTypeDeclaration(middle))) continue;

          context.report({
            node: statement,
            messageId: "moveAboveFirstUse",
            data: {
              name: statement.id.name,
              line: firstUse.loc.start.line
            }
          });
        }
      }
    };
  }
});

function isType(
  statement: ESTree.Node | null
): statement is ESTree.TSInterfaceDeclaration | ESTree.TSTypeAliasDeclaration {
  return statement?.type === "TSInterfaceDeclaration" || statement?.type === "TSTypeAliasDeclaration";
}

function isTypeDeclaration(statement: TopLevelStatement): boolean {
  return isType(statement.type === "ExportNamedDeclaration" ? statement.declaration : statement);
}

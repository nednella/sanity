import { declaredNames, moduleReads } from "./module-reads.js";

/**
 * A module puts its values (const, let, class, enum) first and its functions
 * below them, and each group starts with its exports. A private value may stay
 * above the exported values when one of them reads it while the module loads,
 * because moving it below would read it before it exists. Function
 * declarations are hoisted, so they can always sit below the values.
 */
export const exportsFirst = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Put the values of a module before its functions, and the exports first in each group."
    },
    messages: {
      moveAboveFunctions: "Move '{{name}}' above the functions.",
      moveBelowExports: "Move '{{name}}' below the exported {{group}}."
    },
    schema: []
  },
  create(context) {
    return {
      Program(program) {
        const exportedNames = listedExportNames(program);
        const statements = program.body.filter((statement) => groupOf(statement));
        const exports = statements.filter((statement) => isExport(statement, exportedNames));
        const neededAbove = readAtLoad(exports, moduleReads(context.sourceCode, program));

        for (const [index, statement] of statements.entries()) {
          const group = groupOf(statement);
          const name = declaredNames(statement).join(", ") || "default";

          const isBelowFunctions = statements.slice(0, index).some((above) => groupOf(above) === "functions");
          if (group === "values" && isBelowFunctions) {
            context.report({ node: statement, messageId: "moveAboveFunctions", data: { name } });
            continue;
          }

          if (isExport(statement, exportedNames) || neededAbove.has(statement)) continue;

          const isAboveExport = statements
            .slice(index + 1)
            .some((below) => groupOf(below) === group && isExport(below, exportedNames));
          if (isAboveExport) {
            context.report({ node: statement, messageId: "moveBelowExports", data: { name, group } });
          }
        }
      }
    };
  }
};

const VALUE_TYPES = new Set(["ClassDeclaration", "TSEnumDeclaration", "VariableDeclaration"]);

const FUNCTION_TYPES = new Set(["FunctionDeclaration", "TSDeclareFunction"]);

function groupOf(statement) {
  if (statement.type === "ExportDefaultDeclaration" && !FUNCTION_TYPES.has(statement.declaration.type)) return "values";

  const declaration = statement.type.startsWith("Export") ? statement.declaration : statement;
  if (!declaration || declaration.declare) return;
  if (VALUE_TYPES.has(declaration.type)) return "values";
  if (FUNCTION_TYPES.has(declaration.type)) return "functions";
}

function isExport(statement, exportedNames) {
  return statement.type.startsWith("Export") || declaredNames(statement).some((name) => exportedNames.has(name));
}

function listedExportNames(program) {
  const lists = program.body.filter(
    (statement) => statement.type === "ExportNamedDeclaration" && !statement.declaration && !statement.source
  );
  return new Set(lists.flatMap((list) => list.specifiers.map((specifier) => specifier.local.name)));
}

/**
 * Follows what the exports read while the module loads. A function or class
 * that runs at load time reads everything in its body then too. A function
 * declaration is hoisted, so it never needs to stay above.
 */
function readAtLoad(exports, reads) {
  const needed = new Set();
  const visited = new Set();
  const pending = exports.map((statement) => reads.atLoad.get(statement));

  while (pending.length > 0) {
    for (const statement of pending.pop()) {
      if (visited.has(statement)) continue;
      visited.add(statement);

      if (statement.type !== "FunctionDeclaration") needed.add(statement);
      pending.push(reads.atLoad.get(statement));
      if (statement.type === "FunctionDeclaration" || statement.type === "ClassDeclaration") {
        pending.push(reads.anywhere.get(statement));
      }
    }
  }

  return needed;
}

import type { ESTree, Scope, SourceCode, Variable } from "@oxlint/plugins";

export type TopLevelStatement = ESTree.Program["body"][number];

export type ModuleReads = {
  anywhere: Map<TopLevelStatement, Set<TopLevelStatement>>;
  atLoad: Map<TopLevelStatement, Set<TopLevelStatement>>;
};

/**
 * Maps each top-level statement to the top-level declarations it reads as a
 * value: `atLoad` holds the reads that run while the module loads, `anywhere`
 * also holds the reads inside functions.
 */
export function moduleReads(sourceCode: SourceCode, program: ESTree.Program): ModuleReads {
  const atLoad = new Map<TopLevelStatement, Set<TopLevelStatement>>(
    program.body.map((statement) => [statement, new Set()])
  );
  const anywhere = new Map<TopLevelStatement, Set<TopLevelStatement>>(
    program.body.map((statement) => [statement, new Set()])
  );
  const moduleScope = findModuleScope(sourceCode);

  for (const variable of moduleScope?.variables ?? []) {
    const declaration = declaringStatement(variable);
    if (!declaration) continue;

    for (const reference of variable.references) {
      const isValueReference = "isValueReference" in reference && reference.isValueReference;
      if (!isValueReference || isInTypeQuery(reference.identifier)) continue;

      const reader = topLevelStatement(reference.identifier);
      if (reader === declaration) continue;

      anywhere.get(reader)?.add(declaration);
      if (!isInFunction(reference.from, moduleScope)) atLoad.get(reader)?.add(declaration);
    }
  }

  return { atLoad, anywhere };
}

/**
 * The top-level statements that use a type, in source order.
 */
export function typeReaders(
  sourceCode: SourceCode,
  declaration: ESTree.TSInterfaceDeclaration | ESTree.TSTypeAliasDeclaration
): TopLevelStatement[] {
  const variable = findModuleScope(sourceCode)?.set.get(declaration.id.name);
  const readers = (variable?.references ?? []).map((reference) => topLevelStatement(reference.identifier));
  return [...new Set(readers)].filter((reader) => reader !== declaration).toSorted((a, b) => a.range[0] - b.range[0]);
}

export function declaredNames(statement: TopLevelStatement): string[] {
  const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
  if (!declaration) return [];
  if (declaration.type === "VariableDeclaration") {
    return declaration.declarations.flatMap((declarator) => patternNames(declarator.id));
  }
  return "id" in declaration && declaration.id?.type === "Identifier" ? [declaration.id.name] : [];
}

function findModuleScope(sourceCode: SourceCode): Scope | undefined {
  return sourceCode.scopeManager.globalScope?.childScopes.find((scope) => scope.type === "module");
}

function topLevelStatement(node: ESTree.Node): TopLevelStatement {
  let current = node;
  while (current.parent && current.parent.type !== "Program") current = current.parent;
  return current as TopLevelStatement;
}

function declaringStatement(variable: Variable): TopLevelStatement | undefined {
  const definition = variable.defs[0];
  if (!definition || definition.type === "ImportBinding") return;
  return topLevelStatement(definition.node);
}

function isInTypeQuery(identifier: ESTree.Node): boolean {
  for (let node = identifier.parent; node && node.type !== "Program"; node = node.parent) {
    if (node.type === "TSTypeQuery") return true;
  }
  return false;
}

function isInFunction(scope: Scope | null, moduleScope: Scope | undefined): boolean {
  for (let current = scope; current && current !== moduleScope; current = current.upper) {
    if (current.type === "function" || current.type === "class-field-initializer") return true;
  }
  return false;
}

function patternNames(pattern: ESTree.BindingPattern | ESTree.BindingRestElement): string[] {
  switch (pattern.type) {
    case "Identifier": {
      return [pattern.name];
    }
    case "ObjectPattern": {
      return pattern.properties.flatMap((property) =>
        patternNames(property.type === "RestElement" ? property.argument : property.value)
      );
    }
    case "ArrayPattern": {
      return pattern.elements.filter((element) => element !== null).flatMap((element) => patternNames(element));
    }
    case "AssignmentPattern": {
      return patternNames(pattern.left);
    }
    case "RestElement": {
      return patternNames(pattern.argument);
    }
    default: {
      return [];
    }
  }
}

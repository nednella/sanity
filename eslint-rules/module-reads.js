/**
 * Maps each top-level statement to the top-level declarations it reads as a
 * value: `atLoad` holds the reads that run while the module loads, `anywhere`
 * also holds the reads inside functions.
 */
export function moduleReads(sourceCode, program) {
  const atLoad = new Map(program.body.map((statement) => [statement, new Set()]));
  const anywhere = new Map(program.body.map((statement) => [statement, new Set()]));
  const moduleScope = sourceCode.scopeManager.globalScope.childScopes.find((scope) => scope.type === "module");

  for (const variable of moduleScope?.variables ?? []) {
    const declaration = declaringStatement(variable);
    if (!declaration) continue;

    for (const reference of variable.references) {
      if (!reference.isValueReference || isInTypeQuery(reference.identifier)) continue;

      const reader = topLevelStatement(reference.identifier);
      if (reader === declaration) continue;

      anywhere.get(reader).add(declaration);
      if (!isInFunction(reference.from, moduleScope)) atLoad.get(reader).add(declaration);
    }
  }

  return { atLoad, anywhere };
}

/**
 * The top-level statements that use a type, in source order.
 */
export function typeReaders(sourceCode, declaration) {
  const moduleScope = sourceCode.scopeManager.globalScope.childScopes.find((scope) => scope.type === "module");
  const variable = moduleScope?.set.get(declaration.id.name);
  const readers = (variable?.references ?? []).map((reference) => topLevelStatement(reference.identifier));
  return [...new Set(readers)].filter((reader) => reader !== declaration).toSorted((a, b) => a.range[0] - b.range[0]);
}

export function declaredNames(statement) {
  const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
  if (!declaration) return [];
  if (declaration.type === "VariableDeclaration") {
    return declaration.declarations.flatMap((declarator) => patternNames(declarator.id));
  }
  return declaration.id?.name ? [declaration.id.name] : [];
}

function topLevelStatement(node) {
  let current = node;
  while (current.parent && current.parent.type !== "Program") current = current.parent;
  return current;
}

function declaringStatement(variable) {
  const definition = variable.defs[0];
  if (!definition || definition.type === "ImportBinding") return;
  return topLevelStatement(definition.node);
}

function isInTypeQuery(identifier) {
  for (let node = identifier.parent; node && node.type !== "Program"; node = node.parent) {
    if (node.type === "TSTypeQuery") return true;
  }
  return false;
}

function isInFunction(scope, moduleScope) {
  for (let current = scope; current && current !== moduleScope; current = current.upper) {
    if (current.type === "function" || current.type === "class-field-initializer") return true;
  }
  return false;
}

function patternNames(pattern) {
  switch (pattern.type) {
    case "Identifier": {
      return [pattern.name];
    }
    case "ObjectPattern": {
      return pattern.properties.flatMap((property) => patternNames(property.value ?? property.argument));
    }
    case "ArrayPattern": {
      return pattern.elements.filter(Boolean).flatMap((element) => patternNames(element));
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

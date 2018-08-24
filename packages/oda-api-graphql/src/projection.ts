export function getFieldList(context, fieldASTs) {
  if (!context) {
    return {};
  }

  fieldASTs = fieldASTs || context.fieldASTs;

  // for recursion
  // Fragments doesn't have many sets
  let asts = fieldASTs;
  if (!Array.isArray(asts)) {
    asts = [asts];
  }

  // get all selectionSets
  const selections = asts.reduce((hash, source) => {
    if (source.selectionSet) {
      return hash.concat(source.selectionSet.selections);
    }

    return hash;
  }, []);

  // return fields
  return selections.reduce((list, ast) => {
    const { name, kind } = ast;

    switch (kind) {
      case 'Field':
        return Object.assign({}, list, getFieldList(context, ast), {
          [name.value]: true,
        });
      case 'InlineFragment':
        return Object.assign({}, list, getFieldList(context, ast));
      case 'FragmentSpread':
        return Object.assign(
          {},
          list,
          getFieldList(context, context.fragments[name.value]),
        );
      default:
        throw new Error('Unsuported query selection');
    }
  }, {});
}

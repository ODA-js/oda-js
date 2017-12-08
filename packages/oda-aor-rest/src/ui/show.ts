import { actionType } from './consts';

export const detailsFor = (relName) => {
  const relType = `${relName}Type`;
  return (root) => !!(
    (root &&
      root[relType] &&
      root[relType] !== actionType.USE &&
      root[relType] !== actionType.UNLINK)
    || !root
  )
}

export const selectorFor = (relName, belongsToMany) => {
  const relType = `${relName}Type`;
  return (root) => !!((root &&
    ((root[relType]
      && (
        (root[relType] === actionType.CREATE && belongsToMany) ||
        root[relType] === actionType.UPDATE ||
        root[relType] === actionType.CLONE ||
        root[relType] === actionType.USE
      )) ||
      !root[relType])) || !root);
}
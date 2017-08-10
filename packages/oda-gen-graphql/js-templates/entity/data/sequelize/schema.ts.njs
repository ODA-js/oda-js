<#@ context 'entity' -#>
import * as Sequelize from 'sequelize';

export default (sequelize, DataTypes: Sequelize.DataTypes) => {
  let $#{entity.name} = sequelize.define('Starship', {
<#- if(entity.useDefaultPK){#>
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
<#}#>
<#- entity.fields.forEach(field => { #>
    #{field.name}: {
      type: #{field.type},
      allowNull: #{!!field.required},
      <#- if(field.primaryKey){#>
      primaryKey: true,
      <#-}#>
    },
  <#- })#>
  <#- entity.relations.forEach(rel=>{#>
    #{rel.name}: {
      type: #{rel.type},
      allowNull: false,
    },
  <#-})#>
  }, {
      tableName: '#{entity.collectionName}',
      timestamp: true,
      createdAt: 'created',
      updatedAt: 'edited',
      underscored: true,
      indexes: [
<#-for(let i = 0, len = entity.indexes.length; i < len; i++){
    let index = entity.indexes[i];
  -#><#if(i > 0){#>, <#}#>{
  <#- if(index.options.unique){#>
        unique: true,
  <#-}#>
        fields: [
<#- for(let field in index.fields){#>
          { attribute: '#{field}', order: '#{index.fields[field] ? "ASC": "DESC"}' },<#}#>
        ],
      }
<#-}-#>]
    });

  return $#{entity.name};
};

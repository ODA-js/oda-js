<#@ context 'entity' -#>
<#@ alias 'data/connector/mongoose' #>
import getLogger from 'oda-logger';
let logger = getLogger('api:connector:#{entity.name}');

import { MongooseApi } from 'oda-api-graphql-mongoose';
import { SecurityContext } from 'oda-api-graphql';
import #{ entity.name }Schema from './schema';
import RegisterConnectors from '../../registerConnectors';
import Dataloader from 'dataloader';

import { Partial#{ entity.name }, Partial#{ entity.name }Input, #{ entity.name } as DTO } from '../types/model';
import { #{ entity.name }Connector } from './interface';

<#entity.embedded.forEach(name=>{#>
import {Partial#{name}} from './../../#{name}/types/model';
<#})#>

export default class #{ entity.name } extends MongooseApi<RegisterConnectors, Partial#{ entity.name }> implements #{ entity.name }Connector {
  constructor(
    { mongoose, connectors, securityContext }:
      { mongoose: any, connectors: RegisterConnectors, securityContext: SecurityContext<RegisterConnectors> }
  ) {
    logger.trace('constructor');
    super({ name: '#{ entity.name }', mongoose, connectors, securityContext});
    this.initSchema('#{entity.name}', #{ entity.name }Schema());

    this.loaderKeys = {
<#- for (let i = 0, len = entity.loaders.length; i < len; i++) {
    let loaderName = entity.loaders[i].loader;
#>
      by#{loaderName}: '#{entity.unique[i]}',
<#-}#>
<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let loadArgs = f.fields.map(f=>`obj.${f.name}`).join(' + ');
    #>
      by#{findBy}: obj => #{loadArgs},
<#});#>
    };

    this.updaters = {
<#- for (let i = 0, len = entity.loaders.length; i < len; i++) {
    let loaderName = entity.loaders[i].loader;
#>
      by#{loaderName}: this.updateLoaders('by#{loaderName}'),
<#-}#>
<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
    #>
      by#{findBy}: this.updateLoaders('by#{findBy}'),
<#-});#>
    };
<#- for (let i = 0, len = entity.loaders.length; i < len; i++) {
    let loaderName = entity.loaders[i].loader;
    let field = entity.loaders[i].field;
#>

    const by#{loaderName} = async (keys) => {
      let result = await this._getList({ filter: { #{field}: { in: keys } } });
      let map = result.reduce((_map, item) => {
        _map[item.#{field}] = item;
        return _map;
      }, {});
      return keys.map(id => map[id]);
    };
<#-}-#>
<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let loadArgs = f.fields.map(f=>`key.${f.name}`).join(' + ');
  let withArgsTypeof = f.fields.map(f=>'${'+`typeof ${f.name}`+'}').join(', ');
#>

    const by#{findBy} = async (keys) => {
      let result = await this._getList({ filter: { or: keys  } });
      let map = result.reduce((_map, item) => {
        _map[this.loaderKeys.by#{findBy}(item)] = item;
        return _map;
      }, {});
      return keys.map(item => map[this.loaderKeys.by#{findBy}(item)]);
    };
<#-});#>

    this.loaders = {
<#- for (let i = 0, len = entity.loaders.length; i < len; i++) {
    let loaderName = entity.loaders[i].loader;
#>
      by#{loaderName}: new Dataloader(keys => by#{loaderName}(keys)
        .then(this.updaters.by#{loaderName})
<#- if (loaderName === 'Id') {#>, {
          cacheKeyFn: key => typeof key !== 'object' ? key : key.toString(),
        }
<#-}-#>),
<#-}#>
<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let loadArgs = f.fields.map(f=>`key.${f.name}`).join(' + ');
  let withArgsTypeof = f.fields.map(f=>'${'+`typeof ${f.name}`+'}').join(', ');
    #>
      by#{findBy}: new Dataloader(keys => by#{findBy}(keys)
        .then(this.updaters.by#{findBy}), {
          cacheKeyFn: key => typeof key === 'object' ? (#{loadArgs}) : key.toString(),
        }),
<#});#>
    };
  }

  public async create(payload: Partial#{entity.name} | Partial#{entity.name}Input) {
    logger.trace('create');
    let entity = this.getPayload(payload);
    let result = await this.createSecure(entity);
    if (result) {
      this.storeToCache([result]);
      return this.ensureId(result.toJSON ? result.toJSON() : result);
    } else {
      throw new Error(`can't create item due to some issue`)
    }
  }
<#- for (let f of entity.args.update.find) {
  let ukey = f.name;
  let type = f.type;
#>

  public async findOneBy#{f.cName}AndUpdate(#{ukey}: #{type}, payload: Partial#{entity.name} | Partial#{entity.name}Input) {
    logger.trace(`findOneBy#{f.cName}AndUpdate`);
    let entity = this.getPayload(payload, true);
    let result = await this.loaders.by#{f.cName}.load(#{ukey});
    if (result) {
      result = await this.updateSecure(result, entity);
      this.storeToCache([result]);
    } else {
      throw new Error(`can't update item due to some issue`)
    }
    return this.ensureId(result.toJSON ? result.toJSON() : result);
  }
<#-}#>

<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let findArgs = f.fields.map(f=>`${f.name}: ${f.type}`).join(', ');
  let withArgs = f.fields.map(f=>'${'+f.name+'}').join(', ');
  let withArgs2 = f.fields.map(f=>'${args.'+f.name+'}').join(', ');
  let loadArgs = `{${f.fields.map(f=>`${f.name}`).join(', ')}}`;
  let withArgsTypeof = f.fields.map(f=>'${'+`typeof args.${f.name}`+'}').join(', ');
    #>
  public async findOneBy#{findBy}AndUpdate(#{findArgs}, payload: Partial#{entity.name} | Partial#{entity.name}Input) {
    logger.trace(`findOneBy#{findBy}AndUpdate with #{withArgs} `);
    let entity = this.getPayload(payload, true);
    let result = await this.loaders.by#{findBy}.load(#{loadArgs});
    if (result) {
      result = await this.updateSecure(result, entity);
      this.storeToCache([result]);
    } else {
      throw new Error(`can't update item due to some issue`)
    }
    return this.ensureId(result.toJSON ? result.toJSON() : result);
  }
<#-});#>

<#- for (let f of entity.args.remove) {
  let ukey = f.name;
  let type = f.type;
  #>

  public async findOneBy#{f.cName}AndRemove(#{ukey}: #{type}) {
    logger.trace(`findOneBy#{f.cName}AndRemove`);
    let result = await this.loaders.by#{f.cName}.load(#{ukey});
    if (result) {
      result = await this.removeSecure(result);
      this.storeToCache([result]);
    } else {
      throw new Error(`can't remove item due to some issue`)
    }
    return this.ensureId(result.toJSON ? result.toJSON() : result);
  }
<#-}#>

<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let findArgs = f.fields.map(f=>`${f.name}: ${f.type}`).join(', ');
  let withArgs = f.fields.map(f=>'${'+f.name+'}').join(', ');
  let withArgs2 = f.fields.map(f=>'${args.'+f.name+'}').join(', ');
  let loadArgs = `{${f.fields.map(f=>`${f.name}`).join(', ')}}`;
  let withArgsTypeof = f.fields.map(f=>'${'+`typeof args.${f.name}`+'}').join(', ');
    #>
  public async findOneBy#{findBy}AndRemove(#{findArgs}) {
    logger.trace(`findOneBy#{findBy}AndRemove with #{withArgs} `);
    let result = await this.loaders.by#{findBy}.load(#{loadArgs});
    if (result) {
      result = await this.removeSecure(result);
      this.storeToCache([result]);
    } else {
      throw new Error(`can't remove item due to some issue`)
    }
    return this.ensureId(result.toJSON ? result.toJSON() : result);
  }
<#-});#>

<#- for (let connection of entity.relations.filter(r=>!r.embedded)) {#>
  public async addTo#{ connection.shortName }(args: {
    <#- for (let f of connection.addArgs) {#>
      #{f.name}?: #{f.type},
    <#-}#>
  }) {
    logger.trace(`addTo#{ connection.shortName }`);
<#- if (connection.embedded && connection.single) { #>
    await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName}, {
      #{connection.field}: args.#{connection.refFieldName}
    });
<#- } else  if (connection.embedded && !connection.single) { #>
    await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName}, {
      #{connection.field}: args.#{connection.refFieldName}
    });
<#- } else if (connection.verb === 'HasOne') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    if (current) {
      await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(
        args.#{connection.refFieldName},
        { #{connection.ref.field}: current.#{connection.ref.backField} });
    } else {
      throw new Error(`can't addTo#{ connection.shortName } item not found`);
    }
<#} else if (connection.verb === 'HasMany') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    if (current) {
      await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(
        args.#{connection.refFieldName},
        { #{connection.ref.field}: current.#{connection.ref.backField} });
    } else {
      throw new Error(`can't addTo#{ connection.shortName } item not found`);
    }
<#} else if (connection.verb === 'BelongsTo') {#>
    let opposite = await this.connectors.#{connection.ref.entity}.findOneById(args.#{connection.refFieldName});
    if (opposite) {
      await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName},
      { #{connection.ref.backField || connection.field}: opposite.#{connection.ref.field} });
    } else {
      throw new Error(`can't addTo#{ connection.shortName } opposite not found`);
    }
<#} else if (connection.verb === 'BelongsToMany') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    let opposite = await this.connectors.#{connection.ref.entity}.findOneById(args.#{connection.refFieldName});
    if (current && opposite) {
      let update: any = {
        #{connection.ref.using.field}: current.#{connection.ref.backField},
        #{connection.ref.usingField}: opposite.#{connection.ref.field},
      };
<# for (let fname of connection.ref.fields) {
      if (fname !== 'id') { #>
      if (args.hasOwnProperty('#{fname}')) {
        update.#{fname} = args.#{fname};
      }
<#- }
  }-#>

      let connection = await this.connectors.#{connection.ref.using.entity}.getList({
        filter: {
          #{connection.ref.using.field}: {
            eq: current.#{connection.ref.backField}
          },
          #{connection.ref.usingField}: {
            eq: opposite.#{connection.ref.field}
          },
        }
      });

      if (connection.length > 0) {
        await this.connectors.#{connection.ref.using.entity}.findOneByIdAndUpdate(connection[0].id, update);
      } else {
        await this.connectors.#{connection.ref.using.entity}.create(update);
      }
    } else {
      if(!opposite)
        throw new Error(`can't addTo#{ connection.shortName } opposite not found`);
      if(!current)
        throw new Error(`can't addTo#{ connection.shortName } item not found`);
    }
<#}-#>
  }

  public async removeFrom#{ connection.shortName }(args: {
    <#- for (let f of connection.removeArgs) {#>
      #{f.name}?: #{f.type},
    <#-}#>
  }) {
    logger.trace(`removeFrom#{ connection.shortName }`);
<#- if (connection.embedded && connection.single) { #>
    await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName}, {
      #{connection.field}: null,
    });
<#- } else if (connection.embedded && !connection.single) { #>
    await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName}, {
      #{connection.field}: null,
    });
<#- } else if (connection.verb === 'HasOne') {#>
    await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(args.#{connection.refFieldName},
    { #{connection.ref.field}: null });
<#} else if (connection.verb === 'HasMany') {#>
    await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(args.#{connection.refFieldName},
    { #{connection.ref.field}: null });
<#} else if (connection.verb === 'BelongsTo') {#>
    await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName}, { #{connection.ref.backField || connection.field}: null });
<#} else if (connection.verb === 'BelongsToMany') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    let opposite = await this.connectors.#{connection.ref.entity}.findOneById(args.#{connection.refFieldName});
    if (current && opposite) {
      let connection = await this.connectors.#{connection.ref.using.entity}.getList({
        filter: {
          #{connection.ref.using.field}: {
            eq: current.#{connection.ref.backField}
          },
          #{connection.ref.usingField}: {
            eq: opposite.#{connection.ref.field}
          },
        }
      });

      if (connection.length > 0) {
        await this.connectors.#{connection.ref.using.entity}.findOneByIdAndRemove(connection[0].id);
      }
    } else {
      if(!opposite)
        throw new Error(`can't removeFrom#{ connection.shortName } opposite not found`);
      if(!current)
        throw new Error(`can't removeFrom#{ connection.shortName } item not found`);
    }
<#}-#>
  }
<#}-#>

<#- for (let f of entity.args.getOne) {
  let ukey = f.name;
  let type = f.type;
    #>
  public async findOneBy#{f.cName}(#{ukey}?: #{type}) {
    if(#{ukey}){
      logger.trace(`findOneBy#{f.cName} with ${#{ukey}} `);
      let result = await this.loaders.by#{f.cName}.load(#{ukey});
      if (result){
        return this.ensureId(result.toJSON ? result.toJSON() : result);
      } else {
        throw new Error(`can't findOneBy#{f.cName} with ${#{ukey}}`);
      }
    }
  }

<#-}-#>

<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let findArgs = f.fields.map(f=>`${f.name}: ${f.type}`).join(', ');
  let withArgs = f.fields.map(f=>'${'+f.name+'}').join(', ');
  let withArgs2 = f.fields.map(f=>'${args.'+f.name+'}').join(', ');
  let loadArgs = `{${f.fields.map(f=>`${f.name}`).join(', ')}}`;
  let withArgsTypeof = f.fields.map(f=>'${'+`typeof args.${f.name}`+'}').join(', ');
    #>
  public async findOneBy#{findBy}(#{findArgs}) {
    logger.trace(`findOneBy#{findBy} with #{withArgs} `);
    let result = await this.loaders.by#{findBy}.load(#{loadArgs});
    if (result) {
      return this.ensureId(result.toJSON ? result.toJSON() : result);
    } else {
      throw new Error(`can't findOneBy#{f.cName} with ${#{ukey}}`);
    }
  }

<#-});-#>

  public getPayload(args: Partial#{entity.name} | Partial#{entity.name}Input, update?: boolean): Partial#{ entity.name } {
    let entity: any = {};
    <#- for (let f of entity.args.create) {#>
      if (args.#{f.name} !== undefined) {
        <#if(f.relation && !f.relation.embedded){#>
        if(typeof args.#{f.name} === 'object'){
          entity.#{f.name} = args.#{f.name}.#{f.relation.ref.field};
        } else {
        <#}#>
        entity.#{f.name} = args.#{f.name};
        <#if(f.relation && !f.relation.embedded){#>
        }
        <#}#>
      }
    <#-}#>
    if (update) {
      delete entity.id;
      delete entity._id;
    } else {
      if (entity.id) {
        entity._id = entity.id;
        delete entity.id;
      }
    }
    return entity;
  }

  public ensureId(obj){
    if(obj) {
      let result = super.ensureId(obj);
      return new DTO(result);
    }
  }
};

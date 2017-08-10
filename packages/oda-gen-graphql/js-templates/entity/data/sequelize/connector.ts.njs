<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<# chunkStart(`interface`); #>
import { Connector } from 'oda-api-graphql';
import { I#{ entity.name } } from '../types/model';

export interface #{ entity.name }Connector extends Connector<I#{ entity.name }>{
<#- for (let f of entity.args.update.find) {
  let ukey = f.name;
  let type = f.type;
#>
  findOneBy#{f.cName}AndUpdate: (#{ukey}: #{type}, payload: I#{entity.name})=> Promise<I#{entity.name}>
  findOneBy#{f.cName}AndRemove: (#{ukey}: #{type})=> Promise<I#{entity.name}>
<#}-#>
<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let findArgs = f.fields.map(f=>`${f.name}: ${f.type}`).join(', ');
    #>
  findOneBy#{findBy}AndUpdate:(#{findArgs}, payload: I#{entity.name}) => Promise<I#{entity.name}>
  findOneBy#{findBy}AndRemove:(#{findArgs}) => Promise<I#{entity.name}>
  <#});-#>
}

<# chunkStart('connector'); #>
import * as log4js from 'log4js';
let logger = log4js.getLogger('api:connector:#{entity.name}');

import { SequelizeApi } from 'oda-api-graphql';
import #{ entity.name }Schema from './schema';
import RegisterConnectors from '../../registerConnectors';
import * as Dataloader from 'dataloader';

import { I#{ entity.name } } from '../types/model';
import { #{ entity.name }Connector } from './interface';

export default class #{ entity.name } extends SequelizeApi<RegisterConnectors, I#{ entity.name }> implements #{ entity.name }Connector {
  constructor({sequelize, connectors, user, owner, acls, userGroup}) {
    logger.trace('constructor');
    super({sequelize, connectors, user, acls, userGroup
<#-if( entity.needOwner ){-#>
, owner
<#-} else {-#>
, owner: false
<#-}-#>
    });
    this.initSchema('#{entity.name}', #{ entity.name }Schema);

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
<#- if(loaderName === 'Id'){#>, {
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

  public async create(payload: I#{entity.name}) {
    logger.trace('create');
    let entity = this.getPayload(payload);
    let result = await this.model.create(entity);
    this.storeToCache([result]);
    return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
  }
<#- for (let f of entity.args.update.find) {
  let ukey = f.name;
  let type = f.type;
#>

  public async findOneBy#{f.cName}AndUpdate(#{ukey}: #{type}, payload: any) {
    logger.trace(`findOneBy#{f.cName}AndUpdate`);
    let entity = this.getPayload(payload, true);
    let result = await this.loaders.by#{f.cName}.load(#{ukey});
    if(result){
      await result.update(entity);
      this.storeToCache([result]);
      return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
    } else {
      return result;
    }
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
  public async findOneBy#{findBy}AndUpdate(#{findArgs}, payload: any) {
    logger.trace(`findOneBy#{findBy}AndUpdate with #{withArgs} `);
    let entity = this.getPayload(payload, true);
    let result = await this.loaders.by#{findBy}.load(#{loadArgs});
    if(result){
      await result.update(entity);
      this.storeToCache([result]);
      return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
    } else {
      return result;
    }
  }
<#-});#>

<#- for (let f of entity.args.remove) {
  let ukey = f.name;
  let type = f.type;
  #>

  public async findOneBy#{f.cName}AndRemove(#{ukey}: #{type}) {
    logger.trace(`findOneBy#{f.cName}AndRemove`);
    let result = await this.loaders.by#{f.cName}.load(#{ukey});
    if( result ){
      result = await result.destroy();
      this.storeToCache([result]);
      return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
    } else {
      return result;
    }
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
    if( result ){
      result = await result.destroy();
      this.storeToCache([result]);
      return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
    } else {
      return result;
    }
  }
<#-});#>

<#- for (let connection of entity.relations) {#>
  public async addTo#{ connection.shortName }(args: {
    <#- for (let f of connection.addArgs) {#>
      #{f.name}?: #{f.type},
    <#-}#>
  }) {
    logger.trace(`addTo#{ connection.shortName }`);
<#- if (connection.verb === 'HasOne') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    if (current) {
      await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(
        args.#{connection.refFieldName},
        { #{connection.ref.field}: current.#{connection.ref.backField} });
    }
<#} else if (connection.verb === 'HasMany') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    if (current) {
      await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(
        args.#{connection.refFieldName},
        { #{connection.ref.field}: current.#{connection.ref.backField}});
    }
<#} else if (connection.verb === 'BelongsTo') {#>
    let opposite = await this.connectors.#{connection.ref.entity}.findOneById(args.#{connection.refFieldName} );
    if (opposite) {
      await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName},
      { #{connection.field}: opposite.#{connection.ref.field} });
    }
<#} else if (connection.verb === 'BelongsToMany') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    let opposite = await this.connectors.#{connection.ref.entity}.findOneById(args.#{connection.refFieldName} );
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
    }
<#}-#>
  }

  public async removeFrom#{ connection.shortName }(args: {
    <#- for (let f of connection.removeArgs) {#>
      #{f.name}?: #{f.type},
    <#-}#>
  }) {
    logger.trace(`removeFrom#{ connection.shortName }`);
<#- if (connection.verb === 'HasOne') {#>
    await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(args.#{connection.refFieldName},
    { #{connection.ref.field}: null });
<#} else if (connection.verb === 'HasMany') {#>
    await this.connectors.#{connection.ref.entity}.findOneByIdAndUpdate(args.#{connection.refFieldName},
    { #{connection.ref.field}: null });
<#} else if (connection.verb === 'BelongsTo') {#>
    await this.findOneByIdAndUpdate(args.#{entity.ownerFieldName}, { #{connection.field}: null });
<#} else if (connection.verb === 'BelongsToMany') {#>
    let current = await this.findOneById(args.#{entity.ownerFieldName});
    let opposite = await this.connectors.#{connection.ref.entity}.findOneById( args.#{connection.refFieldName} );
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
    }
<#}-#>
  }
<#}-#>

<#- for (let f of entity.args.getOne) {
  let ukey = f.name;
  let type = f.type;
    #>
  public async findOneBy#{f.cName}(#{ukey}?: #{type}) {
    logger.trace(`findOneBy#{f.cName} with ${#{ukey}} `);
    let result = await this.loaders.by#{f.cName}.load(#{ukey});
    return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
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
    return this.ensureId((result && result.toJSON) ? result.toJSON() : result);
  }

<#-});-#>

  public getPayload(args: I#{entity.name}, update?: boolean) {
    let entity: any = {};
    <#- for (let f of entity.args.create) {#>
      if (args.#{f.name} !== undefined) {
        entity.#{f.name} = args.#{f.name};
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
};

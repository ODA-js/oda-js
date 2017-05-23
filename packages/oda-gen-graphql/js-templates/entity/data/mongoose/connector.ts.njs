<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('api:connector:#{entity.name}');

import { MongooseApi } from 'oda-api-graphql';
import #{ entity.name }Schema from './schema';
import RegisterConnectors from '../../registerConnectors';
import * as Dataloader from 'dataloader';

import { #{ entity.name } as #{ entity.name }Model } from '../types/model';

export default class #{ entity.name } extends MongooseApi<RegisterConnectors> {
  constructor({mongoose, connectors, user, owner, acls, userGroup}) {
    logger.trace('constructor');
    super({mongoose, connectors, user, acls, userGroup
<#-if( entity.needOwner ){-#>
, owner
<#-} else {-#>
, owner: false
<#-}-#>
    });
    this.initSchema('#{entity.name}', #{ entity.name }Schema());
    this.storeToCache = this.updateLoaders('All Fields');

    this.loaderKeys = {
<#- for (let i = 0, len = entity.loaders.length; i < len; i++) {
    let loaderName = entity.loaders[i];
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
    let loaderName = entity.loaders[i];
#>
      by#{loaderName}: this.updateLoaders('by#{loaderName}'),
<#-}#>
<#- entity.complexUniqueIndex.forEach(f=> {
  let findBy = f.fields.map(f=>f.uName).join('And');
    #>
      by#{findBy}: this.updateLoaders('by#{findBy}'),
<#});#>
    };

    this.loaders = {
<#- for (let i = 0, len = entity.loaders.length; i < len; i++) {
    let loaderName = entity.loaders[i];
#>
      by#{loaderName}: new Dataloader(keys =>
        Promise.all<#{entity.name}Model>(keys.map(this._findOneBy#{loaderName}.bind(this)) as Promise<#{entity.name}Model>[])
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
      by#{findBy}: new Dataloader(keys => Promise.all<#{entity.name}Model>(keys.map(this._findOneBy#{findBy}.bind(this)) as Promise<#{entity.name}Model>[])
        .then(this.updaters.by#{findBy}), {
          cacheKeyFn: key => typeof key === 'object' ? (#{loadArgs}) : key.toString(),
        }),
<#});#>
    };
  }

  public async create(payload) {
    logger.trace('create');
    let entity = this.getPayload(payload);
    let result = await  (new (this.model)(entity)).save();
    this.storeToCache([result]);
    return this.ensureId(result ? result.toJSON() : result);
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
      for (let f in entity) {
        if (entity.hasOwnProperty(f)) {
          result.set(f, entity[f]);
        }
      }
      result = await result.save();
      this.storeToCache([result]);
      return this.ensureId(result ? result.toJSON() : result);
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
      for (let f in entity) {
        if (entity.hasOwnProperty(f)) {
          result.set(f, entity[f]);
        }
      }
      result = await result.save();
      this.storeToCache([result]);
      return this.ensureId(result ? result.toJSON() : result);
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
      result = await result.remove();
      this.storeToCache([result]);
      return this.ensureId(result ? result.toJSON() : result);
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
      result = await result.remove();
      this.storeToCache([result]);
      return this.ensureId(result ? result.toJSON() : result);
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
        #{connection.ref.using.field}: current.#{connection.ref.backField},
        #{connection.ref.usingField}: opposite.#{connection.ref.field},
      });

      if (connection.length > 0) {
        await this.connectors.#{connection.ref.using.entity}.findOneByIdAndUpdate(connection[0]._id, update);
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
        #{connection.ref.using.field}: current.#{connection.ref.backField},
        #{connection.ref.usingField}: opposite.#{connection.ref.field},
      });

      if (connection.length > 0) {
        await this.connectors.#{connection.ref.using.entity}.findOneByIdAndRemove(connection[0]._id);
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
    return this.ensureId(result ? result.toJSON() : result);
  }

  public async _findOneBy#{f.cName}(#{ukey}?: #{type}) {
    logger.trace(`_findOneBy#{f.cName} with ${#{ukey}} ${typeof #{ukey}} `);
    let condition: any;
    if (
    <#- if(type == 'string'){ #>
        #{ukey} !== undefined
        && #{ukey} !== ''
    <#- } else if(type == 'number') {#>
        #{ukey} !== undefined
        && !isNaN(Number(#{ukey}))
    <#- } else if(type == 'boolean'){#>
        #{ukey} !== undefined
        && #{ukey} !== ''
        && (!!args.#{ukey}.match(/true/i) || !!args.#{ukey}.match(/false/i))
    <#}-#>
    ) {
      condition = {#{ukey}};
    }
    if (!condition) {
      logger.error('no unique key provided findOneBy#{f.cName} "#{entity.name}"');
      throw new Error('no unique key provided findOneBy#{f.cName} "#{entity.name}"');
    }
    <#-if (ukey === 'id') {#>
    let result = await this.model.findById(condition.id).exec();
    <#-} else {#>
    let result = await this.model.findOne(condition).exec();
    <#-}#>
    return result;
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
    return this.ensureId(result ? result.toJSON() : result);
  }

  public async _findOneBy#{findBy}(args: {#{findArgs}}) {
    logger.trace(`_findOneBy#{findBy} with #{withArgs2} #{withArgsTypeof} `);
    let condition: any = {};
<# for (let i=0, len = f.fields.length; i < len; i++ ){
  let ukey = f.fields[i].name;
  let type = f.fields[i].type;
  #>
    if (
    <#- if(type == 'string') { #>
        args.#{ukey} !== undefined
        && args.#{ukey} !== ''
    <#- } else if(type == 'number') {#>
        args.#{ukey} !== undefined
        && !isNaN(Number(args.#{ukey}))
    <#- } else if(type == 'boolean'){#>
       args.#{ukey} !== undefined
        && args.#{ukey} !== ''
        && (!!args.#{ukey}.match(/true/i) || !!args.#{ukey}.match(/false/i))
    <#}-#>
    ) {
      condition = {
        ...condition,
        #{ukey}: args.#{ukey},
        };
    } else {
      throw new Error('All parameters required for findOneBy#{findBy}! "#{entity.name}"');
    }
<#}#>
    let result = await this.model.findOne(condition).exec();

    return result;
  }

<#-});-#>


  public getPayload(args: {
    <#- for (let f of entity.args.create) {#>
      #{f.name}?: #{f.type},
    <#-}#>
  }, update?: boolean) {
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

  public getSort(args) {
    let result: any = {};
<#- if(entity.filterAndSort.length > 0){ -#>
    if (Array.isArray(args.orderBy) && args.orderBy.length > 0) {
      for (let i = 0, len = args.orderBy.length; i < len; i++) {
      let orderBy = args.orderBy[i];
      // tslint:disable-next-line:switch-default
        switch (orderBy) {
  <#- for( let f of entity.filterAndSort){ #>
          case '#{f.name}Asc':
            result.#{f.name} = 1 ;
            break;
          case '#{f.name}Desc':
            result.#{f.name} = -1;
            break;
  <#- } -#>
        }
      }
    }
<# } #>
    // must be last
    result._id = 1;
    return result;
  }

  public  getFilter(args) {
    let result: any = {};
<#- if(entity.filterAndSort.length > 0){ #>
    if (args.filter) {
      result = { $or: [ ] };
<# for( let i = 0, len = entity.filterAndSort.length; i < len; i++) {
  let f = entity.filterAndSort[i]; #>
<#- if(f.type == 'string' && f.gqlType != 'ID'){-#>
      result.$or.push({ #{f.name}: { $regex: `^${args.filter}`, $options: 'im' }});
<#- } else if(f.type == 'string' && f.gqlType == 'ID'){-#>
      result.$or.push({ #{f.name}: args.filter});
<#- } else if (f.type == 'number') {-#>
      if (!isNaN(Number(args.filter))) {
        result.$or.push({ #{f.name}: { $eq: Number(args.filter)}});
      }
<#- } else if (f.type == 'boolean'){-#>
      if ((!!args.filter.match(/true/i) || !!args.filter.match(/false/i))) {
        result.$or.push({ #{f.name}: { $eq: !!args.filter.match(/true/i)}});
      }
<#- }#>
<#}-#>
    }
<#- } #>

<#- for( let f of entity.search){ #>
    if (args.#{f.name} !== undefined
      && args.#{f.name} !== null
      && typeof args.#{f.name} === 'object'
      && args.#{f.name}.constructor === Object) {
      result.#{f._name || f.name} = args.#{f.name};
    } else
<#- if(f.type == 'string' && !(f.gqlType == 'ID' || f.rel) ){ -#>  if (args.#{f.name} !== undefined && args.#{f.name} !== '') {
      result.#{f.name} = { $regex: `^${args.#{f.name}}`, $options: 'im' };
    }
<#- } else if(f.type == 'string' && (f.gqlType == 'ID' || f.rel)){-#> if (args.#{f.name} !== undefined && args.#{f.name} !== '') {
      result.#{f.name} = args.#{f.name};
    }
<#- } else if(f.type == 'number') {-#>  if (args.#{f.name} !== undefined && !isNaN(Number(args.#{f.name}))) {
      result.#{f.name} = { $eq: Number(args.#{f.name})};
    }
<#- } else if(f.type == 'boolean'){-#>  if (args.#{f.name} !== undefined ) {
      result.#{f.name} = { $eq: !!args.#{f.name} };
    }
<#}-#>
<#}#>
    return result;
  }
};

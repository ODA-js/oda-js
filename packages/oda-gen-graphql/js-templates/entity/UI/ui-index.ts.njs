<#@ context 'pack' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`./index.js`); -#>
<# for(let entity of pack.entities){-#>
import #{entity.name}Resource, {extension as #{entity.name}Extension } from './#{entity.name}/queries';
<#}-#>

<# for(let entity of pack.entities){-#>
import #{entity.name}UIX from './#{entity.name}/uix';
<#}-#>

import { data } from 'oda-ra-data-provider';

import Admin from './admin';

export { Admin };

export class Resources extends data.resource.ResourceContainer {
  constructor(...args){
    super(...args);
    this.override([
<# for(let entity of pack.entities){-#>
      #{entity.name}Resource,
<#}-#>
<# for(let entity of pack.entities){-#>
      ...#{entity.name}Extension,
<#}-#>
    ]);
  }
}

export const uix = {
<# for(let entity of pack.entities){-#>
  "#{pack.role}/#{entity.name}": #{entity.name}UIX,
<#}-#>
};

<#- chunkStart(`./i18n/index.js`); -#>
import merge from 'lodash/merge';

<# for(let entity of pack.entities){-#>
import #{entity.name}Translate from './#{entity.name}';
<#}-#>

const messages = {
  uix: {
    "filter": {
      "search": "Search",
      "exists": "%{name} exists",
      "eq": "%{name} =",
      "ne": "%{name} !=",
      "lte": "%{name} <=",
      "gte": "%{name} >=",
      "lt": "%{name} <",
      "gt": "%{name} >",
      "imatch": "%{name}",
      "in": "%{name} in",
      "nin": "%{name} not in",
    },
    "actionType": {
      "CREATE": "Create",
      "UPDATE": "Update Existing",
      "CLONE": "Copy Selected",
      "USE": "Use Existing",
      "UNLINK": "Unlink",
      "ExpectedTo": "Expected To"
    }
  }
}

export default
  merge(
    messages,
<# for(let entity of pack.entities){-#>
    #{entity.name}Translate,
<#}-#>
  )

<#- chunkStart(`./resources.js`); -#>
import React from 'react';
import ListIcon from 'material-ui/svg-icons/action/view-list';
import { translate } from 'react-admin';

export default {
<# for(let entity of pack.entities){-#>
  "#{pack.role}/#{entity.name}": { icon: <ListIcon />, visible: true, name: translate('resources.#{entity.name}.name', { smart_count:2 }) },
<#}-#>
};

<#- chunkStart(`./admin.js`); -#>
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from 'react-loading-animation'
import { Admin, Resource, Delete } from 'react-admin';
import { englishMessages } from 'react-admin';
import translation from './i18n';
import merge from 'lodash/merge';

const messages = {
  'en': {
    ...merge(
      {},
      englishMessages,
      translation
    ),
  },
};

const i18nProvider = locale => messages[locale];

class OdaClientApp extends Component {
  render() {
    const { restClient, authClient, uix } = this.context;
    if (restClient === null || restClient === undefined) {
      return <div className="loading-component"><Loading /></div>;
    }

    return (
      <Admin
        {...this.props}
        locale="en"
        i18nProvider={i18nProvider}
        authProvider={authClient}
        dataProvider={restClient}>
        {role => Object.keys(uix)
          .filter(resource => uix[resource].role === role)
          .map(resource => <Resource
            key={resource}
            show={uix[resource].Show}
            name={resource}
            edit={uix[resource].Edit}
            create={uix[resource].Create}
            list={uix[resource].List}
            remove={Delete}
            options={{ label: `resources.${uix[resource].name}.name` }}
          />
          )}
      </Admin>
    );
  }
}

OdaClientApp.contextTypes = {
  uix: PropTypes.object.isRequired,
  authClient: PropTypes.func.isRequired,
  restClient: PropTypes.func.isRequired,
}

export default OdaClientApp;

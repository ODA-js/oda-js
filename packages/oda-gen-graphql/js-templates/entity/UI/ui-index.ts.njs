<#@ context 'pack' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`./index.js`); -#>
<# for(let entity of pack.entities){-#>
import #{entity.name}Resource, {extension as #{entity.name}Extension } from './#{entity.name}/queries';
<#}-#>

<# for(let entity of pack.entities){-#>
import #{entity.name}UIX from './#{entity.name}/uix';
<#}-#>

import { data } from 'oda-aor-rest';

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
  #{entity.name}: #{entity.name}UIX,
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

export default {
<# for(let entity of pack.entities){-#>
  #{entity.name}: { icon: <ListIcon />, visible: true },
<#}-#>
};

<#- chunkStart(`./admin.js`); -#>
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { client } from 'oda-aor-rest';
import Loading from 'react-loading-animation'
import { Admin, Resource, Delete } from 'admin-on-rest';
import { englishMessages } from 'admin-on-rest';
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

class OdaClientApp extends Component {
  render() {
    const { restClient, authClient, uix } = this.context;
    if (!restClient) {
      return <div className="loading-component"><Loading /></div>;
    }

    return (
      <Admin
        {...this.props}
        messages={messages}
        locale="en"
        authClient={authClient}
        restClient={restClient}>
        {Object.keys(uix).map(resource =>
          <Resource
            key={resource}
            show={uix[resource].Show}
            name={resource}
            edit={uix[resource].Edit}
            create={uix[resource].Create}
            list={uix[resource].List}
            remove={Delete}
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

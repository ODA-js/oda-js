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

<#- chunkStart(`./menuItems.js`); -#>
import React from 'react';
import ListIcon from 'material-ui/svg-icons/action/view-list';

export default [
<# for(let entity of pack.entities){-#>
  { name: '#{entity.name}', icon: <ListIcon /> },
<#}-#>
];

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
          englishMessages,
          translation
        ),
    },
};

class OdaClientApp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      restClient: context.restClient,
      authClient: context.authClient,
      uix: context.uix,
    };
  }

  render() {
    const { restClient, authClient, uix } = this.state;
    if (!restClient) {
      return <div className="loading-component"><Loading /></div>;
    }
    const {
<# for(let entity of pack.entities){-#>
      #{entity.name},
<#}-#>
    } = uix;

    return (
      <Admin
        {...this.props}
        messages={messages}
        locale="en"
        authClient={authClient}
        restClient={restClient}>
<# for(let entity of pack.entities){-#>
        <Resource
          show={#{entity.name}.Show}
          name="#{entity.name}"
          edit={#{entity.name}.Edit}
          create={#{entity.name}.Create}
          list={#{entity.name}.List}
          remove={Delete}
        />
<#}-#>
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

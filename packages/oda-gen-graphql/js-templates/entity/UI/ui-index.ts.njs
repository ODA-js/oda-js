<#@ context 'pack' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`./index.js`); -#>
<# for(let entity of pack.entities){-#>
import #{entity.name}Resource from './#{entity.name}/queries';
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
      new #{entity.name}Resource(),
<#}-#>
    ]);
  }
}

export const uix = {
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}UIX,
<#}-#>
};

<#- chunkStart(`./index-override.js`); -#>

<#- chunkStart(`./admin.js`); -#>
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { client } from 'oda-aor-rest';
import Loading from 'react-loading-animation'
import { Admin, Resource, Delete } from 'admin-on-rest';

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

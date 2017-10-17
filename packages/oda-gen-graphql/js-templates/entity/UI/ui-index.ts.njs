<#@ context 'pack' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`./index.js`); -#>
<# for(let entity of pack.entities){-#>
import { queries as #{entity.name}Query, resource as #{entity.name}Resource } from './#{entity.name}/queries';
<#}-#>

<# for(let entity of pack.entities){-#>
import #{entity.name}UIX from './#{entity.name}/uix';
<#}-#>

import Admin from './admin';

export { Admin };

// здесь класс как в коннекторах было.
// использовать через get; чтобы можно было override делать без проблем.

export const queries = {
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}Query,
<#}-#>
};

export const resources = ({ queries }) => ({
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}Resource({ resources, queries }),
<#}-#>
});

export const uix = {
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}UIX,
<#}-#>
};

<#- chunkStart(`./admin.js`); -#>
import React, { Component } from 'react';
import { client } from 'oda-aor-rest';
import Loading from 'react-loading-animation'
import { Admin, Resource, Delete } from 'admin-on-rest';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restClient: null,
      authClient: null,
      queries: null,
      resources: null,
      uix: null,
    };
  }

  componentDidMount() {
    this.init(this.props, this.context);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    this.init(nextProps, nextContext);
  }

  init(nextProps/* , nextContext */) {
    this.setState({
      restClient: client({
        client: nextProps.connection,
        resources: nextProps.resources,
        queries: nextProps.queries,
      }),
      authClient: nextProps.authClientInit(nextProps.connection),
      queries: this.props.queries,
      resources: this.props.resources,
      uix: this.props.uix,
    });
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




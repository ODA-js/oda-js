<#@ context 'pack' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`./index.js`); -#>
<# for(let entity of pack.entities){-#>
import #{entity.name}Query from './#{entity.name}/queries';
<#}-#>

<# for(let entity of pack.entities){-#>
import #{entity.name}UIX from './#{entity.name}/uix';
<#}-#>

import Admin from './admin';

export { Admin };

export const queries = () => ({
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}Query,
<#}-#>
});

export const uix = () => ({
<# for(let entity of pack.entities){-#>
  #{entity.name}: #{entity.name}UIX,
<#}-#>
});

<#- chunkStart(`./admin.js`); -#>
import React, { Component } from 'react';
import { client } from 'oda-aor-rest';
import Loading from 'react-loading-animation'
import { Admin, Resource } from 'admin-on-rest';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restClient: null,
      authClient: null,
      queries: null,
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
        resources: nextProps.queries,
      }),
      authClient: nextProps.authClientInit(nextProps.connection),
      queries: this.props.queries,
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
          remove={#{entity.name}.Delete}
        />
<#}-#>
      </Admin>
    );
  }
}




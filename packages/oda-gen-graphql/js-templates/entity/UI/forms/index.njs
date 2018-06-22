<#@ context "entity" -#>
<#@ alias 'forms-index' -#>

import loadable from 'loadable-components'

const Title = loadable(() => import('./title'));
const Filter = loadable(() => import('./filter'));
const Form = loadable(() => import('./form'));
const Create = loadable(() => import('./create'));
const Show = loadable(() => import('./show'));
const Edit = loadable(() => import('./edit'));
const List = loadable(() => import('./list'));
const Grid = loadable(() => import('./grid'));
const GridView = loadable(() => import('./gridView'));
const CardView = loadable(() => import('./cardView'));

export default {
  name: '#{entity.name}',
  role: '#{entity.role}',
  Title,
  Filter,
  Form,
  Create,
  Show,
  Edit,
  List,
  Grid,
  GridView,
  CardView
};

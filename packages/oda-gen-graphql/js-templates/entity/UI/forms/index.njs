<#@ context "entity" -#>
<#@ alias 'forms-index' -#>

// import loadable from 'loadable-components'

// const Title = loadable(() => import('./title'));
// const Filter = loadable(() => import('./filter'));
// const Form = loadable(() => import('./form'));
// const FormSimple = loadable(() => import('./formSimple'));
// const Create = loadable(() => import('./create'));
// const Show = loadable(() => import('./show'));
// const ShowSimple = loadable(() => import('./showSimple'));
// const Edit = loadable(() => import('./edit'));
// const List = loadable(() => import('./list'));
// const Grid = loadable(() => import('./grid'));
// const GridView = loadable(() => import('./gridView'));
// const CardView = loadable(() => import('./cardView'));

import Title  from './title';
import Filter  from './filter';
import Form  from './form';
import FormSimple  from './formSimple';
import Create  from './create';
import Show  from './show';
import ShowSimple  from './showSimple';
import Edit  from './edit';
import List  from './list';
import Grid  from './grid';
import GridView  from './gridView';
import CardView  from './cardView';

export default {
  name: '#{entity.name}',
  role: '#{entity.role}',
  Title,
  Filter,
  Form,
  FormSimple,
  Create,
  Show,
  ShowSimple,
  Edit,
  List,
  Grid,
  GridView,
  CardView
};
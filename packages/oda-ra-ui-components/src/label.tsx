import * as React from 'react';
import * as translate from 'admin-on-rest/lib/i18n/translate';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';

import styles from './styles';

const Label = ({ style, text, children, translate }, { muiTheme = getMuiTheme(lightBaseTheme) }) => {
  const labelStyle = Object.assign(styles.label, {
    color: muiTheme.textField.focusColor,
  });
  return (
    <div style={styles.labelContainer} >
      <TextFieldLabel muiTheme={muiTheme} style={style || labelStyle} shrink={false}>
        {translate(text)}
      </TextFieldLabel>
    </div>
  );
}

export default translate(Label);
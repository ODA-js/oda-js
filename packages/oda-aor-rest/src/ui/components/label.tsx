import * as React from 'react';

import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import styles from './styles';

const Label = ({ style, text, children }, { muiTheme = getMuiTheme(lightBaseTheme) }) => {
  const labelStyle = Object.assign(styles.label, {
    color: muiTheme.textField.focusColor,
  });
  return (
    <div style={styles.labelContainer} >
      <TextFieldLabel muiTheme={muiTheme} style={style || labelStyle} shrink={false}>
        {text}
      </TextFieldLabel>
    </div>
  );
}

export default Label;
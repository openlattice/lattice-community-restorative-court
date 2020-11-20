import React from 'react';

import { addDecorator } from '@storybook/react';
import {
  LatticeLuxonUtils,
  MuiPickersUtilsProvider,
  StylesProvider,
  ThemeProvider,
  lightTheme
} from 'lattice-ui-kit';

addDecorator(storyFn => (
  <ThemeProvider theme={lightTheme}>
    <MuiPickersUtilsProvider utils={LatticeLuxonUtils}>
      <StylesProvider injectFirst>{storyFn()}</StylesProvider>
    </MuiPickersUtilsProvider>
  </ThemeProvider>
));

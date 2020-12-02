// @flow
import React from 'react';
import type { Node } from 'react';

import { ConnectedRouter } from 'connected-react-router/immutable';
import {
  Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook
} from 'react-redux';

import initializeReduxStore from '../../core/redux/ReduxStore';
import initializeRouterHistory from '../../core/router/RouterHistory';

const routerHistory = initializeRouterHistory();
const crcStore = initializeReduxStore(routerHistory);

const crcContext = React.createContext(null);

export const useStore = createStoreHook(crcContext);
export const useDispatch = createDispatchHook(crcContext);
export const useSelector = createSelectorHook(crcContext);

type Props = {
  children :Node;
};

const AppProvider = ({ children } :Props) => (
  <Provider context={crcContext} store={crcStore}>
    <ConnectedRouter history={routerHistory} context={crcContext}>
      { children }
    </ConnectedRouter>
  </Provider>
);

export default AppProvider;

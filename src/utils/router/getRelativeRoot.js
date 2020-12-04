// @flow
import type { Match } from 'react-router';

const getRelativeRoot = (root :string, match :Match) => {
  if (match.params) {
    return Object.entries(match.params)
      // $FlowFixMe
      .reduce((newRoot, [param, value]) => newRoot.replace(RegExp(`:${param}`, 'g'), value), root);
  }
  return root;
};

export default getRelativeRoot;

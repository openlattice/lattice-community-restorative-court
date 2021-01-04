// @flow
import { Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

export default function generateTableHeaders(headers :string[]) :Object[] {

  const tableHeaders = [];
  headers.forEach((header :string) => {
    tableHeaders.push({
      cellStyle: {
        backgroundColor: 'white',
        color: NEUTRAL.N900,
        fontSize: '11px',
        fontWeight: '600',
        padding: '15px',
        textAlign: 'left',
      },
      key: header,
      label: header,
      sortable: (header && header !== ' ') || false,
    });
  });
  return tableHeaders;
}

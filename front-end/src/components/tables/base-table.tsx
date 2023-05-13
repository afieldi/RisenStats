import { Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from "@mui/material";

interface TableProps<T extends string> {
  headers: T[];
  data: {[key in T]: string | number}[],
  rowSx?: {[key in T]: SxProps<Theme>},
}

export default function BaseTable<T extends string>(props: TableProps<T>) {
  const {
    headers,
    data,
    rowSx,
  } = props;

  const rowSxNonNull = rowSx || {} as {[key in T]: SxProps<Theme>};
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {
                headers.map(header => (
                  <TableCell>
                    <Typography>{header}</Typography>
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map((rowData) => (
                <TableRow>
                  {
                    headers.map(header => (
                      <TableCell sx={rowSxNonNull[header]}>
                        <Typography>{rowData[header]}</Typography>
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
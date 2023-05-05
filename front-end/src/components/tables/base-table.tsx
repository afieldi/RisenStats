import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

interface TableProps<T extends string> {
  headers: T[];
  data: {[key in T]: string | number}[]
}

export default function BaseTable<T extends string>(props: TableProps<T>) {
  const {
    headers,
    data,
  } = props;
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
                      <TableCell>
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
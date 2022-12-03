import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import React from "react";
import { TableColumn, SortOrder } from "../../../common/types";


interface EnhancedTableProps<T> {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: SortOrder;
  orderBy: string;
  headCells: TableColumn<T>[];
}

export default function SortableTableHead<T>(props: EnhancedTableProps<T>) {
  const {
    order,
    orderBy,
    onRequestSort,
    headCells,
  } = props;
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id.toString()}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : SortOrder.ASC}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography>
                {headCell.label}
              </Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === SortOrder.DESC ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
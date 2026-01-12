import { Delete } from "@mui/icons-material";
import {
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
} from "@mui/material";
import React from "react";

export default function ShapeTable({ shape }) {
  console.log(shape);
  return (
    <TableContainer>
      <Table ara-label="simpel Table">
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Detalle</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shape.map((item) => (
            <TableRow>
              <TableCell>{item.tipo||item.type}</TableCell>
              <TableCell></TableCell>
              <TableCell>{item.detail}</TableCell>
              <TableCell>
                <Delete color="error" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

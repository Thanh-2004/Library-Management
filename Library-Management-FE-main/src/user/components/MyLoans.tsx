import React, { useEffect } from "react";
import { useAppDispatch } from "../../customHooks/useAppDispatch";
import { useAppSelector } from "../../customHooks/useAppSelector";
import { getMyLoans } from "../../loans/loansSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";

const MyLoans = () => {
  const dispatch = useAppDispatch();
  const { loans, isLoading, error } = useAppSelector((state) => state.loans);

  useEffect(() => {
    dispatch(getMyLoans());
  }, [dispatch]);

  if (isLoading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1000, margin: "20px auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Borrowed Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Book Title</strong></TableCell>
              <TableCell><strong>ISBN</strong></TableCell>
              <TableCell><strong>Borrow Date</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No active loans found.</TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>{loan.bookId?.title || "Unknown Book"}</TableCell>
                  <TableCell>{loan.bookId?.ISBN || "N/A"}</TableCell>
                  <TableCell>{new Date(loan.borrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={loan.status} 
                      color={loan.status === "BORROWED" ? "primary" : loan.status === "OVERDUE" ? "error" : "success"} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyLoans;
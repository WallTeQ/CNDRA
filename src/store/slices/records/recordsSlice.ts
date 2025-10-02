// import {
//   addRecord,
//   updateRecord,
//   deleteRecord,
//   fetchRecordById,
//   fetchRecords,
//   fetchrestrictedRecords,
//   fetchConfidentialRecords,
// } from "./recordsThunk";
// import { createSlice } from "@reduxjs/toolkit";
// import { Record } from "../../../types";


// // Define the initial state using that type
// interface RecordsState {
//   records: Record[];
//   currentRecord: Record | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: RecordsState = {
//   records: [],
//   currentRecord: null,
//   isLoading: false,
//   error: null,
// };

// const recordsSlice = createSlice({
//   name: "records",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearCurrentRecord: (state) => {
//       state.currentRecord = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch Records
//     builder
//       .addCase(fetchRecords.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchRecords.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.records = action.payload;
//       })
//       .addCase(fetchRecords.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       })
//       .addCase(addRecord.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(addRecord.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.records.push(action.payload);
//       })
//       .addCase(addRecord.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       })
//       // Update Record
//       .addCase(updateRecord.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(updateRecord.fulfilled, (state, action) => {
//         state.isLoading = false;
//         const index = state.records.findIndex(
//           (record) => record.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.records[index] = action.payload;
//         }
//       })
//       .addCase(updateRecord.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       })
//       // Delete Record
//       .addCase(deleteRecord.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(deleteRecord.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.records = state.records.filter(
//           (record) => record.id !== action.payload
//         );
//       })
//       .addCase(deleteRecord.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       })
//       // Fetch Record by ID
//       .addCase(fetchRecordById.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchRecordById.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentRecord = action.payload;
//       })
//       .addCase(fetchRecordById.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       })
//       // Fetch Restricted Records
//       .addCase(fetchrestrictedRecords.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchrestrictedRecords.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.records = action.payload;
//       })
//       .addCase(fetchrestrictedRecords.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       })
//       // Fetch Confidential Records
//       .addCase(fetchConfidentialRecords.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchConfidentialRecords.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.records = action.payload;
//       })
//       .addCase(fetchConfidentialRecords.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const { clearError, clearCurrentRecord } = recordsSlice.actions;

// export default recordsSlice.reducer;


import {
  addRecord,
  updateRecord,
  deleteRecord,
  fetchRecordById,
  fetchRecords,
  fetchrestrictedRecords,
  fetchConfidentialRecords,
} from "./recordsThunk";
import { createSlice } from "@reduxjs/toolkit";
import { Record } from "../../../types";

interface RecordsState {
  records: Record[];
  currentRecord: Record | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RecordsState = {
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,
};

const recordsSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Records
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch records";
      })
      // Add Record
      .addCase(addRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records.push(action.payload);
      })
      .addCase(addRecord.rejected, (state, action) => {
        state.isLoading = false;
        // Handle error object from backend
        const errorPayload = action.payload as any;
        if (typeof errorPayload === "object" && errorPayload?.message) {
          state.error = errorPayload.message;
        } else if (typeof errorPayload === "string") {
          state.error = errorPayload;
        } else {
          state.error = action.error.message || "Failed to add record";
        }
      })
      // Update Record
      .addCase(updateRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.records.findIndex(
          (record) => record.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(updateRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update record";
      })
      // Delete Record
      .addCase(deleteRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = state.records.filter(
          (record) => record.id !== action.payload
        );
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete record";
      })
      // Fetch Record by ID
      .addCase(fetchRecordById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecordById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchRecordById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch record";
      })
      // Fetch Restricted Records
      .addCase(fetchrestrictedRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchrestrictedRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchrestrictedRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch restricted records";
      })
      // Fetch Confidential Records
      .addCase(fetchConfidentialRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConfidentialRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchConfidentialRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch confidential records";
      });
  },
});

export const { clearError, clearCurrentRecord } = recordsSlice.actions;

export default recordsSlice.reducer;
 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScanResult {
  condition: string;
  description: string;
}

interface ScanResultsState {
  items: ScanResult[];
}

const initialState: ScanResultsState = {
  items: [],
};

const scanResultsSlice = createSlice({
  name: 'scanResults',
  initialState,
  reducers: {
    setScanResults(state, action: PayloadAction<ScanResult[]>) {
      state.items = action.payload;
    },
    addScanResult(state, action: PayloadAction<ScanResult>) {
      state.items.push(action.payload);
    },
    clearScanResults(state) {
      state.items = [];
    },
  },
});

export const { setScanResults, addScanResult, clearScanResults } = scanResultsSlice.actions;
export default scanResultsSlice.reducer;

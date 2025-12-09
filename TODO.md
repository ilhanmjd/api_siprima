# Fix Risk Treatment Validation Errors

## Issue
API call for creating risk treatment fails with validation errors because `probabilitas_akhir`, `dampak_akhir`, and `level_residual` are null.

## Root Cause
- Risk treatment fields were not initialized in AssetContext, leading to undefined/null values.
- No validation for numeric fields before parsing and sending to API.
- Input fields allowed text, leading to invalid submissions.

## Solution
- [x] Add risk treatment fields to AssetContext initial state and reset function.
- [x] Add validation in handleConfirm to ensure numeric fields are valid numbers before API call.
- [x] Change input types to "number" for Probabilitas Akhir, Dampak Akhir, and Level Residual to restrict to numeric input only.

## Files Modified
- `src/contexts/AssetContext.jsx`: Added risk treatment fields to initial state and reset function.
- `src/pages/dinas/risiko/konfirmasi-input-risk-treatment.jsx`: Added validation for numeric fields in handleConfirm.
- `src/pages/dinas/risiko/RiskTreatment2.jsx`: Changed input types to "number" for numeric fields.

## Testing
- Ensure all fields are filled in the form before submission.
- Verify that invalid inputs (non-numeric) show an alert and prevent submission.
- Confirm successful API call with valid data.
- Check that number inputs only accept numeric values.

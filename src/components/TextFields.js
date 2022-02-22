import { Box, TextField } from "@mui/material";
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import * as React from 'react';

export const Multiline = ({label, val, onChange}) => {
  const [value, setValue] = React.useState(val);

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        id="outlined-textarea"
        label={label}
        placeholder={label || "input..."}
        multiline
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e)
        }}
      />
    </Box>
  );
}

export const Datepicker = ({label, val, onChange}) => {
  const [value, setValue] = React.useState(val)

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <MobileDatePicker
        label={label}
        inputFormat="DD/MM/yyyy"
        value={value}
        onChange={(x) => {
          setValue(x)
          onChange(x)
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
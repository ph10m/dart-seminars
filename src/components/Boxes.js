import { Box } from "@mui/material";

const textfieldStyle = {
 '& .MuiTextField-root': {
    my: 1,
    mx: 1,
    minWidth: '80vw'
  }
}
export const FullWidthBox = ({children}) => (
  <Box fullWidth sx={textfieldStyle}>{children}</Box>
)
import { Fab } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const FloatWithIcon = ({Icon, text, ...props }) => {
  const theme = useTheme();

  if (useMediaQuery(theme.breakpoints.up("sm"))) {
    return (
      <Fab variant="extended" {...props}>
        <Icon sx={{ mr: 1 }}/>
        {text}
      </Fab>
    )
  } 
  return (
    <Fab {...props} size="small">
      <Icon/>
    </Fab>
  )
}
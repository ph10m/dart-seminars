import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupLogin({isOpen, onCancel, loginConfig, auth}) {
  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={onCancel}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        {/* <DialogTitle>{"Sign in"}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          </DialogContentText>
          <StyledFirebaseAuth uiConfig={loginConfig} firebaseAuth={auth} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

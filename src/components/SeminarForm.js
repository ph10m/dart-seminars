import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import moment from 'moment';
import { collection, getDocFromServer, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Datepicker = ({label, val, onChange}) => {
  const [date, setDate] = React.useState(moment(val));
  const [time, setTime] = React.useState(null)

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <MobileDatePicker
        label="Date"
        inputFormat="DD/MM/yyyy"
        value={date}
        onChange={(newDate) => {
          setDate(newDate)
          onChange(newDate)
        }}
        renderInput={(params) => <TextField {...params} />}
      />
      {/* <TimePicker
        label="Time"
        value={time}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      /> */}
    </LocalizationProvider>
  )
}

const Multiline = ({label, val, onChange}) => {
  const [value, setValue] = React.useState(val);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event)
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-textarea"
        label={label}
        placeholder={label}
        multiline
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
}

export default function SeminarForm({isOpen, db, seminar, editFn}) {
  const [changedSeminar, setSeminar] = React.useState({...seminar})
  const [isNew, setNew] = React.useState(false);
  const [toDelete, setDelete] = React.useState(false);

  React.useEffect(async () => {
    const docRef = doc(db, "seminars", seminar.id)
    try {
      getDocFromServer(docRef).then((x) => {
        setNew(!x.exists())
      })
    } catch (e) {
      console.error(e)
    }
  }, [])


  const handleClose = () => {
    editFn(null)
  }

  const saveChanges = async () => {
    // use the uuid (as the index) to store 
    const docRef = collection(db, "seminars")
    try {
      await setDoc(doc(docRef, changedSeminar.id), {...changedSeminar})
    } catch (e) {
      console.error("Error changing doc id", seminar.id)
    }

    editFn(null);
  }

  const deleteSeminar = async () => {
    const docRef = collection(db, "seminars")
    try {
      await deleteDoc(doc(docRef, changedSeminar.id))
    } catch (e) {
      console.error("Error deleting doc id", seminar.id)
    }
    editFn(null);
  }

  const handleChange = (key, value) => {
    let state = {...changedSeminar}
    state[key] = value
    setSeminar(state)
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {isNew ? "New seminar" : "Modify seminar"}
            </Typography>
            <Button autoFocus color="inherit" onClick={saveChanges}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {seminar && (
            Object.entries(seminar).map(([key, val]) => {
              if (key == "id") {
                return <React.Fragment key={key} />
              }
              return (
              <ListItem key={key}>
                <Box
                  fullWidth
                  sx={{
                    '& .MuiTextField-root': {
                      my: 2, mx: 1, minWidth: '80vw'
                    },
                  }}
                >
                  {key.includes("date") ? (
                    <Datepicker
                      label={key}
                      val={val}
                      onChange={(e) => {
                        handleChange(key, moment(e).toISOString())}
                      }
                    />
                  ) : (
                    <Multiline
                      label={key}
                      val={val}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  )}
                </Box>
              </ListItem>
              )
            })
          )}
        </List>
        {!isNew && (
          <>
            <Button variant="outlined" color="error" onClick={() => setDelete(true)}>
              Delete seminar
            </Button>
            <Dialog
              open={toDelete}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete seminar"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Are you sure you want to delete this seminar: "${changedSeminar.topic}"?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDelete(false)}>Go back!</Button>
                <Button
                  color="error"
                  onClick={() => {
                    deleteSeminar()
                    setDelete(false)
                  }}
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Dialog>
    </div>
  );
}
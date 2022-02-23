import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import { collection, getDocFromServer, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { FullWidthBox } from '../components/Boxes';
import { Datepicker, Multiline } from '../components/TextFields';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function SeminarForm({isOpen, db, seminar, editFn}) {
  const [changedSeminar, setSeminar] = React.useState({...seminar})
  const [isNew, setNew] = React.useState(false);
  const [toDelete, setDelete] = React.useState(false);

  const docRef = collection(db, "seminars")
  const seminarRef = doc(db, "seminars", seminar.id)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        getDocFromServer(seminarRef).then((x) => {
          setNew(!x.exists())
        })
      } catch (e) {
        console.error(e)
      }
    }
    fetchData();
  }, [db, seminar.id])


  const handleClose = () => editFn(null)

  // use the uuid (as the index) to store 
  const saveChanges = async () => {
    try {
      await setDoc(doc(docRef, changedSeminar.id), {...changedSeminar})
    } catch (e) {
      console.error("Error changing doc id", seminar.id)
    }

    editFn(null);
  }

  const deleteSeminar = async () => {
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
      <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {isNew ? "New seminar" : "Modify seminar"}
            </Typography>
            <Button autoFocus color="inherit" onClick={saveChanges}>save</Button>
          </Toolbar>
        </AppBar>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          margin={0}
          padding={2}
          marginBottom={30}
        >
        <List>
          {seminar && (
            <>
              {Object.entries(seminar).sort().map(([key, val]) => {
                if (key === "id") {
                  return <React.Fragment key={key} />
                }
                return (
                <ListItem key={key}>
                  <FullWidthBox>
                    {key.includes("date") ? (
                      <Datepicker
                        label={key.toUpperCase()}
                        val={val}
                        onChange={(e) => { handleChange(key, moment(e).toISOString())} }
                      />
                    ) : (
                      <Multiline
                        label={key.toUpperCase()}
                        val={val}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    )}
                  </FullWidthBox>
                </ListItem>
                )
              })}
              <ListItem>
                {/* always set time and an image, regardless if it's in the database */}
                <FullWidthBox>
                  <TextField
                    id="time"
                    label="Start time"
                    type="time"
                    defaultValue="12:00"
                    InputLabelProps={{ shrink: true, }}
                    inputProps={{ step: 900 }}
                    sx={{ width: 200 }}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </FullWidthBox>
              </ListItem>
              <ListItem>
                <FullWidthBox>
                  <Multiline
                    label="IMAGE URL"
                    val={seminar.image || "https://en.uit.no/Content/534983/cache=1505474594000/grid-AI.jpg"}
                    onChange={(e) => handleChange("image", e.target.value)}
                  />
                </FullWidthBox>
              </ListItem>
            </>
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
        </Grid>
      </Dialog>
    </div>
  );
}
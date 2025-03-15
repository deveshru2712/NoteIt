import { useEffect, useState } from "react";

import { Button, Col, Container, Row } from "react-bootstrap";
import styles from "./styles/NotePage.module.css";
import stylesUtils from "./styles/utils.module.css";

import { Note as NoteModel } from "./models/notes";

import * as NoteApi from "./api/notes_api";
import AddNoteDialog from "./components/AddNoteDialog";
import Note from "./components/Note";

const App = () => {
  // this tell tsc that i will be of Note type in future
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showAddNoteDialog, setshowAddNoteDialog] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notes = await NoteApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };
    loadNotes();
  }, []);

  const deleteNote = async (note: NoteModel) => {
    try {
      await NoteApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Button
        className={`mb-4 ${stylesUtils.blockCenter}`}
        onClick={() => setshowAddNoteDialog(true)}
      >
        Add new Note
      </Button>
      <Row xs={1} md={2} xl={3} className="g-4">
        {notes.map((item) => (
          <Col key={item._id}>
            <Note
              note={item}
              className={styles.note}
              onDeleteNoteClicked={deleteNote}
            />
          </Col>
        ))}
      </Row>
      {showAddNoteDialog && (
        <AddNoteDialog
          onDismiss={() => setshowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setshowAddNoteDialog(false);
          }}
        />
      )}
    </Container>
  );
};

export default App;

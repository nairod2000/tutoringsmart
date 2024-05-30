import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTopics } from '../../context/topicsContext';

export default function AddTopicButton({ parentId, level = 0 }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const { createTopic } = useTopics();

  function handleAdd() {
    createTopic(name, parentId);
    setName('');
    setAdding(false);
  }

  return (
    <>
      {adding ? (
        <ListItem style={{ paddingLeft: level * 20 }}>
          <TextField value={name} onChange={(e) => setName(e.target.value)} label="Topic Name" />
          <Button onClick={handleAdd}>Add</Button>
          <Button onClick={() => setAdding(false)}>Cancel</Button>
        </ListItem>
      ) : (
        <ListItem button style={{ paddingLeft: level * 20 }} onClick={() => setAdding(true)}>
          <IconButton>
            <Add />
          </IconButton>
          <ListItemText primary={parentId ? "Add a subtopic!" : "Add a topic!"} />
        </ListItem>
      )}
    </>
  );
}

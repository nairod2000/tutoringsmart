import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, Collapse, List, ListItemSecondaryAction, Menu, MenuItem } from '@mui/material';
import { ExpandLess, ExpandMore, MoreHoriz, Add } from '@mui/icons-material';
import { useTopics } from '../../context/topicsContext';
import AddTopicButton from './addTopicButton';
import DeleteConfirmationModal from './deleteConfirmationModal';

export default function TopicItem({ topic, level = 0 }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { deleteTopic } = useTopics();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setAnchorEl(null);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteTopic(topic.id);
    setShowModal(false);
  };

  return (
    <>
      <ListItem button style={{ paddingLeft: level * 20 }}>
        <IconButton onClick={handleToggle}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <ListItemText primary={topic.name} secondary={`Remaining: ${topic.remaining || 0}, Review: ${topic.review || 0}`} />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleMenuOpen}>
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {topic.subtopics && topic.subtopics.map(subtopic => (
            <TopicItem key={subtopic.id} topic={subtopic} level={level + 1} />
          ))}
          <AddTopicButton parentId={topic.id} level={level + 1} />
        </List>
      </Collapse>
      <DeleteConfirmationModal open={showModal} onClose={() => setShowModal(false)} onConfirm={handleDeleteConfirm} />
    </>
  );
}

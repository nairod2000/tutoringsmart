import React from 'react';
import { useTopics } from '../../context/topicsContext';
import { List, Typography, CircularProgress, Alert } from '@mui/material';
import TopicItem from './topicItem';
import AddTopicButton from './addTopicButton';

export default function TopicList() {
  const { topics, loading, error } = useTopics();

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error loading topics</Alert>;

  return (
    <List>
      {topics.length === 0 ? (
          <Typography variant="h6" align="center" gutterBottom>
              No topics available. Add a new topic!
          </Typography>
      ) : (
          topics.map(topic => (
              <TopicItem key={topic.id} topic={topic} />
          ))
      )}
      <AddTopicButton parentId={null} />
    </List>
  );
};
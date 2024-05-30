import React from 'react';
import { useTopics } from '../../context/topicsContext';
import { List, Typography, CircularProgress, Alert, Box, Card } from '@mui/material';
import TopicItem from './topicItem';
import AddTopicButton from './addTopicButton';
import useAuthProtection from '../../hooks/useAuthProtection';


export default function TopicList() {
  const { topics, loading, error } = useTopics();
  const authLoading = useAuthProtection();

  if (authLoading || loading) {
    return ( 
      <Box sx={{ display: 'flex', height: 'calc(100vh - var(--navbar-height))', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }
  if (error) return <Alert severity="error">Error loading topics</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 'calc(100vh - 128px)' }}>
      <Card variant='outlined'>
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
      </Card>
    </Box>
  );
};
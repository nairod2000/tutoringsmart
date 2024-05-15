'use client'
import Navbar from "../../components/navbar/navbar"
import React from 'react';
import TopicsProvider, { useTopics } from "../../context/topicsContext";
import TopicList from "../../components/topics/topicList";
import { Container, Typography } from '@mui/material';

export default function Course() {

  return (
    <TopicsProvider>
      <Navbar />
      <Container style={{alignContent:'center'}}>
        <TopicList />
      </Container>
    </TopicsProvider>
  )
}
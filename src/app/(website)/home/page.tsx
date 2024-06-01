'use client'
import Navbar from "../../../components/navbar/navbar"
import React from 'react';
import TopicList from "../../../components/topics/topicList";
import { Container } from '@mui/material';

export default function Course() {

  return (
    <>
      <Navbar />
      <Container style={{alignContent:'center'}}>
        <TopicList />
      </Container>
    </>
  )
}
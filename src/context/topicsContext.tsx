import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const TopicsContext = createContext(null);

export function useTopics() {
  return useContext(TopicsContext);
}

export default function TopicsProvider({ children }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('/api/topics/')
      .then(response => {
        setTopics(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  function createTopic(name, parent = null) {
    const newTopic = {
      name: name,
      parent: parent,
      created_by: 1,  // Replace with actual user ID when authentication is implemented
    };

    return axiosInstance.post('/api/topics/', newTopic)
      .then(response => {
        setTopics([...topics, response.data]);
      });
  }

  function updateTopic(id, updatedTopic) {
    return axiosInstance.put(`/api/topics/${id}/`, updatedTopic)
      .then(response => {
        setTopics(topics.map(topic => topic.id === id ? response.data : topic));
      });
  }

  function deleteTopic(id) {
    return axiosInstance.delete(`/api/topics/${id}/`)
      .then(() => {
        setTopics(topics.filter(topic => topic.id !== id));
      });
  }

  return (
    <TopicsContext.Provider value={{ topics, loading, error, createTopic, updateTopic, deleteTopic }}>
      {children}
    </TopicsContext.Provider>
  );
}
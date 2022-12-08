import { Typography, Grid, Fab, Box } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import config from '../../config.js';
import GridItem from '../components/gridItem.jsx';
import Header from '../components/header.jsx';

export default function Root() {
  const isLoading = useRef(true);
  const [loading, _setLoading] = useState(true);
  const [viewRemoved, setViewRemoved] = useState(false);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [initialTimestamp, setTimestamp] = useState('');

  const setLoading = (value) => {
    _setLoading(value);
    isLoading.current = value;
  };

  const loadPage = () => {
    axios
      .get(`${config.API_URI}/items?page=${page}&removed=${viewRemoved ? 1 : 0}`)
      .then((response) => {
        setItems([...items, ...response.data]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPage();
  }, [page, viewRemoved, initialTimestamp]);

  const loadInitial = () => {
    setItems([]);
    setLoading(true);
    setPage(0);
    setTimestamp(new Date().toISOString());
  };

  useEffect(loadInitial, []);

  const toggleRemoved = () => {
    setViewRemoved(!viewRemoved);

    loadInitial();
  };

  const updateSeen = () => {
    axios.patch(`${config.API_URI}/items?seen=1&timestamp=${initialTimestamp}`).then(loadInitial);
  };

  const handleItemAction = (id) => {
    axios.patch(`${config.API_URI}/items/${id}?removed=${viewRemoved ? 0 : 1}`);

    setItems(items.filter((item) => item.id !== id));
  };

  const handleScroll = (e) => {
    if (isLoading.current) return;

    const reachedBottom =
      e.target.children[0].scrollHeight -
        e.target.children[0].scrollTop -
        e.target.children[0].clientHeight <
      150;
    if (reachedBottom) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, page]);

  const ItemsList = ({ elements }) =>
    elements.map((item) => (
      <GridItem
        key={item.id}
        id={item.id}
        isNew={item.new}
        isRemoved={item.removed}
        img={item.images.length ? `${config.API_URI}/images/${item.images[0]}` : 'default.png'}
        price={item.price}
        title={item.title}
        lastUpdated={moment(item.dateUpdated).fromNow()}
        itemAction={() => handleItemAction(item.id)}
      />
    ));

  return (
    <Header>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Fab variant="extended" color="primary" sx={{ mr: 2 }} onClick={toggleRemoved}>
          {!viewRemoved ? 'Show removed' : 'Hide removed'}
        </Fab>
        <Fab variant="extended" color="secondary" onClick={updateSeen}>
          Mark as seen
        </Fab>
      </Box>
      <Grid container spacing={4}>
        {!loading && items.length ? (
          <ItemsList elements={items} />
        ) : (
          <Typography sx={{ mt: 4 }}>Loading</Typography>
        )}
      </Grid>
    </Header>
  );
}

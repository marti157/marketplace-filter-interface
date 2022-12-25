import { Typography, Grid, Fab, Box } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config.js';
import GridItem from '../components/gridItem.jsx';
import Header from '../components/header.jsx';
import { request, handleRequestError } from '../utils/request.js';

export default function Root() {
  const isLoading = useRef(true);
  const [loading, _setLoading] = useState(true);
  const [viewRemoved, setViewRemoved] = useState(false);
  const [page, setPage] = useState(0);
  const pageEnd = useRef(false);
  const [items, setItems] = useState([]);
  const [initialTimestamp, setTimestamp] = useState('');
  const navigate = useNavigate();

  const setLoading = (value) => {
    _setLoading(value);
    isLoading.current = value;
  };

  const loadPage = () => {
    request({
      method: 'get',
      uri: `/items?page=${page}&removed=${viewRemoved ? 1 : 0}`,
    })
      .then((response) => {
        if (response.data.length === 0) {
          pageEnd.current = true;
        } else {
          setItems([...items, ...response.data]);
        }

        setLoading(false);
      })
      .catch(handleRequestError);
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

  useEffect(() => {
    if (localStorage.getItem('jwtToken') === null) {
      navigate('/login');
    } else {
      loadInitial();
    }
  }, []);

  const toggleRemoved = () => {
    setViewRemoved(!viewRemoved);

    loadInitial();
  };

  const updateSeen = () => {
    request({
      method: 'patch',
      uri: `/items?seen=1&timestamp=${initialTimestamp}`,
    })
      .then(loadInitial)
      .catch(handleRequestError);
  };

  const handleItemAction = (id) => {
    request({
      method: 'patch',
      uri: `/items/${id}?removed=${viewRemoved ? 0 : 1}`,
    }).catch(handleRequestError);

    setItems(items.filter((item) => item.id !== id));

    if (items.length < 3 && !isLoading.current && !pageEnd.current) {
      setPage(page + 1);
    }
  };

  const handleScroll = (e) => {
    if (isLoading.current || pageEnd.current) return;

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
        img={
          item.images.length
            ? `${
                config.API_URI === 'self' ? `${window.location.origin}/api/..` : config.API_URI
              }/images/${item.images[0]}`
            : 'default.png'
        }
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

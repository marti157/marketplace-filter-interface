import { Typography, Divider, Box, Container, Chip } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import config from '../../config.js';
import Header from '../components/header.jsx';
import { request, handleRequestError } from '../utils/request.js';

function Carousel({ images, activeStep, handleStepChange = () => {} }) {
  return (
    <>
      <SwipeableViews
        axis="x"
        index={activeStep}
        containerStyle={{ alignItems: 'center', backgroundColor: 'black' }}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((image, index) => (
          <Fragment key={image}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  width: '100%',
                }}
                src={`${
                  config.API_URI === 'self' ? `${window.location.origin}/api/..` : config.API_URI
                }/images/${image}`}
              />
            ) : null}
          </Fragment>
        ))}
      </SwipeableViews>
      <Chip
        label={`${activeStep + 1}/${images.length}`}
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 30 }}
      />
    </>
  );
}

function ItemDetails({ values, activeStep, handleStepChange }) {
  return (
    <>
      <Container maxWidth="sm" sx={{ mb: 3, position: 'relative' }}>
        {values.images.length ? (
          <Carousel
            images={values.images}
            activeStep={activeStep}
            handleStepChange={handleStepChange}
          />
        ) : (
          <Typography variant="h6" sx={{ my: 3 }}>
            No images
          </Typography>
        )}
      </Container>
      <Typography variant="h4">{values.price} €</Typography>
      <Typography variant="h5">{values.title}</Typography>
      <Typography variant="body">{values.description}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body">
        Created {moment(values.dateCreated).fromNow()}&nbsp;&nbsp;|&nbsp;&nbsp;Updated{' '}
        {moment(values.dateUpdated).fromNow()}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <a href={values.link} target="_blank" rel="noreferrer">
        {values.link}
      </a>
    </>
  );
}

export default function Item() {
  const { itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [item, setItem] = useState({});

  const loadItem = () =>
    request({ method: 'get', uri: `/items/${itemId}` })
      .then((response) => {
        setItem(response.data);
      })
      .catch(handleRequestError);

  useEffect(() => {
    loadItem().then(() => setLoading(false));
  }, []);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Header>
      {!loading ? (
        <ItemDetails values={item} activeStep={activeStep} handleStepChange={handleStepChange} />
      ) : (
        <Typography sx={{ mt: 4 }}>Loading</Typography>
      )}
    </Header>
  );
}

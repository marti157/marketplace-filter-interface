import { Delete, Add } from '@mui/icons-material';
import {
  Chip,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Fab,
} from '@mui/material/';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GridItem({
  id,
  isNew,
  isRemoved,
  img,
  price,
  title,
  lastUpdated,
  itemAction = () => {},
}) {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ borderRadius: '8px', width: '100%', position: 'relative' }}>
        {isNew ? (
          <Chip
            label="New"
            color="primary"
            sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}
          />
        ) : null}
        {isRemoved ? (
          <Chip
            label="Removed"
            color="error"
            sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}
          />
        ) : null}
        <CardActionArea>
          <CardMedia component="img" height="288" image={img} onClick={() => navigate(`/${id}`)} />
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'inline' }} onClick={() => navigate(`/${id}`)}>
              <Typography gutterBottom variant="h6" component="div" color="text.primary">
                {price} €
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="body2">{lastUpdated}</Typography>
            </Box>
            {isRemoved ? (
              <Fab size="small" color="primary" onClick={itemAction}>
                <Add />
              </Fab>
            ) : (
              <Fab size="small" color="error" onClick={itemAction}>
                <Delete />
              </Fab>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

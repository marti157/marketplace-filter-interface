import axios from 'axios';
import { redirect } from 'react-router-dom';
import config from '../../config.js';

export const request = ({ method, uri, auth = true }) => {
  const axiosConfig = {
    method,
    url: `${config.API_URI === 'self' ? `${window.location.origin}/api` : config.API_URI}${uri}`,
  };

  if (auth) {
    axiosConfig.headers = { 'x-access-token': localStorage.getItem('jwtToken') };
  }

  return axios(axiosConfig);
};

export const handleRequestError = (err) => {
  if (err.status === 401) {
    localStorage.removeItem('jwtToken');
    redirect('/login');
  }
};

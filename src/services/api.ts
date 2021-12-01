import axios from 'axios';

const fluigApi = axios.create({
  baseURL: 'http://localhost/',
});

export default fluigApi;

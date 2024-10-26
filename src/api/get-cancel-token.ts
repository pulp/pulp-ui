import axios from 'axios';

export const getCancelToken = () => axios.CancelToken.source();

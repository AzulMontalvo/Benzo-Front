import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:5265/api'
});
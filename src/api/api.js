import axios from 'axios';

const api = axios.create({
    baseURL: 'https://todolist-gjf8ftczavaadede.brazilsouth-01.azurewebsites.net/v1',
});

export default api;
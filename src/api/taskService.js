import api from "./api";

export const fetchTodos = async () => {
    const response = await api.get('/Task');
    console.log("Resposta da API:", response.data); 
    return response.data;
};

export const addTodo = async (task) => {
    const response = await api.post('/Task', task);
    return response.data;
};

export const deleteTodo = async (id) => {
    await api.delete(`/Task/${id}`);
};

export const updateTodo = async (id, updatedTodo) => {
    const response = await api.put(`/Task/${id}`, updatedTodo); 
    return response.data;
};


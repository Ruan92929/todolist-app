import React, { useEffect, useState, useRef } from 'react';
import { fetchTodos, addTodo, deleteTodo, updateTodo } from '../api/taskService';
import './styles.css';
import deleteIcon from '../assets/delete2.png';
import editIcon from '../assets/edit2.png';
import addIcon from '../assets/botao-adicionar.png';
import order from '../assets/ordenar-por.png';
import Swal from 'sweetalert2';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const inputRef = useRef(null);

    const loadTodos = async () => {
        try {
            const data = await fetchTodos();
            setTodos(data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const handleAddTodo = async (event) => {
        event.preventDefault();

        if (!newTodo) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Por favor, adicione uma tarefa antes de enviar.',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-content',
                    confirmButton: 'custom-button'
                },
                background: '#e7f1ff',
                color: '#333',
            });
            return;
        }
        if (newTodo.length > 100) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'O texto da tarefa deve ter no máximo 100 caracteres.',
                confirmButtonText: 'Ok',
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    content: 'custom-content',
                    confirmButton: 'custom-button'
                },
                background: '#e7f1ff',
                color: '#333',
            });
            return;
        }


        try {
            const task = { name: newTodo, isComplete: false, createdAt: new Date(), updatedAt: new Date() };
            const addedTodo = await addTodo(task);
            setTodos([...todos, addedTodo]);
            setNewTodo('');
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
        }
    };

    const handleEdit = (todo) => {
        setEditingId(todo.id);
        setEditingName(todo.name);
        setTimeout(() => {
            inputRef.current.focus();
        }, 0);
    };

    const handleBlur = async (id) => {
        if (editingName.trim() === '') {
            setEditingId(null);
            return;
        }

        try {
            const updatedTodo = { ...todos.find(todo => todo.id === id), name: editingName, updatedAt: new Date() };
            await updateTodo(id, updatedTodo);
            setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
        } catch (error) {
            console.error("Erro ao editar tarefa:", error);
        }

        setEditingId(null);
    };

    const handleToggleComplete = async (id) => {
        const todoToUpdate = todos.find(todo => todo.id === id);
        const updatedTodo = { ...todoToUpdate, isComplete: !todoToUpdate.isComplete, updatedAt: new Date() };

        try {
            await updateTodo(id, updatedTodo);
            setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
        } catch (error) {
            console.error("Erro ao marcar tarefa como concluída:", error);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'newest' ? 'oldest' : 'newest');
    };

    const sortedTodos = [...todos].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    return (
        <div className='container'>
            <fieldset>
                <h1>Lista de Tarefas</h1>
                <div className="controls">
                    {}
                </div>

                <div className='todo-list'>
                    <form onSubmit={handleAddTodo}>
                        <input
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Adicione uma tarefa"
                        />
                        <button type="submit" className='submit'>
                            <img src={addIcon} alt="Add" />
                        </button>
                        <button type="button" onClick={toggleSortOrder} className='sort-button'>
                            <img src={order} alt="Ordenar" />
                        </button>
                    </form>

                    {sortedTodos.length > 0 ? (
                        sortedTodos.map(todo => (
                            <div key={todo.id} className='todo-item'>
                                {editingId !== todo.id ? (
                                    <>
                                        <input
                                            className="checkbox"
                                            type='checkbox'
                                            checked={todo.isComplete}
                                            onChange={() => handleToggleComplete(todo.id)}
                                        />
                                        <div className='todo-content'>
                                            <span className={todo.isComplete ? 'completed' : ''}>{todo.name}</span>
                                            <div className='todo-buttons'>
                                                <button className="edit-button" onClick={() => handleEdit(todo)}>
                                                    <img src={editIcon} alt="Editar" />
                                                </button>
                                                <button onClick={() => handleDelete(todo.id)}>
                                                    <img src={deleteIcon} alt="Deletar" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <input
                                        ref={inputRef}
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onBlur={() => handleBlur(todo.id)}
                                        autoFocus
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-tasks-message">A lista de tarefas está vazia.</p>
                    )}
                </div>
            </fieldset>
        </div>
    );
};

export default App;

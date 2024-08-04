import './App.css';
import { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import Header from './components/Header';

const url = "http://localhost:3000/products";

function App() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { data: items, httpConfig, loading, error } = useFetch(url);
  const [localItems, setLocalItems] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    if (items) {
      setLocalItems(items);
    }
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      title,
      desc,
      completed: false,
    };
    httpConfig(newProduct, "POST");
    setTitle("");
    setDesc("");
  };

  const handleRemove = (id) => {
    httpConfig(id, "DELETE");
  };

  const handleComplete = (id) => {
    const taskToUpdate = localItems.find(item => item.id === id);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    setLocalItems(prevItems => prevItems.map(item => item.id === id ? updatedTask : item));
    httpConfig(updatedTask, "PUT");
  };

  const handleEdit = (id) => {
    const taskToEdit = localItems.find(item => item.id === id);
    setEditTitle(taskToEdit.title);
    setEditDesc(taskToEdit.desc);
    setEditMode(id);
  };

  const handleUpdate = (id) => {
    const updatedTask = { title: editTitle, desc: editDesc, completed: localItems.find(item => item.id === id).completed };
    setLocalItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updatedTask } : item));
    httpConfig({ ...updatedTask, id }, "PUT");
    setEditMode(null);
  };

  return (
    <div className="App">
      <Header title="Lista de Tarefas" />
      {loading && <p>Carregando dados...</p>}
      {error && <p>{error}</p>}
      {localItems && localItems.map((list) => (
        <ul key={list.id}>
          <li className={`task-list ${list.completed ? 'completed-task' : ''}`}>
            {editMode === list.id ? (
              <>
                <labe className="editLabel">
                  Alterar Titulo:
                <input className='editInput' type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </labe>
                <label className="editLabel">
                  ALterar Descrição
                <input className='editInput' type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                </label>
                <button className='buttonCreate' onClick={() => handleUpdate(list.id)}>Salvar</button>
              </>
            ) : (
              <>
                <h1>{list.title}</h1>
                <p>{list.desc}</p>
                <button className="buttonConcluir" onClick={() => handleComplete(list.id)}>
                  {list.completed ? 'Desmarcar' : 'Concluir'}
                </button>
                <button className="buttonDelete" onClick={() => handleRemove(list.id)}>Deletar</button>
                <button className='buttonEdit' onClick={() => handleEdit(list.id)}>Editar</button>
              </>
            )}
          </li>
        </ul>
      ))}

      <div className="add-product">
        <h1>Adicione Sua Tarefa</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nome da Tarefa:
            <input type="text" name="name" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Descrição da Tarefa:
            <input type="text" name="desc" value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </label>
          {loading ? <input type="submit" value="Aguarde..." /> : <input className='buttonCreate' type="submit" value="Criar" />}
        </form>
      </div>
    </div>
  );
}

export default App;

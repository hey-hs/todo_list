import React, { useState } from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const TaskItem = ({ task, listId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState(task.priority);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "todos", task.id));
      alert("Task deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "todos", task.id), {
        title,
        description,
        dueDate,
        priority,
      });
      setIsEditing(false);
      alert("Task updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="w-full p-4 mb-2 bg-gray-100 rounded-lg">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={handleUpdate}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Update Task
          </button>
        </div>
      ) : (
        <div>
          <h4 className="text-lg font-bold">{task.title}</h4>
          <p>{task.description}</p>
          <p>Due: {task.dueDate}</p>
          <p>Priority: {task.priority}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="max-w-full bg-yellow-500 text-white p-2 rounded mt-2"
          >
            Edit ✏️  
          </button>
          <button
            onClick={handleDelete}
            className="max-w-full bg-red-500 ml-2 text-white p-2 rounded mt-2"
          >
            Delete 🗑
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;

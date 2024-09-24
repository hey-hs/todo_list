import { useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, collection, onSnapshot, query, where, doc, deleteDoc } from "firebase/firestore"; // Add deleteDoc
import TaskList from "./TaskList";
import LogoutButton from "./LogoutButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const CreateToDo = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Set Priority");
  const [tasks, setTasks] = useState([]);
  const [listId, setListId] = useState("");
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  // Fetch the user's lists
  useEffect(() => {
    if (user) {
      const listQuery = query(collection(db, "lists"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(listQuery, (snapshot) => {
        const listArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(listArray);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Fetch tasks for the selected list
  useEffect(() => {
    if (user && listId) {
      const taskQuery = query(
        collection(db, "todos"),
        where("uid", "==", user.uid),
        where("listId", "==", listId)
      );
      const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
        const taskArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskArray);
      });
      return () => unsubscribe();
    }
  }, [user, listId]);

  // Function to handle adding a new task
  const handleSubmit = async () => {
    if (!listId) {
      alert("Please select a list.");
      return;
    }
    try {
      await addDoc(collection(db, "todos"), {
        title,
        description,
        dueDate,
        priority,
        listId,
        uid: user.uid,
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Set Priority");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Function to handle creating a new list
  const createNewList = async () => {
    if (!newListName.trim()) {
      alert("Please enter a list name.");
      return;
    }
    try {
      await addDoc(collection(db, "lists"), {
        title: newListName,
        uid: user.uid,
      });
      setNewListName("");
      alert("List created!")
    } catch (error) {
      console.error("Error creating list: ", error);
    }
  };

  // Function to delete a list
  const deleteList = async (listId) => {
    if (!listId) return;
    try {
      await deleteDoc(doc(db, "lists", listId));
      setListId(""); // Clear selection after deletion
      setTasks([]);   // Clear tasks associated with that list
    } catch (error) {
      console.error("Error deleting list: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create To-Do</h2>
      <LogoutButton />

      {/* Create a New List */}
      <div className="mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New List Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={createNewList} className="max-w-full bg-green-500 text-white p-2 rounded">
          Create New List
        </button>
      </div>

      {/* Select a List */}
      <select
        value={listId}
        onChange={(e) => setListId(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select a List</option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.title}
          </option>
        ))}
      </select>

      {/* Delete Selected List */}
      <button
        onClick={() => deleteList(listId)}
        className="max-w-full bg-red-500 text-white p-2 rounded mb-4"
        disabled={!listId}
      >
        Delete Selected List
      </button>

      {/* Form to create a new task */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="Set Priority">Set Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-500 text-white p-2 rounded"
      >
        Add Task
      </button>

      {/* TaskList component to display tasks */}
      <div className="mt-6">
        <h3 className="font-bold dark:black mb-4">Your Tasks</h3>
        <TaskList tasks={tasks} setTasks={setTasks} lists={lists} />
      </div>
    </div>
  );
};

export default CreateToDo;

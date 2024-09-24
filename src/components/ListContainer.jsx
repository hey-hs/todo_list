import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import TaskList from "./TaskList";
import { useAuthState } from "react-firebase-hooks/auth";
import { DragDropContext } from "@hello-pangea/dnd";
import { auth } from "../firebase";

const ListContainer = () => {
  const [user] = useAuthState(auth); // Get the logged-in user
  const [lists, setLists] = useState([]); // Store lists
  const [tasks, setTasks] = useState({}); // Store tasks keyed by listId

  // Fetch user's lists from Firestore
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "lists"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const listData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(listData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Fetch tasks for all lists from Firestore
  useEffect(() => {
    if (user && lists.length > 0) {
      const unsubscribes = lists.map((list) => {
        const q = query(
          collection(db, "todos"),
          where("uid", "==", user.uid),
          where("listId", "==", list.id)
        );
        return onSnapshot(q, (snapshot) => {
          const taskData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks((prevTasks) => ({
            ...prevTasks,
            [list.id]: taskData,
          }));
        });
      });

      // Unsubscribe from all listeners
      return () => unsubscribes.forEach((unsub) => unsub());
    }
  }, [user, lists]);

  // Handle drag and drop between lists
  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // If dropped outside a droppable area

    // Same list drag-and-drop
    if (source.droppableId === destination.droppableId) {
      const reorderedTasks = Array.from(tasks[source.droppableId]);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: reorderedTasks,
      }));
    } else {
      // Dragging between different lists
      const sourceTasks = Array.from(tasks[source.droppableId]);
      const destinationTasks = Array.from(tasks[destination.droppableId]);

      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.listId = destination.droppableId; // Update listId to new list

      destinationTasks.splice(destination.index, 0, movedTask);

      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      }));

      // Update Firestore to reflect the list change
      const taskRef = doc(db, "todos", draggableId);
      await updateDoc(taskRef, { listId: destination.droppableId });
    }
  };

  const handleAddList = async () => {
    const title = prompt("Enter list name:");
    if (title) {
      await addDoc(collection(db, "lists"), {
        title,
        uid: user.uid,
      });
    }
  };

  return (
    <div>
      <button onClick={handleAddList} className="bg-blue-500 text-white p-2 rounded">
        Add List
      </button>
      <div className="flex space-x-4 mt-4">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {lists.map((list) => (
            <TaskList
              key={list.id}
              listId={list.id}
              title={list.title}
              tasks={tasks[list.id] || []}
              setTasks={setTasks}
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default ListContainer;

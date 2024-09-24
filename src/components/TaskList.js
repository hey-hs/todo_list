import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import { db } from "../firebase";
import { doc, updateDoc, query, collection, where, onSnapshot } from "firebase/firestore";

const TaskList = ({ tasks, lists, setTasks }) => {

  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or the task was dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Find the task that was moved
    const draggedTask = tasks.find(task => task.id === draggableId);

    // If the task is moved to a different list, update its listId
    if (destination.droppableId !== source.droppableId) {
      const newListId = destination.droppableId;
      try {
        const taskRef = doc(db, "todos", draggedTask.id);
        await updateDoc(taskRef, { listId: newListId });
      } catch (error) {
        console.error("Error updating task listId: ", error);
        return;
      }
    }

    // Reorder the tasks
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);
    setTasks(reorderedTasks);

    // Update task order in Firestore
    try {
      await Promise.all(
        reorderedTasks.map((task, index) => {
          const taskRef = doc(db, "todos", task.id);
          return updateDoc(taskRef, { order: index });
        })
      );
    } catch (error) {
      console.error("Error updating task order: ", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {lists.map((list) => (
        <Droppable droppableId={list.id} key={list.id}>
          {(provided, snapshot) => (
            <div className="mb-6">
              <h3 className="text-2xl font-bold dark:black text-lg font-bold">{list.title}</h3>
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {tasks
                  .filter(task => task.listId === list.id)
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-white shadow-lg rounded-lg"
                        >
                          <TaskItem task={task} />
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default TaskList;

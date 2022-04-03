import { Task } from "./Task";
import React from "react";
import { TaskPriorities, TaskStatuses } from "../../../../api/todolists-api";
import { action } from "@storybook/addon-actions";

export default {
  title: "Task",
  component: Task,
};

const removeTaskCallback = action("Remove task")
const changeTaskTitle = action("Change task title")
const changeTaskStatus = action("Change task status")

export const TaskBaseExample = () => {
  return (
    <>
      <Task
        task={{
          id: "1",
          status: TaskStatuses.New,
          title: "CSS",
          entityStatus: "idle",
          order: 0,
          description: "",
          todoListId: "1",
          deadline: "",
          addedDate: "",
          priority: TaskPriorities.Low,
          startDate: "",
        }}
        entityStatus={"idle"}
        todolistId={"1"}
        removeTask={removeTaskCallback}
        changeTaskTitle={changeTaskTitle}
        changeTaskStatus={changeTaskStatus}
      />
      <Task
        task={{
          id: "2",
          status: TaskStatuses.Completed,
          title: "JS",
          entityStatus: "loading",
          order: 0,
          description: "",
          todoListId: "1",
          deadline: "",
          addedDate: "",
          priority: TaskPriorities.Low,
          startDate: "",
        }}
        entityStatus={"loading"}
        todolistId={"1"}
        removeTask={removeTaskCallback}
        changeTaskTitle={changeTaskTitle}
        changeTaskStatus={changeTaskStatus}
      />
    </>
  );
};

import React from 'react';

const TodoList: React.FC = () => {
  const todos = [
    {
      id: 't1',
      text: '운동하기',
    },
  ];
  return (
    <ul>
      {todos.map(todo => {
        return <li key={todo.id}>{todo.text}</li>;
      })}
    </ul>
  );
};

export default TodoList;

import React from 'react';

interface TodoListProps {
  items: { id: string; text: string }[];
}

function TodoList({ items }: TodoListProps) {
  return (
    <ul>
      {items.map(todo => {
        return <li key={todo.id}>{todo.text}</li>;
      })}
    </ul>
  );
}

export default TodoList;

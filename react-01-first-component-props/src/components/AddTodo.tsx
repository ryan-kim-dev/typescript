import React, { useRef } from 'react';

type NewTodoProps = {
  onAddTodo: (todoText: string) => void;
};

const AddTodo: React.FC<NewTodoProps> = props => {
  const textInputRef = useRef<HTMLInputElement>(null);

  const todoOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredText = textInputRef.current!.value;
    props.onAddTodo(enteredText);
  };

  return (
    <form onSubmit={todoOnSubmit}>
      <div>
        <label htmlFor="todo-text">
          <input type="text" id="todo-text" ref={textInputRef} />
        </label>
      </div>
      <button type="submit">할 일 추가</button>
    </form>
  );
};

export default AddTodo;

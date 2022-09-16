let a = 'hello';
a = 123; // err: Type 'number' is not assignable to type 'string'.

// 타입 검사 기능과 컴파일 기능은 별개로 돌아간다.
// 타입에서 에러가 나도 자바스크립트로 컴파일은 된다.

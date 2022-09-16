// * 1. 변수 타입 선언
const str: string = '4';
// 자료형 뿐만 아니라 원시값 자체를 타입으로 지정해 주어 상수로 변하지 않아야 할 값을 확인 가능.
const str1: '2' = '2';

const z: boolean = true;

// * 2. 함수 타입 선언
// 함수 선언문
// 리턴값의 타입 지정은 매개변수 소괄호 뒷쪽에 넣는다!
function divider(x: number, y: number): number {
  return x / y;
}

// 함수 표현식

// 화살표함수
// 화살표함수의 리턴값 타입 지정은
// 매개변수 소괄호 뒤에 => 다음 타입지정. 그리고 = 뒤부터 일반적인 화살표함수의 형태로.
const add: (x: number, y: number) => number = (x, y) => x + y;

// * Type alias (타입 별칭 지정)
// 화살표함수 예시
// type <타입 별칭 이름> = (매개변수 타입지정) => 리턴값 타입지정
type Add = (x: number, y: number) => number;
const adder: Add = (x, y) => x + y;

// * 3. 객체 타입 선언
// 배열
const arr1: string[] = ['123', '4'];
const arr2: boolean[] = [true, false];
const arr3: Array<number> = [1, 2]; // generic - 추후 설명

// * 4. 튜플
// 튜플이란 미리 지정한 자료형에 맞게 미리 지정한 길이만큼만을 요소로 가지는 배열과 같다.
const tuple: [number, string, boolean, null] = [1, '2', true, null];

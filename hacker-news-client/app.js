// * 1. AJAX 요청
const ajax = new XMLHttpRequest();

// 1.1 데이터 가져오기
// api 요청 주소, 페이지 번호 등의 값은 바뀔 가능성이 있기 때문에 변수로 빼둔다
const INDEX = 1;
const NEWS_URL = `https://api.hnpwa.com/v0/news/${INDEX}.json`;
ajax.open('GET', NEWS_URL, false);
ajax.send(); // send 까지 해야 가져온다

// 1.2 응답으로 받은 JSON데이터를 JS로 변환
const newsFeed = JSON.parse(ajax.response);

// * 2. 가져온 데이터 UI에 표시
const $root = document.querySelector('#root');
const ul = document.createElement('ul');
$root.appendChild(ul);

// TODO: map 메서드 사용 시 왜 요소 사이에 , 이 들어가는지?
// newsFeed.map((article) => {
//   li.textContent = article.title;
//   return ul.appendChild(li);
// });

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement('li');
  li.textContent = newsFeed[i].title;
  ul.appendChild(li);
}

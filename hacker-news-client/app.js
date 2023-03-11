const container = document.querySelector('#root');
const content = document.createElement('div');

// * 1. AJAX 요청
const ajax = new XMLHttpRequest();

// 1.1 데이터 가져오기
// api 요청 주소, 페이지 번호 등의 값은 바뀔 가능성이 있기 때문에 변수로 빼둔다
const INDEX = 1;
const NEWS_URL = `https://api.hnpwa.com/v0/news/${INDEX}.json`;
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

ajax.open('GET', NEWS_URL, false);
ajax.send(); // send 까지 해야 가져온다

// 1.2 응답으로 받은 JSON데이터를 JS로 변환
const newsFeed = JSON.parse(ajax.response);

// * 2. 가져온 데이터 UI에 표시
const ul = document.createElement('ul');

// * 3. hashChange 이벤트 감지
window.addEventListener('hashchange', function () {
  // 특정 글의 id 받아오기
  // location 객체는 주소와 관련된 다양한 정보를 제공한다.
  const contentId = location.hash.substr(1); // # 제거를 위해 substr
  // 특정 게시글로 라우팅
  ajax.open('GET', CONTENT_URL.replace('@id', contentId), false);
  ajax.send();
  // 특정 게시글 내용 받아오기
  const newsContent = JSON.parse(ajax.response);
  // 화면에 표시
  const title = document.createElement('h1');
  title.textContent = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.href = `#${newsFeed[i].id}`;
  a.textContent = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);

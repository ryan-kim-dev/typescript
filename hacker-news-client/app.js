const container = document.querySelector('#root');
const content = document.createElement('div');

// * 1. AJAX 요청
const ajax = new XMLHttpRequest();

// api 요청 주소, 페이지 번호 등의 값은 바뀔 가능성이 있기 때문에 변수로 빼둔다
const INDEX = 1;
const NEWS_URL = `https://api.hnpwa.com/v0/news/${INDEX}.json`;
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

// 1.1 데이터 가져오기
function getData(url) {
  ajax.open('GET', url, false);
  ajax.send(); // send 까지 해야 가져온다

  return JSON.parse(ajax.response);
}

// * 2. 가져온 데이터 UI에 표시
const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

// * 3. hashChange 이벤트 감지
window.addEventListener('hashchange', function () {
  // 특정 글의 id 받아오기
  // location 객체는 주소와 관련된 다양한 정보를 제공한다.
  const contentId = location.hash.substr(1); // # 제거를 위해 substr

  // 특정 게시글 내용 받아오기
  const newsContent = getData(CONTENT_URL.replace('@id', contentId));

  // 화면에 표시
  const title = document.createElement('h1');
  title.textContent = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < newsFeed.length; i++) {
  // 마크업 계층구조 확인의 용이성을 위해 DOM API(ex: createElement) 사용을 최대한 자제하도록 수정한 예시
  const div = document.createElement('div'); // innerHTML로 li, a 태그를 끼워넣기 위한 임시 div

  div.innerHTML = `
  <li>
    <a href="#${newsFeed[i].id}">
    ${newsFeed[i].title} (${newsFeed[i].comments_count}
    </a>
  </li>
  `;

  // ul의 자식으로 li만 존재하도록 불필요한 li를 감싼 div 대신 내부의 li만 선택
  ul.appendChild(div.firstElementChild); // ul.appendChildren[0] 과 동일
}

container.appendChild(ul);
container.appendChild(content);

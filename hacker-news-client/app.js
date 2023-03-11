const container = document.querySelector('#root');

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
function renderNewsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];
  newsList.push('<ul>');

  for (let i = 0; i < newsFeed.length; i++) {
    newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count}
      </a>
    </li>
    `);
  }

  newsList.push('</ul>');

  container.innerHTML = newsList.join('');
}

function renderNewsDetail() {
  // 특정 글의 id 받아오기 - location 객체는 주소와 관련된 다양한 정보를 제공한다.
  const contentId = location.hash.substr(1); // # 제거를 위해 substr

  // 특정 게시글 내용 받아오기
  const newsContent = getData(CONTENT_URL.replace('@id', contentId));

  // SPA처럼 선택한 글만 화면에 보여지도록 리팩토링
  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  
  <div>
  <a href="#">목록으로</a>
  </div>
  `;
}

// * 3. 라우터
function router() {
  const routePath = location.hash;
  if (!routePath) return renderNewsFeed(); // 최초 렌더링 시에는 전체 목록 화면으로

  return renderNewsDetail();
}
window.addEventListener('hashchange', router);
router();

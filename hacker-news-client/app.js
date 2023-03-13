const container = document.querySelector('#root');

// * 1. AJAX 요청
const ajax = new XMLHttpRequest();

// api 요청 주소, 페이지 번호 등의 값은 바뀔 가능성이 있기 때문에 변수로 빼둔다
const NEWS_URL = `https://api.hnpwa.com/v0/news/1.json`;
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

// * 페이지네이션
// 필요한 변수: 현재 페이지(변하니 상수x), 전체 페이지
// 변수의 사용처: 글 목록 화면, 단건 게시글(목록으로 클릭 시 이전 페이지의 목록을 기억해야 함)
// 따라서 여러 페이지에서 변수에 접근 가능해야 함으로(공유 자원) 전역에 선언
const store = {
  currentPage: 1,
};

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
  // UI 템플릿 만들기
  let template = `
    <div class="container mx-auto p-4">
      <h1>Hacker News</h1>
      <ul>
        {{__news_feed__}}
      </ul>
      <div>
        <a href="#/page/{{__prev_page__}}">이전 페이지</a>
        <a href="#/page/{{__next_page__}}">다음 페이지</a>
      </div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 한 페이지에 10개의 글이 보이도록 페이지네이션. 따라서 한 페이지의 단위가 10이므로 * 10
    // store.currentPage의 초기값이 1이므로 -1해서 현재 페이지값을 인덱스와 일치시킴
    newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count}
      </a>
    </li>
    `);
  }
  // 템플릿 안에 데이터가 들어갈 곳으로 마킹해둔 부분을 실제 받아온 데이터로 교체
  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace(
    '{{__prev_page__}}',
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  template = template.replace(
    '{{__next_page__}}',
    store.currentPage * 10 < newsFeed.length
      ? store.currentPage + 1
      : Math.floor(newsFeed.length / 10)
  );

  container.innerHTML = template;
}

function renderNewsDetail() {
  // 특정 글의 id 받아오기 - location 객체는 주소와 관련된 다양한 정보를 제공한다.
  const contentId = location.hash.substr(7); // 단건 게시글의 아이디만 받도록 subStr

  // 특정 게시글 내용 받아오기
  const newsContent = getData(CONTENT_URL.replace('@id', contentId));

  // SPA처럼 선택한 글만 화면에 보여지도록 리팩토링
  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  
  <div>
  <a href="#/page/${store.currentPage}">목록으로</a>
  </div>
  `;
}

// * 3. 라우터
function router() {
  const routePath = location.hash;
  if (!routePath) {
    return renderNewsFeed(); // 최초 렌더링 시에는 전체 목록 화면으로
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7)); // '#/page/<현재페이지>' 라 7번째만 subStr
    return renderNewsFeed();
  } else {
    return renderNewsDetail();
  }
}
window.addEventListener('hashchange', router);
router();

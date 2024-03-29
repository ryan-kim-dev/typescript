interface Store {
  currentPage: number;
  feeds: NewsFeed[]; // NewsFeed 객체 타입만 배열의 요소로
}

/** NewsFeed, NewsDetail, NewsComment 타입들의 중복 제거를 위한 중복 요소들만 가진 타입 정의 */
interface News {
  readonly id: number;
  readonly time: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
  readonly type: string;
}

/** 전체 글 목록 배열의 각 요소인 객체의 타입 */
interface NewsFeed extends News {
  readonly points: number;
  readonly comments_count: number;
  read?: boolean; // optional
}

/** 각 게시글 하나의 데이터 타입 */
interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

/** 게시글에 달린 댓글의 타입 */
interface NewsComment extends News {
  readonly comments: NewsComment[]; // 대댓글의 배열
  readonly comments_count: number;
  readonly level: number; // 대댓글의 뎁스
}

const container: HTMLElement | null = document.getElementById('root');

// * 1. AJAX 요청
const ajax: XMLHttpRequest = new XMLHttpRequest();

// api 요청 주소, 페이지 번호 등의 값은 바뀔 가능성이 있기 때문에 변수로 빼둔다
const NEWS_URL = `https://api.hnpwa.com/v0/news/1.json`;
const CONTENT_URL = `https://api.hnpwa.com/v0/item/@id.json`;

// * 페이지네이션
// 필요한 변수: 현재 페이지(변하니 상수x), 전체 페이지
// 변수의 사용처: 글 목록 화면, 단건 게시글(목록으로 클릭 시 이전 페이지의 목록을 기억해야 함)
// 따라서 여러 페이지에서 변수에 접근 가능해야 함으로(공유 자원) 전역에 선언

const store: Store = {
  currentPage: 1, // 현재 페이지
  feeds: [], // 읽음 여부의 상태값
};

function applyApiMixins(targetClass: any, baseClasses: any[]): void {
  baseClasses.forEach((baseClass) => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseClass.prototype,
        name
      );

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

// 클래스는 최초에 초기화되는 과정이 필요하므로 초기화를 위해 생성자 함수(constructor) 사용
class Api {
  // url: string;
  // ajax: XMLHttpRequest;

  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(NEWS_URL);
  }
}
class NewsDetailApi {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace('@id', id));
  }
}

interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open('GET', url, false);
  ajax.send(); // send 까지 해야 가져온다

  return JSON.parse(ajax.response);
}

// 글 목록 데이터에 읽음 여부 상태값을 추가해주기 위한 함수
function makeFeeds(feeds: NewsFeed[]) {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function updateView(html: string): void {
  if (container) {
    container.innerHTML = html;
  } else {
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다');
  }
}

// * 2. 가져온 데이터 UI에 표시
function renderNewsFeed() {
  const api = new NewsFeedApi();
  // UI 템플릿 만들기
  let template = `
  <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
        <div class="items-center justify-end">
          <a href="#/page/{{__prev_page__}}" class="text-gray-500">
            Previous
          </a>
          <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
            Next
          </a>
        </div>
      </div> 
    </div>
  </div>
  <div class="p-4 text-2xl text-gray-700">
    {{__news_feed__}}        
  </div>
</div>
  `;

  // * 읽음 여부의 상태 구현
  // 최초 렌더링 시 store.feeds는 []이므로 한번만 getData로 글 목록 받아오도록 한다
  // 받아온 글 목록에 읽음 여부의 상태값을 추가해주기 위해 makeFeeds 호출 시 getData()를 인수로 사용
  const newsList = [];
  let newsFeed: NewsFeed[] = store.feeds;
  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(api.getData());
  }

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // 한 페이지에 10개의 글이 보이도록 페이지네이션. 따라서 한 페이지의 단위가 10이므로 * 10
    // store.currentPage의 초기값이 1이므로 -1해서 현재 페이지값을 인덱스와 일치시킴
    newsList.push(`
    <div class="p-6 ${
      newsFeed[i].read ? 'bg-gray-500' : 'bg-white'
    } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
    <div class="flex">
      <div class="flex-auto">
        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
      </div>
      <div class="text-center text-sm">
        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${
          newsFeed[i].comments_count
        }</div>
      </div>
    </div>
    <div class="flex mt-3">
      <div class="grid grid-cols-3 text-sm text-gray-500">
        <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
        <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
        <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
      </div>  
    </div>
  </div>  
    `);
  }
  // 템플릿 안에 데이터가 들어갈 곳으로 마킹해둔 부분을 실제 받아온 데이터로 교체
  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace(
    '{{__prev_page__}}',
    String(store.currentPage > 1 ? store.currentPage - 1 : 1)
  );
  template = template.replace(
    '{{__next_page__}}',
    String(
      store.currentPage * 10 < newsFeed.length
        ? store.currentPage + 1
        : Math.floor(newsFeed.length / 10)
    )
  );

  updateView(template);
}

function renderNewsDetail() {
  // 특정 글의 id 받아오기 - location 객체는 주소와 관련된 다양한 정보를 제공한다.
  const contentId = location.hash.substr(7); // 단건 게시글의 아이디만 받도록 subStr
  const api = new NewsDetailApi();
  // 특정 게시글 내용 받아오기
  const newsDetail: NewsDetail = api.getData(contentId);
  // ui 템플릿
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsDetail.title}</h2>
        <div class="text-gray-400">
          ${newsDetail.content}
        </div>
      
        {{__comments__}}

      </div>
    </div>
  `;

  for (let i = 0; i < store.feeds.length; i++) {
    if (Number(contentId) === store.feeds[i].id) {
      store.feeds[i].read = true;
      break; // for문만 탈출하려면 break로 나간다. return은 실행중인 함수 전체를 빠져나간다
    }
  }

  // SPA처럼 선택한 글만 화면에 보여지도록 리팩토링
  // updateView 함수를 정의, 사용하여 innerHTML에 template을 할당하는 중복 코드 제거
  updateView(
    template.replace('{{__comments__}}', makeComment(newsDetail.comments))
  );
}

// 중첩된 대댓글 ui 구현을 위한 함수 - 재귀 사용
function makeComment(comments: NewsComment[]): string {
  // comments: 객체를 요소로 갖는 배열, called: 재귀 호출 횟수를 세는 초기값 0의 변수
  // comments 배열의 각 요소인 객체는 또 다시 대댓글 목록인 동일한 모양의 comments 배열을 프로퍼티로 가짐
  const commentString = [];

  for (let i = 0; i < comments.length; i++) {
    const comment: NewsComment = comments[i];

    commentString.push(`
    <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>
  `);

    if (comment.comments.length > 0) {
      // 대댓글이 있으면 재귀 호출 시 두번쨰 인수로 호출횟수를 1 증가시킨다
      commentString.push(makeComment(comment.comments));
    }
  }

  // 재귀 호출의 탈출 조건 - 대댓글이 더이상 없으면 마지막 대댓글내용을 추가하고 리턴
  return commentString.join('');
}

// * 3. 라우터
function router(): void {
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

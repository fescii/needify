export default class PostFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._isFirstLoad = true;
    this._block = false;
    this._empty = false;
    this._kind = this.getAttribute('kind');
    this._page = this.parseToNumber(this.getAttribute('page'));
    this._url = this.getAttribute('url');

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const feedContainer = this.shadowObj.querySelector('.stories');

    // check if the total
    if (feedContainer) {
      this.fetchFeeds(feedContainer);
    }
  }

  activateRefresh = () => {
    const finish = this.shadowObj.querySelector('.finish');
    if (finish) {
      const btn = finish.querySelector('button.finish');
      btn.addEventListener('click', () => {
        // unblock the fetching
        this._block = false;
        this._empty = false;
        
        // re fetch the content
        const feedContainer = this.shadowObj.querySelector('div.stories');

        // remove the finish message
        finish.remove();

        // set the loader
        feedContainer.insertAdjacentHTML('beforeend', this.getLoader());

        setTimeout(() => {
          this.fetchFeeds(feedContainer);
        }, 1000);
      });
    }
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  fetching = async (url, feedContainer) => {
    // Remove the scroll event
    this.removeScrollEvent();
    const outerThis = this;

    try {
      const response = await this.fetchWithTimeout(url, { method: "GET" })
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        if (outerThis._page === 1 && data.length === 0) {
          outerThis._empty = true;
          outerThis._block = true;

          if (this._kind === "search") {
            outerThis.populateFeeds(outerThis.getEmptySearchMsg(), feedContainer)
          } else {
            outerThis.populateFeeds(outerThis.getEmptyMsg(), feedContainer);
          }
        }
        else if (data.length < 10) {
          outerThis._empty = true;
          outerThis._block = true;
          const content = outerThis.mapFeeds(data);
          outerThis.populateFeeds(content, feedContainer);
          if (this._kind  === "search") {
            outerThis.populateFeeds(outerThis.getLastSearchMessage(), feedContainer);
          } else {
            outerThis.populateFeeds(outerThis.getLastMessage(), feedContainer) 
          }
        }
        else {
          outerThis._empty = false;
          outerThis._block = false;

          const content = outerThis.mapFeeds(data);
          outerThis.populateFeeds(content, feedContainer);
        }

        // Add scroll event
        outerThis.scrollEvent(feedContainer);
      }
      else {
        outerThis._empty = true;
        outerThis._block = true;
        if(this._kind === 'search') {
          outerThis.populateFeeds(outerThis.getWrongSearchMessage(), feedContainer);
        } else {
          outerThis.populateFeeds(outerThis.getWrongMessage(), feedContainer);
          // activate the refresh button
          outerThis.activateRefresh();
        }
      }
    } catch (error) {
      console.log(error)
      // console.log(error)
      outerThis._empty = true;
      outerThis._block = true;

      if(this._kind === 'search') {
        outerThis.populateFeeds(outerThis.getWrongSearchMessage(), feedContainer);
      } else {
        outerThis.populateFeeds(outerThis.getWrongMessage(), feedContainer);
        // activate the refresh button
        outerThis.activateRefresh();
      }
    }
  }

  fetchFeeds = feedContainer => {
    const outerThis = this;
    const url = this._kind === 'search' ? `${this._url}&page=${this._page}` : `${this._url}?page=${this._page}`;

    if (!this._block && !this._empty) {
      outerThis._empty = true;
      outerThis._block = true;
      // fetch the stories
      setTimeout(() => {
        outerThis.fetching(url, feedContainer)
      }, 2000);
    }
  }

  populateFeeds = (content, feedContainer) => {
    // get the loader and remove it
    const loader = feedContainer.querySelector('.loader-container');
    if (loader) {
      loader.remove();
    }

    // insert the content
    feedContainer.insertAdjacentHTML('beforeend', content);
  }

  scrollEvent = feedContainer => {
    const outerThis = this;
    window.addEventListener('scroll', function () {
      let margin = document.body.clientHeight - window.innerHeight - 150;
      if (window.scrollY > margin && !outerThis._empty && !outerThis._block) {
        outerThis._page += 1;
        outerThis.populateFeeds(outerThis.getLoader(), feedContainer);

        outerThis.fetchFeeds(feedContainer);
      }
    });

    // Launch scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  }

  removeScrollEvent = () => {
    window.removeEventListener('scroll', function () { });
  }

  mapFeeds = feeds => {
    return feeds.map(post => {
      const author = post.post_author;
      return /*html*/`
        <post-wrapper kind="${post.kind}" hash="${post.hash}" url="/r/${post.hash}" views="${post.views}" time="${post.createdAt}" name="${post.name}"
          user-hash="${author.hash}" you="${post.you}" user-url="/u/${author.hash}" location="${post.location}" price="${post.price}" user-email="${author.email}"
          user-picture="${author.picture}" user-verified="${author.verified}" user-name="${author.name}" user-followers="${author.followers}"
          user-following="${author.following}" user-follow="${author.is_following}" user-bio="${author.bio === null ? 'The user has no bio yet!' : author.bio}">
          ${post.content}
        </post-wrapper>
      `
    }).join('');
  }

  fetchWithTimeout = async (url, options = {}, timeout = 9500) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw new Error(`Network error: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  parseToNumber = num_str => {
    // Try parsing the string to an integer
    const num = parseInt(num_str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getLoader() {
    return /* html */`
      <div class="loader-container">
        <span id="btn-loader">
          <span class="loader-alt"></span>
        </span>
      </div>
    `
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="stories">
				${this.getLoader()}
      </div>
    `;
  }

  getEmptyMsg = () => {
    return /*html*/`
      <div class="empty">
        <h2 class="title">Feed is not available!</h2>
        <p class="next">
          There are no feeds available yet!. You can always come back later or refresh the page to check for new feeds.
        </p>
      </div>
    `
  }

  getEmptySearchMsg = () => {
    return /*html*/`
      <div class="empty">
        <h2 class="title">No results found! </h2>
        <p class="next">
          No results were found yet!. You can always come back later or user a different keyword.
        </p>
      </div>
    `
  }

  getLastMessage = () => {
    return /*html*/`
      <div class="last">
        <h2 class="title">That's all for now!</h2>
        <p class="next">
         That's it, you have exhausted our feeds for now. You can always come back later or refresh the page to check for new feeds.
        </p>
      </div>
    `
  }

  getLastSearchMessage = () => {
    return /*html*/`
      <div class="last">
        <h2 class="title">That's all for now!</h2>
        <p class="next">
         That's it, you have exhausted the search results. Try searching using a different keyword.
        </p>
      </div>
    `
  }

  getWrongSearchMessage = () => {
    return /* html */`
      <div class="finish">
        <h2 class="finish__title">Type in keyword!</h2>
        <p class="desc">
          You can search using any keyword in the search bar above.
        </p>
      </div>
    `;
  }

  getWrongMessage = () => {
    return /* html */`
      <div class="finish">
        <h2 class="finish__title">Oops!</h2>
        <p class="desc">
          An error occurred while fetching posts. Please check your are connected to the internet and try again.
        </p>
        <button class="finish">Retry</button>
      </div>
    `;
  }


  getStyles() {
    return /* css */`
      <style>
        *,
        *:after,
        *:before {
          box-sizing: border-box !important;
          font-family: inherit;
          -webkit-box-sizing: border-box !important;
        }

        *:focus {
          outline: inherit !important;
        }

        *::-webkit-scrollbar {
          width: 3px;
        }

        *::-webkit-scrollbar-track {
          background: var(--scroll-bar-background);
        }

        *::-webkit-scrollbar-thumb {
          width: 3px;
          background: var(--scroll-bar-linear);
          border-radius: 50px;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          padding: 0;
          margin: 0;
          font-family: inherit;
        }

        p,
        ul,
        ol {
          padding: 0;
          margin: 0;
        }

        a {
          text-decoration: none;
        }

        :host {
          font-size: 16px;
          width: 100%;
          padding: 0;
        }

        div.loader-container {
          position: relative;
          width: 100%;
          height: 150px;
          padding: 20px 0 0 0;
        }

        #btn-loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }

        #btn-loader > .loader-alt {
          width: 35px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        #btn-loader > .loader {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        .empty {
          width: 100%;
          padding: 10px 0 30px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .last {
          width: 100%;
          padding: 10px 0 30px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .last > h2,
        .empty > h2 {
          width: 100%;
          margin: 5px 0;
          text-align: start;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1.2rem;
        }

        .last p,
        .empty p {
          width: 100%;
          margin: 0;
          text-align: start;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          line-height: 1.4;
          font-size: 0.85rem;
        }

        .last p.next > .url,
        .empty  p.next > .url {
          background: var(--gray-background);
          color: var(--gray-color);
          padding: 2px 5px;
          font-size: 0.85rem;
          font-weight: 400;
          border-radius: 5px;
        }

        .last p.next > .warn,
        .empty  p.next .warn {
          color: var(--error-color);
          font-weight: 500;
          font-size: 0.9rem;
          background: var(--gray-background);
          padding: 2px 5px;
          border-radius: 5px;
        }

        div.stories {
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.finish {
          padding: 10px 0 40px;
          width: 100%;
          min-width: 100%;
          height: auto;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        div.finish > h2.finish__title {
          margin: 10px 0 0 0;
          font-size: 1rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
        }

        div.finish > p.desc {
          margin: 0;
          font-size: 0.85rem;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          line-height: 1.4;
          text-align: center;
        }

        div.finish > button.finish {
          border: none;
          background: var(--accent-linear);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          color: var(--white-color);
          margin: 10px 0 0;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 18px 8px;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        @media screen and (max-width:660px) {
          .last {
            width: 100%;
            padding: 10px 0 25px;
            border-bottom: var(--border);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .empty {
            width: 100%;
            padding: 10px 0 30px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          div.finish > button.finish {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}
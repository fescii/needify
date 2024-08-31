export default class AppSearch extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // get query
    this._query = this.getAttribute('query');

    //Get url in lowercase
    this._url = this.getAttribute('url').trim().toLowerCase();

    this._active = null;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.setTitle();

    this.render();
  }

  setQuery = () => {
    // Check if query q is in the url and update the query
    const url = new URL(window.location.href);
    const q = url.searchParams.get('q');

    if (q !== '' && q !== null && q !== 'null') {
      // update query
      this._query = q;
      this.setAttribute('query', q);
    }
    else {
      const query = this.getAttribute('query');

      if (query !== '' && query !== null && query !== 'null') {
        // update query
        this._query = query;
      }
      else {
        // update query
        this._query = null;
      }
    }
  }

  updateInput = form => {
    // update input value
    if(this._query) {
      form.querySelector('input').value = this._query;
      this.setKey(form);
    }
  }

  setTitle = () => {
    // update title of the document
    if (this._query) {
      document.title = `Search | ${this._query}`;
    }
    else {
      document.title = 'Search | Discover and connect with people, and people';
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.enableScroll();

    // request user to enable notifications
    this.checkNotificationPermission();

    // Activate 
    const contentContainer = this.shadowObj.querySelector('div.content-container');
    const form = this.shadowObj.querySelector('form.search');

    if (contentContainer && form) {
      this.activateForm(form, contentContainer);
      this.updateInput(form);

      const svgBtn = form.querySelector('svg');
      if(svgBtn){
        this.activateBackButton(svgBtn);
      }
    }

    // watch for mql changes
    const mql = window.matchMedia('(max-width: 660px)');

    this.watchMediaQuery(mql, contentContainer);
  }

  checkNotificationPermission = () => {
    const body = document.querySelector('body');
    if (window.notify && !window.notify.permission) {
      // request user to enable notifications
      const html =/*html*/`<notify-popup url="/notifications"></notify-popup>`;

      body.insertAdjacentHTML('beforeend', html);
    }
  }

  disconnectedCallback() {
    this.enableScroll()
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();

      const contentContainer = this.shadowObj.querySelector('div.content-container');
      const form = this.shadowObj.querySelector('form.search');
    
      if (contentContainer && form) {
        this.activateForm(form, contentContainer);
        this.updateInput(form);
      }
    });
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

  activateForm = (form, contentContainer) => {
    const outerThis = this;
    form.addEventListener('submit', e => {
      e.preventDefault();
      e.stopPropagation();

      const query = form.querySelector('input').value;

      if (query.trim() === '') {
        return;
      }

      // update query
      outerThis._query = query;

      // update query attribute
      outerThis.setAttribute('query', outerThis._query);

      // update title of the document
      document.title = `Search query -  ${query}`;

      // update url
      outerThis._url = `/search?q=${query}`;

      // update setKey
      outerThis.setKey(form);

      // update url attribute
      outerThis.setAttribute('url', outerThis._url);

      // set contentContainer
      contentContainer.innerHTML = outerThis.getContainer();
      // update title
      outerThis.setTitle();
    });
  }

  updateState = (state, contentContainer) => {
    // populate content
    contentContainer.innerHTML = state.content;
  }

  updateDefault = contentContainer => {
    contentContainer.innerHTML = this.getContainer();
  }

  selectCurrentFeed = () => {
    // Select the current feed
    return this.getPosts();
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  activateBackButton = btn => {
    btn.addEventListener('click', () => {
      // check window history is greater or equal to 1
      if (window.history.length >= 1) {
        // check if the history has state
        if (window.history.state) {
          // go back
          window.history.back();
        }
        else {
          // redirect to home
          window.location.href = '/home';
        }
      }
    });
  }


  setKey = form => {
    const key = this.shadowObj.querySelector('p.search > span.key');

    if (key) {
      if (this._query) {
        key.textContent = this._query;
      }
      else {
        key.parentElement.remove();
      }
    }
    else if (this._query) {
      const html = /* html */`<p class="search">Showing results for <span class="key">${this._query}</span></p>`;
    
      form.insertAdjacentHTML('afterend', html);
    }
    
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getForm()}
        ${this.getTab()}
        <div class="content-container">
          ${this.getContainer()}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getForm()}
          <div class="content-container">
            ${this.getContainer()}
          </div>
        </section>

        <section class="side">
        <people-container url="/api/v1/h/users"></people-container>
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getForm = () => {
    return /*html*/`
      <form action="" method="get" class="search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z"></path>
        </svg>
        <div class="contents">
          <input type="text" name="q" id="query" placeholder="What's your query?">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
      </form>
    `
  }

  getContainer = () => {
    return this.getPosts();
  }

  getPosts = () => {
    const posts = this.getAttribute('posts-url');
    return /*html*/`
      <post-feed page="1"
        url="${posts + '?q=' + this._query }" query="true"
        kind="search">
      </post-feed>
    `
  }


  getPeople = () => {
    const people = this.getAttribute('people-url');
    return /*html*/`
      <people-feed page="1"
        url="${people + '?q=' + this._query}" query="true"
        kind="search">
      </people-feed>
    `
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="">
      </info-container>
    `
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
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        section.main {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          width: 63%;
          min-height: 100vh;
        }

        p.search {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text);
          margin: 0 0 5px;
        }

        p.search > span.key {
          font-weight: 500;
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        p.search > span.key:before {
          content: open-quote;
          color: var(--gray-color);
          font-size: 1rem;
          line-height: 1;
        }

        p.search > span.key:after {
          content: close-quote;
          color: var(--gray-color);
          font-size: 1rem;
          line-height: 1;
        }

        form.search {
          background: var(--background);
          padding: 0;
          padding: 22px 0 10px;
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 5px;
          z-index: 6;
          width: 100%;
          position: sticky;
          top: 0;
        }

        form.search > svg {
          position: absolute;
          left: -12px;
          top: calc(50% - 15px);
          color: var(--text-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
        }

        form.search > svg:hover {
          color: var(--accent-color);
        }

        form.search > .contents {
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0;
          margin: 0 0 0 28px;
          width: calc(100% - 28px);
          position: relative;
        }

        form.search > .contents > input {
          border: var(--border-mobile);
          background-color: var(--background) !important;
          display: flex;
          flex-flow: row;
          align-items: center;
          font-family: var(--font-text);
          color: var(--highlight-color);
          font-size: 1rem;
          padding: 8px 10px 8px 35px;
          gap: 0;
          width: 100%;
          border-radius: 18px;
          -webkit-border-radius: 18px;
          -moz-border-radius: 18px;
          -ms-border-radius: 18px;
          -o-border-radius: 18px;
        }
        
        form.search > .contents > input:-webkit-autofill,
        form.search > .contents > input:-webkit-autofill:hover, 
        form.search > .contents > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--highlight-color) !important;
        }
        
        form.search > .contents > input:autofill {
          filter: none;
          color: var(--highlight-color) !important;
        }

        form.search > .contents > svg {
          position: absolute;
          height: 18px;
          color: var(--gray-color);
          width: 18px;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        form.search > .contents > button {
          position: absolute;
          right: 10px;
          top: calc(50% - 14px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          background: var(--accent-linear);
          height: 28px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        div.content-container {
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          flex-wrap: nowrap;
          gap: 15px;
          width: 100%;
        }

        section.side {
          padding: 25px 0;
          width: 33%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
          max-height: 100vh;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        section.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
          section.main {
            width: 58%;
          }

          section.side {
            width: 40%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            gap: 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          form.search {
            background: var(--background);
            padding: 0;
            padding: 10px 0 10px;
            display: flex;
            flex-flow: column;
            align-items: start;
            flex-wrap: nowrap;
            gap: 5px;
            z-index: 6;
            width: 100%;
            position: sticky;
            top: 0;
          }

          form.search > svg {
            position: absolute;
            left: -12px;
            top: calc(50% - 22px);
            color: var(--text-color);
            cursor: default !important;
            width: 42px;
            height: 42px;
          }

          form.search > .contents > input {
            padding: 10px 10px 10px 35px;
            width: 100%;
            border-radius: 18px;
            -webkit-border-radius: 18px;
            -moz-border-radius: 18px;
            -ms-border-radius: 18px;
            -o-border-radius: 18px;
          }

          .section.main {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          section.side {
            padding: 0;
            display: none;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}
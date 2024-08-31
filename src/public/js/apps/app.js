export default class AppHome extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.setTitle();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  setTitle = () => {
    // update title of the document
    document.title = 'Home | Bid for the services you need or products you want';
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // onpopstate event
    this.onPopEvent();

    // Watch for media query changes
    const mql = window.matchMedia('(max-width: 660px)');

    // fetch content
    const container = this.shadowObj.querySelector('.feeds');

    this.watchMediaQuery(mql);
  }

  disconnectedCallback() {
    this.enableScroll();
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();

      // call onpopstate event
      this.onPopEvent();
    });
  }

  onPopEvent = () => {
    const outerThis = this;
    // Update state on window.onpopstate
    window.onpopstate = event => {
      // This event will be triggered when the browser's back button is clicked

      if (event.state) {
        if (event.state.page) {
          outerThis.updatePage(event.state.content)
        }
      }
    }
  }

  updatePage = content => {
    // select body
    const body = document.querySelector('body');

    // populate content
    body.innerHTML = content;
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

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }
  
  fetchContent = container => {
    let intervalId;
  
    const fetchLogic = (getContentFunction) => {
      if (!window.home) return;
      const home = window.home;
      
      if (home.last === true) {
        clearInterval(intervalId);
        return;
      }
      
      if (home.loaded) {
        container.insertAdjacentHTML('beforeend', getContentFunction(home.next));
      }

      // set loaded to false
      window.home.loaded = false;
    };
  
    intervalId = setInterval(() => fetchLogic(this.getStepContent), 500);
  };

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        <div class="feeds">
          <add-container type="story"></add-container>
          <post-feed url="${this.getAttribute('feeds-url')}" page="1"></post-feed>
        <div>
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          ${this.getTop()}
          <add-container type="story"></add-container>
          <post-feed url="${this.getAttribute('feeds-url')}" page="1"></post-feed>
        </div>
        <div class="side">
          <people-container url="/api/v1/h/users"></people-container>
          ${this.getInfo()}
        </div>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Home" type="home"
        user-url="${this.getAttribute('url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
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

        .feeds {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }

        div.side {
          padding: 25px 0;
          margin: 0;
          background-color: transparent;
          width: 33%;
          height: max-content;
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

        div.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
         .feeds {
            width: 58%;
          }

          div.side {
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
          
					a {
						cursor: default !important;
          }

          .feeds {
            display: flex;
            flex-flow: column;
            gap: 0;
            padding: 0 0 50px 0;
            width: 100%;
          }

          div.side {
            padding: 0;
            margin: 0;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}
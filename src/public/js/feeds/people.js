export default class PeopleFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._block = false;
    this._empty = false;
    this._page = this.parseToNumber(this.getAttribute('page'));
    this._total = this.parseToNumber(this.getAttribute('total'));
		this._kind = this.getAttribute('kind');
    this._url = this.getAttribute('url');
    this._query = this.setQuery(this.getAttribute('query'));

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  setQuery = query => {
    return query && query !== "" && query === "true";
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const peopleContainer = this.shadowObj.querySelector('.people');

		// check total
		if (peopleContainer) {
      this.fetchPeople(peopleContainer);
      setTimeout(() => {
        this.scrollEvent(peopleContainer);
      }, 2000);     
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

  fetching = (url, peopleContainer) => {
    const outerThis = this;
    this.fetchWithTimeout(url, { method: "GET" }).then((response) => {
      response.json().then((result) => {
        if (result.success) {
          const data = result.data;
          if (data.last && outerThis._page === 1 && data.people.length === 0) {
            outerThis._empty = true;
            outerThis._block = true;
            outerThis.populatePeople(outerThis.getEmptyMsg(outerThis._kind), peopleContainer);
          } 
          else if (data.last && data.people.length < 10) {
            outerThis._empty = true;
            outerThis._block = true;
            const content = outerThis.mapFields(data.people);
            outerThis.populatePeople(content, peopleContainer);
            outerThis.populatePeople(
            outerThis.getLastMessage(outerThis._kind), peopleContainer);
          } 
          else {
            outerThis._empty = false;
            outerThis._block = false;
            
            const content = outerThis.mapFields(data.people);
            outerThis.populatePeople(content, peopleContainer);
            }
          }
          else {
            outerThis._empty = true;
            outerThis._block = true;
            outerThis.populatePeople(outerThis.getWrongMessage(outerThis._kind), peopleContainer);
          }
        })
        .catch((error) => {
          outerThis._empty = true;
          outerThis._block = true;
					// console.log(error)
          outerThis.populatePeople(outerThis.getWrongMessage(outerThis._kind), peopleContainer);
        });
    });
  }

  fetchPeople = peopleContainer => {
    const outerThis = this;
    const url = this._query ? `${this._url}&page=${this._page}` : `${this._url}?page=${this._page}`;

    if(!this._block && !this._empty) {
      outerThis._empty = true;
      outerThis._block = true;
      setTimeout(() => {
        // fetch the likes
        outerThis.fetching(url, peopleContainer)
      }, 1000);
    }
  }

  populatePeople = (content, peopleContainer) => {
    // get the loader and remove it
    const loader = peopleContainer.querySelector('.loader-container');
    if (loader){
      loader.remove();
    }

    // insert the content
    peopleContainer.insertAdjacentHTML('beforeend', content);
  }
  
  scrollEvent = peopleContainer => {
    const outerThis = this;
    window.addEventListener('scroll', function () {
      let margin = document.body.clientHeight - window.innerHeight - 150;
      if (window.scrollY > margin && !outerThis._empty && !outerThis._block) {
        outerThis._page += 1;
        outerThis.populatePeople(outerThis.getLoader(), peopleContainer);
        outerThis.fetchPeople(peopleContainer);
      }
    });

    // Launch scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  }

  mapFields = data => {
    return data.map(user => {
      return /*html*/`
				<user-wrapper hash="${user.hash}" you="${user.you}" url="/u/${user.hash}" needs="${user.needs}" 
          picture="${user.picture}" verified="${user.verified}" name="${user.name}" followers="${user.followers}" contact='${user.contact ? JSON.stringify(user.contact) : null}'
          following="${user.following}" user-follow="${user.is_following}" bio="${user.bio === null ? 'The author has no bio yet!': user.bio }">
				</user-wrapper>
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
			<div class="people">
				${this.getLoader()}
      </div>
    `;
  }

  getEmptyMsg = text => {
    switch (text) {
			case 'likes':
				return `
					<div class="empty">
						<h2 class="title">No Likes found!</h2>
						<p class="next">
							The post has no likes yet. You can be the first to like it or you can always come back later to check for new likes.
						</p>
					</div>
				`;
			case 'followers':
				return `
					<div class="empty">
						<h2 class="title">The author has no followers yet!</h2>
						<p class="next">
							The user has no followers yet. You can be the first to follow the author or you can always come back later to check for new followers.
						</p>
					</div>
				`
			case 'following':
				return `
					<div class="empty">
						<h2 class="title">The user is not following anyone yet!</h2>
						<p class="next">
							The user is not following anyone yet. You can always come back later to check.
						</p>
					</div>
				`
      case 'search':
				return `
					<div class="empty">
						<h2 class="title">No user found!</h2>
						<p class="next">
							The search keyword did not match any user, try searching using a different keyword.
						</p>
					</div>
				`
			default:
				return `
					<div class="empty">
						<h2 class="title">No data found!</h2>
						<p class="next">
							No data found. You can always come back later to check for new data.
						</p>
					</div>
				`
		}
  }

  getLastMessage = text => {
    switch (text) {
			case 'likes':
				return `
					<div class="last">
						<h2 class="title">No more likes!</h2>
						<p class="next">
							You have reached the end of people who liked this post. You can always come back later to check for new likes.
						</p>
					</div>
				`
			case 'followers':
				return `
					<div class="last">
						<h2 class="title">No more followers.</h2>
						<p class="next">
							You have reached the people who are following this user. You can always come back later to check for new followers.
						</p>
					</div>
				`
			case 'following':
				return `
					<div class="last">
						<h2 class="title">No more people.</h2>
						<p class="next">
							You have reached the end of the people who this user is following. You can always come back later to check for new people.
						</p>
					</div>
				`
      case 'search':
				return `
					<div class="last">
						<h2 class="title">The end of results</h2>
						<p class="next">
							You have reached the end of the people who matched the query. You can try searching using different keyword.
						</p>
					</div>
				`
			default:
				return `
					<div class="last">
						<h2 class="title">No more data.</h2>
						<p class="next">
							You have reached the end of the data. You can always come back later to check for new data.
						</p>
					</div>
				`
		}
  }

  getWrongMessage = () => {
    return `
      <div class="last">
        <h2 class="title">Something went wrong!</h2>
        <p class="next">
          Something did not work as expected, I call it shenanigans!
        </p>
      </div>
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
          padding: 10px 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .last > h2,
        .empty > h2 {
          width: 100%;
          margin: 2px 0;
          font-family: var(--font-text), sans-serif;
          text-align: start;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1rem;
          font-weight: 500;
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
          font-size: 0.95rem;
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

        div.people {
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        @media screen and (max-width:660px) {
          .last {
            width: 100%;
            padding: 10px 0 25px;
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

					.last > h2,
					.empty > h2 {
						width: 100%;
						margin: 2px 0;
						font-family: var(--font-text), sans-serif;
						text-align: start;
						color: var(--text-color);
						line-height: 1.4;
					}
        }
      </style>
    `;
  }
}
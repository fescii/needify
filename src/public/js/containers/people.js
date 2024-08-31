export default class PeopleContainer extends HTMLElement {
	constructor() {
		// We are not even going to touch this.
		super();

		this._url = this.getAttribute('url') || '/api/v1/h/users';

		// let's create our shadow root
		this.shadowObj = this.attachShadow({ mode: "open" });

		this.render();
	}

	render() {
		this.shadowObj.innerHTML = this.getTemplate();
	}

	connectedCallback() {
		const contentContainer = this.shadowObj.querySelector('div.content');

		this.fetchPeople(contentContainer);
	}

	fetchPeople = contentContainer => {
    const outerThis = this;
		const peopleLoader = this.shadowObj.querySelector('people-loader');
		setTimeout(() => {
      // fetch the user stats
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
  
      this.fetchWithTimeout(this._url, options)
        .then(response => {
          return response.json();
        })
        .then(data => {
          // check for success response
          if (data.success) {
            // update the content
            const content = outerThis.mapUsers(data.data);
            // remove the loader
            peopleLoader.remove();
            // insert the content
            contentContainer.insertAdjacentHTML('beforeend', content);
          }
          else {
            // display error message
            const content = outerThis.getEmpty();
            peopleLoader.remove();
            contentContainer.insertAdjacentHTML('beforeend', content);
          }
        })
        .catch(error => {
          // display error message
          const content = outerThis.getEmpty();
          peopleLoader.remove();
          contentContainer.insertAdjacentHTML('beforeend', content);
        });
		}, 2000)
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

	mapUsers = data => {
    return data.map(user => {
      return /*html*/`
				<user-wrapper hash="${user.hash}" you="${user.you}" url="/u/${user.hash}"
          picture="${user.picture}" verified="${user.verified}" name="${user.name}" followers="${user.followers}"
          following="${user.following}" user-follow="${user.is_following}" bio="${user.bio === null ? 'The author has no bio yet!': user.bio }">
				</user-wrapper>
      `
    }).join('');
  }

	getTemplate = () => {
		// Show HTML Here
		return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
	}

	getLoader = () => {
		return `
			<people-loader speed="300"></people-loader>
		`
	}

	getBody = () => {
		// language=HTML
		return /* html */`
			<div class="title">
				<h2>Authors to follow</h2>
			</div>
			<div class="content">
				${this.getLoader()}
			</div>
    `;
	}

  getEmpty = () => {
    return /* html */`
      <div class="empty">
        <p>No authors recommendation found at the moment.</p>
				<p> There might an issues, try refreshing the page or check back later.</p>
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
					margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 8px;
				}

				div.content {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 10px;
				  width: 100%;
				}

				div.empty {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 8px;
        }

        div.empty > p {
          width: 100%;
          padding: 0;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          font-weight: 400;
        }

				.title {
          display: flex;
					width: 100%;
          flex-flow: column;
					padding: 5px 10px 6px;
					margin: 0 0 7px 0;
          gap: 0;
					background: var(--light-linear);
					border-radius: 7px;
        }

        .title > h2 {
          font-size: 1.5rem;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          margin: 0;
          color: var(--text-color);
        }

        .title > p.info {
          margin: 0;
          font-size: 0.9rem;
          font-style: italic;
          font-weight: 400;
          font-family: var(--font-text), sans-serif;
          margin: 0;
          color: var(--text-color);
        }


				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 15px 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
	}
}
export default class FormContainer extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
   this.activateProductButton()
   this.activateServiceButton()
  }

  activateTopicButton = () => {
    // Get the topic button
    const topicButton = this.shadowObj.querySelector('.topic');
    // Add an event listener to the topic button
    topicButton.addEventListener('click', e => {
      e.preventDefault();
      // Get the body element
      const body = document.querySelector('body');
      // Get the content of the topic page
      const content = this.getTopic();

      // insert the content into the body
      body.insertAdjacentHTML('beforeend', content);
    });
  }

  activateProductButton = () => {
    // Get the post button
    const postButton = this.shadowObj.querySelector('.product');
    // Add an event listener to the post button
    postButton.addEventListener('click', e => {
      e.preventDefault();
      // Get the body element
      const body = document.querySelector('body');
      // Get the content
      const content = this.getProduct();

      // insert the content into the body
      body.insertAdjacentHTML('beforeend', content);
    });
  }

  activateServiceButton = () => {
    // Get the post button
    const postButton = this.shadowObj.querySelector('.service');
    // Add an event listener to the post button
    postButton.addEventListener('click', e => {
      e.preventDefault();
      // Get the body element
      const body = document.querySelector('body');
      // Get the content
      const content = this.getService();

      // insert the content into the body
      body.insertAdjacentHTML('beforeend', content);
    });
  }

  getService = () => {
    // Show Post Page Here
    return /* html */`
      <div is="create-post" api="/api/v1/p/add" kind="service" method="PUT"></div>
    `;
  }

  getProduct = () => {
    // Show Post Page Here
    return /* html */`
      <div is="create-post" api="/api/v1/p/add" kind="product" method="PUT"></div>
    `;
  }


  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getContent()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    return /* html */`
      <p class="title">What do you want?</p>
      <div class="options">
        <a href="/create/product" class="option product">Product</a>
        <a href="/create/service" class="option service">Service</a>
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
          background-color: var(--background);
          border-bottom: var(--border);
          padding: 0;
          display: flex;
          flex-flow: column;
          margin: 0;
          gap: 10px;
          padding: 10px 0;
          width: 100%;
        }

        p.title {
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          font-size: 1.1rem;
        }

        div.options {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 0 0 5px 0;
          font-size: 1rem;
          font-weight: 400;
          position: relative;
          overflow-x: scroll;
          scrollbar-width: none;
        }

        div.options::-webkit-scrollbar {
          display: none;
          visibility: hidden;
        }

        div.options > a.option {
          border: none;
          color: var(--add-color);
          background: var(--option-background);
          font-family: var(--font-text), sans-serif;
          cursor: pointer;
          text-decoration: none;
          padding: 3px 10px 4px;
          font-weight: 500;
          width: 80px;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        div.options > a.option {
          background: var(--gray-background);
        }

        div.options > a.option.product {
          background: var(--light-linear);
        }

        div.options > a.option.topic {
          background: var(--gray-background);
        }

        div.options > a.option:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
            gap: 10px;
					}

          div.container {
            display: flex;
            flex-flow: column;
            gap: 10px;
            padding: 5px 0 10px 0;
          }  

          div.options {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            width: 100%;
            overflow-x: scroll;
            scrollbar-width: none;
          }

          div.options::-webkit-scrollbar {
            display: none;
            visibility: hidden;
          }

          div.options > a.option {
            cursor: default !important;
            color: var(--add-color);
            font-family: var(--font-text), sans-serif;
            padding: 3px 10px 4px;
            font-weight: 600;
            width: 80px;
          }
				}
	    </style>
    `;
  }
}
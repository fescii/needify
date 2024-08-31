export default class NewPost extends HTMLDivElement {
  constructor() {
    // We are not even going to touch this.
    super();
    // let's create our shadow root
    // this.shadowObj = this.attachShadow({ mode: "open" });

    this._url = this.getAttribute('api');
    this._kind = this.getAttribute('kind')
    this.render();
  }

  render() {
    // this.shadowObj.innerHTML = this.getTemplate();
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // select section
    const section = this.querySelector('section.content');

    // select the form
    const form = this.querySelector('form');

    if (form && section) {
      // add event listener to the form
      this.submitForm(form, section);

      // activate the post type
      this.activatePost(form);
    }
    
    const btns = this.querySelectorAll('.cancel-btn');
    const overlay = this.querySelector('.overlay');

    // Close the modal
    if (overlay && btns) {
      this.closePopup(overlay, btns);
    }

    this.disableScroll();
  }

  activatePost = form => {
    const textarea = form.querySelector('textarea#body');

    // add event listener to the textarea
    if (textarea) {
      this.growTextarea(textarea);
    }
  }

  disconnectedCallback() {
    this.enableScroll();
  }

  closePopup = (overlay, btns) => {
    overlay.addEventListener('click', e => {
      e.preventDefault();
      this.remove();
    });

    btns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.remove();
      });
    })
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

  submitForm = async (form, section) => {
    const outerThis = this;
    // add submit event listener
    form.addEventListener('submit', async e => {
      e.preventDefault();
      // declare variables
      let body;

      const serverStatus = form.querySelector('.server-status');

      // if server status is already showing, remove it
      if (serverStatus) {
        serverStatus.remove();
      }

      const button = form.querySelector('.action.next');

      const actions = form.querySelector('.actions');

      // get form data
      const formData = {
        name: form.querySelector('input[name="name"]').value,
        body: form.querySelector('textarea[name="body"]').value,
        location: form.querySelector('input[name="location"]').value,
        price: form.querySelector('input[name="price"]').value,
        end: form.querySelector('input[name="end"]').value
      };

      if (!this.validateFormData(form, formData, actions)) {
        return;
      }

      // Construct the body object
      body = {
        kind: this._kind,
        published: true,
        name: formData.name,
        content: formData.body,
        location: formData.location,
        price: parseInt(formData.price),
        end: parseInt(formData.end)
      }

      button.innerHTML = this.getButtonLoader();
      // disable pointer events
      button.style.pointerEvents = 'none';

      // send data to server
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      try {
        const response = await outerThis.fetchWithTimeout(outerThis._url, options);
        const result = await response.json();

        // check if request was successful
        if (result.success) {
          // show success message
          actions.insertAdjacentHTML('beforebegin', 
            outerThis.getServerSuccessMsg(true, 'Post created successfully')
          );

          // add finish message
          outerThis.removeFormAndTopDesc(section);
        } else {
          // show error message
          actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, result.message));

          // reset button
          button.innerHTML = '<span class="text">Post</span>';
          // enable pointer events
          button.style.pointerEvents = 'auto';
        }
      }
      catch (error) {
        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, 'An error occurred, please try again'));

        // reset button
        button.innerHTML = '<span class="text">Post</span>';
        // enable pointer events
        button.style.pointerEvents = 'auto';
      }

      // remove success message
      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);
    });
  }

  validateFormData = (form, data, actions) => {
    // check if post data is valid
    if (!data.body) {
      // show error message
      actions.insertAdjacentHTML('beforebegin', this.getServerSuccessMsg(false, 'Post content must be defined!'));

      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);

      return false;
    }

    // validate post content
    if (data.body.length < 3) {
      // show error message
      actions.insertAdjacentHTML('beforebegin', this.getServerSuccessMsg(false, 'Post Content must be at least 3 characters'));

      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);

      return false;
    }

    // validate post name
    if(!data.name || data.name.length < 2) {
      // show error message
      actions.insertAdjacentHTML('beforebegin', this.getServerSuccessMsg(false, 'Name should be at least 2 characters'))

      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);

      return false;
    }

    // validate post location
    if (!data.location || data.location.length < 5) {
      // show error message
      actions.insertAdjacentHTML('beforebegin', this.getServerSuccessMsg(false, 'Location should be at least 5 characters'));

      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);

      return false;
    }

    // validate post price
    if (parseInt(data.price) < 1) {
      // show error message
      actions.insertAdjacentHTML('beforebegin', this.getServerSuccessMsg(false, 'Price must be greater than 0'));

      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);

      return false;
    }

    // validate poll end
    if (!data.end || data.end < 1 || data.end > 90) {
      // show error message
      actions.insertAdjacentHTML('beforebegin', this.getServerSuccessMsg(false, 'Post duration greater than 0 and less than or equal to 90'));

      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);

      return false;
    }

    return true;
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

  getServerSuccessMsg = (success, text) => {
    if (!success) {
      return `
        <p class="server-status">${text}</p>
      `
    }
    return `
      <p class="server-status success">${text}</p>
    `
  }

  getTemplate() {
    // Show HTML Here
    return /*html*/`
      <div class="content-wrapper">
        <div class="overlay"></div>
        <section id="content" class="content">
          ${this.getBody()}
        </section>
      </div>
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      <form class="fields post" id="post-form">
        ${this.getEditor()}
        <div class="actions">
          <span class="action-info">Publishing to feeds</span>
          <button type="submit" class="action next">
            <span class="text">Post</span>
          </button>
        </div>
      </form>
    `;
  }

  getEditor = () => {
    const name = this._kind === 'service' ? "What's the service you need?" : 'What are you looking for?';
    const text = this._kind === 'service' ? 'Describe the type of the service you need?' : "Describe the type of the product/item you're looking for?";
    return /* html */`
      <div class="field polls" id="poll-inputs">
        <div class="poll-inputs texts">
          <input type="text" name="name" id="name" placeholder="${name}" required>
          <textarea name="body" id="body" cols="30" rows="2" required placeholder="${text}"></textarea>
          <input type="text" name="location" id="location" placeholder="Your location" required>
          <input type="number" name="price" id="price" placeholder="Your bid in Ksh? e.g 1000" required min="1" required>
        </div>
        <div class="poll-inputs">
          <input type="number" name="end" id="end" placeholder="Post ends in? e.g 7 (days)" max="90" min="1" required>
        </div>
      </div>
    `;
  }

  growTextarea = input => {
    input.addEventListener('input', e => {
      const value = e.target.value;
      const lines = value.split('\n').length;
      if(lines === 1) {
        input.rows = 1;
      }
      else if (lines > 1 && lines <= 5) {
        input.rows = lines;
      } else if (lines > 5) {
        input.rows = 5;
      }
    })
  }

  getHeader = () => {
    return /* html */`
      <h2 class="pop-title">
        <span class="control cancel-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
          </svg>
        </span>
        <span class="text">Request a ${this._kind}</span>
      </h2>
    `;
  }

  getFinish = () => {
    return /* html */`
      <div class="finish">
        <h2 class="title">You're all set!</h2>
        <p class="desc">
          Your post has been created successfully. You can view it in the feeds or from your profile.
        </p>
        <button class="finish">Close</button>
      </div>
    `;
  }

  activateFinish = finish => {
    const button = finish.querySelector('button.finish');
    if (button) {
      button.addEventListener('click', e => {
        e.preventDefault();
        this.remove();
      });
    }
  }

  removeFormAndTopDesc = section => {
    const form = section.querySelector('form');

    if (form) {
      form.remove();
    }

    // insert the finish message
    section.innerHTML = this.getFinish();

    const finish = this.querySelector('div.finish');

    // activate the finish button
    this.activateFinish(finish);
  }

  getButtonLoader() {
    return `
      <span id="btn-loader">
				<span class="loader"></span>
			</span>
    `
  }

  getStyles() {
    return /* css */`
      <link rel="stylesheet" href="/static/css/ckeditor.css">
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
          -webkit-appearance: none;
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
          font-family: inherit;
        }

        a {
          text-decoration: none;
        }

        .content-wrapper {
          border: none;
          padding: 0;
          justify-self: end;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          z-index: 100;
          width: 100%;
          min-width: 100vw;
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          left: 0;
        }

        div.overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: var(--modal-background);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }

        #content {
          z-index: 1;
          background-color: var(--background);
          padding: 20px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: start;
          gap: 10px;
          width: 700px;
          max-height: 95%;
          height: 90%;
          height: max-content;
          border-radius: 15px;
          position: relative;
          overflow-y: auto;
        }

        p.server-status {
          margin: 0;
          width: 100%;
          text-align: start;
          font-family: var(--font-read), sans-serif;
          color: var(--error-color);
          font-weight: 500;
          line-height: 1.4;
          font-size: 1.18rem;
        }

        p.server-status.success {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
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

        #btn-loader > .loader {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background: var(--_g) 0 0,  var(--_g1) 100% 0, var(--_g2) 100% 100%, var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        h2.pop-title {
          width: 100%;
          font-size: 1.35rem;
          font-weight: 600;
          margin: 0;
          padding: 10px 10px;
          background-color: var(--gray-background);
          text-align: center;
          border-radius: 12px;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          font-weight: 500;
          position: relative;
        }

        h2.pop-title > span.control {
          padding: 0;
          cursor: pointer;
          display: flex;
          flex-flow: column;
          gap: 0px;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
        }

        h2.pop-title > span.control svg {
          width: 21px;
          height: 21px;
          color: var(--text-color);
        }

        h2.pop-title > span.control svg:hover{
          color: var(--error-color);
        }

        .top {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
        }

        .top > .desc {
          margin: 0;
          padding: 10px 0 20px;
          color: var(--text-color);
          font-size: 0.95rem;
          font-family: var(--font-main), sans-serif;
        }

        .top > .desc > span {
          display: inline-block;
          margin: 10px 0 5px;
          color: var(--gray-color);
          font-size: 0.85rem;
          font-style: italic;
          font-family: var(--font-read), sans-serif;
        }

        form.fields {
          margin: 0;
          width: 100%;
          min-width: 100%;
          height: auto;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 0;
        }

        div.post-type {
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 15px;
          padding: 10px 0;
        }

        div.post-type > h2.title {
          width: 100%;
          margin: 0;
          padding: 0;
          font-size: 1.25rem;
          text-align: center;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        div.post-type > div.types {
          width: 100%;
          display: flex;
          flex-flow: row;
          gap: 20px;
        }

        div.post-type > div.types > div.type {
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 10px;
          border-radius: 12px;
          background: var(--create-background);
          cursor: pointer;
        }

        div.post-type > div.types > div.type:hover {
          background: var(--background);
          border: var(--border);
        }

        div.post-type > div.types > div.type > h4.title {
          margin: 0;
          padding: 0;
          font-size: 1.1rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        div.post-type > div.types > div.type > p.desc {
          margin: 0;
          padding: 5px 0;
          font-size: 0.85rem;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
        }

        form.fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 0;
        }

        form.fields > .field.polls {
          padding: 10px 0 0 0;
        }

        form.fields > .field.polls > span.title {
          display: none;
          margin: 0;
          padding: 0 0 10px 3px;
          color: var(--text-color);
          font-size: 1rem;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
        }

        form.fields > .field.polls > .poll-inputs {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 15px;
        }

        form.fields > .field.polls > .poll-inputs.texts {
          margin: 0 0 18px;
        }

        form.fields > .field.polls > div.remove {
          width: 100%;
          display: flex;
          flex-flow: row;
          justify-content: end;
          align-items: center;
          gap: 0;
          padding: 8px 0 20px;
        }

        form.fields > .field.polls > div.remove > span.remove-poll {
          width: max-content;
          padding: 0 5px;
          display: flex;
          cursor: pointer;
          font-family: var(--font-read), sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--gray-color);
        }

        form.fields > .field.polls > .poll-inputs > span.add-option {
          /*border: var(--border);*/
          background: var(--gray-background);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          cursor: pointer;
          height: 40px;
          border-radius: 12px;
          color: var(--gray-color);
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        form.fields > .field.polls > .poll-inputs > span.add-option:hover {
          color: var(--accent-color);
        }

        form.fields .field input {
          border: var(--input-border);
          background: var(--background);
          font-family: var(--font-read), sans-serif;
          font-size: 0.95rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        form.fields .field input {
          border: none;
          display: inline-block;
          border: var(--border);
          font-family: var(--font-read), sans-serif;
          background-color: var(--background) !important;
          font-size: 1rem;
          width: 100%;
          min-width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }
        
        form.fields .field input:-webkit-autofill,
        form.fields .field input:-webkit-autofill:hover, 
        form.fields .field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }
        
        form.fields .field input:autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.fields .field input:focus {
          /* border: var(--input-border-focus); */
          border: var(--border);
        }

        form.fields textarea {
          border: none;
          border: var(--border);
          font-family: var(--font-read), sans-serif;
          background: var(--background);
          font-size: 1rem;
          padding: 10px 12px;
          margin: 0;
          max-width: 100%;
          width: 100%;
          resize: none;
          height: auto;
          line-height: 1.5;
          gap: 5px;
          font-weight: 400;
          color: var(--text-color);
          scrollbar-width: 3px;
          border-radius: 12px;
        }

        form.fields textarea::-webkit-scrollbar {
          width: 3px;
          -webkit-appearance: auto;
        }

        form.fields textarea:focus {
          border: var(--input-border-focus);
          /* border: none; */
        }

        form.fields .field span.wrapper {
          display: flex;
          align-items: center;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        form.fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          background-color: var(--label-focus-background);
          padding: 0 5px;
        }

        form.fields .field span.status {
          color: var(--error-color);
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        form.fields .field .input-group.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          display: none;
        }

        form.fields .actions {
          border-top: var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 20px;
          margin: 10px 0 0 2px;
          padding: 15px 0 0;
        }

        form.fields .actions > span.action-info {
          color: var(--gray-color);
          font-size: 0.95rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
          line-height: 1.5;
        }

        form.fields .actions > .action {
          border: none;
          background: var(--accent-linear);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          color: var(--white-color);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 8px;
          min-height: 35px;
          height: 35px;
          min-width: 60px;
          width: max-content;
          position: relative;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        form.fields .actions > .action.cancel-btn {
          background: var(--gray-background);
          fill: var(--text-color);
          /*text-transform: lowercase;*/
        }

        form.fields .actions > .action.prev svg path {
          fill: var(--text-color);
        }

        form.fields .actions > .action.next {
          color: var(--white-color);
          background: var(--stage-no-linear);
        }

        form.fields .actions > .action.next svg path {
          fill: var(--white-color);
        }

        form.fields .actions > .action.disabled {
          pointer-events: none;
        }

        div.finish {
          padding: 15px 0;
          width: 100%;
          min-width: 100%;
          height: auto;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 15px;
        }

        div.finish > h2.title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        div.finish > p.desc {
          margin: 0;
          font-size: 0.95rem;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          line-height: 1.4;
          text-align: center;
        }

        div.finish > button.finish {
          border: none;
          background: var(--accent-linear);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          color: var(--white-color);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 8px;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        #editor {
          min-width: 100%;
          width: 100%;
          max-height: 250px;
          height: 250px;
          overflow-y: auto;
          font-family: var(--font-text), sans-serif;
        }

        .ck.ck-editor__main > .ck-editor__editable {
          color: var(--editor-color);
        }

        .ck.ck-editor__main > .ck-editor__editable a {
          color: var(--anchor-color);
        }

        .ck-editor__editable_inline:not(.ck-comment__input *) {
          height: calc(90dvh - 205px);
          font-family: var(--font-text), sans-serif;
          overflow-y: auto;
        }

        .ck-body-wrapper {
          display: none;
          opacity: 0;
          visibility: hidden;
        }

        .ck.ck-reset.ck-editor {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-flex-direction: column;
          -moz-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
        }

        .ck-focused, .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
          border: none;
          border: none;
          outline: none !important;
          -moz-outline: none !important;
          -webkit-outline: none !important;
          -ms-outline: none !important;
          -webkit-box-shadow: none;
          -moz-box-shadow: none;
          box-shadow: none
        }

        @media screen and (max-width:600px) {
          .content-wrapper {
            border: none;
            background-color: var(--modal-background);
            padding: 0px;
            justify-self: end;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: end;
            gap: 10px;
            z-index: 20;
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            left: 0;
            min-width: 100dvw;
            min-height: 100dvh;
          }

          #content {
            box-sizing: border-box !important;
            padding: 20px 10px 25px 10px;
            margin: 0;
            width: 100%;
            max-width: 100%;
            max-height: 100%;
            min-height: 100%;
            border-radius: 0;
            overflow-y: auto;
          }

          #content span.control {
            cursor: default !important;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          h2.pop-title {
            width: 100%;
            font-size: 1.2rem;
            padding: 10px 10px;
            background-color: var(--gray-background);
            text-align: center;
            border-radius: 12px;
          }

          .top > .desc {
            margin: 0;
            padding: 6px 0 10px;
            font-size: 0.95rem;
            line-height: 1.5;
            font-family: var(--font-main), sans-serif;
          }

          div.finish {
            padding: 25px 0 10px;
            width: 100%;
            min-width: 100%;
            height: auto;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            gap: 18px;
          }

          div.post-type > div.types {
            width: 100%;
            display: flex;
            flex-flow: column;

            gap: 20px;
          }

          form.fields .actions {
            align-items: center;
            width: 100%;
            gap: 25px;
          }

          div.finish > button.finish {
            margin: 10px 0 0;
          }

          form.fields > .field.polls > div.remove > span.remove-poll,
          form.fields > .field.polls > .poll-inputs > span.add-option,
          div.finish > button.finish,
          form.fields .actions > .action {
            cursor: default !important;
          }

          .ck-editor__editable_inline:not(.ck-comment__input *) {
            height: calc(100dvh - 208px);
            overflow-y: auto;
          }
        }
      </style>
    `;
  }
}
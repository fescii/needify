export default class UserWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // check if the user is authenticated
    this._authenticated = window.hash ? true : false;

    // Get if the user is the current user
    this._you = this.getAttribute('you') === 'true';

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.parent = this.getRootNode().host;

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // listen for changes in the attributes
  attributeChangedCallback(name, oldValue, newValue) {
    // check if old value is not equal to new value
    if (name==='reload' && newValue === 'true') {
      this.setAttribute('reload', 'false');
      // get the followers element
      const followers = this.shadowObj.querySelector('.stats > span.followers > .number');

      // Update the followers
      if(followers) {
        const totalFollowers = this.parseToNumber(this.getAttribute('followers'));
        followers.textContent = totalFollowers >= 0 ? this.formatNumber(totalFollowers) : '0';
      }

      // get the follow button
      const followBtn = this.shadowObj.querySelector('.actions > .action#follow-action');

      // Update the follow button
      if(followBtn) {
        this.updateFollowBtn(this.textToBoolean(this.getAttribute('user-follow')), followBtn);
      }
    }  
  }

  connectedCallback() {
    // perform actions
    this.performActions();
  }

  textToBoolean = text => {
    return text === 'true' ? true : false;
  }

  setAttributes = (name, value) => {
    this.parent.setAttribute(name, value);
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

  // perform actions
  performActions = () => {
    const outerThis = this;
    // get body 
    const body = document.querySelector('body');

    // get url to 
    let hash = this.getAttribute('hash');
    // trim and convert to lowercase
    hash = hash.trim().toLowerCase();

    // base api
    const url = '/api/v1/u/' + hash;

    // Get the follow action and subscribe action
    const followBtn = this.shadowObj.querySelector('.actions>.action#follow-action');

    // add event listener to the follow action
    if (followBtn) {
      // construct options
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }

      followBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        let action = false;

        // Check if the user is authenticated
        if (!this._authenticated) {
          // Open the join popup
          this.openJoin(body);
        } 
        else {
          // Update the follow button
          if (followBtn.classList.contains('following')) {
            action = true;
            outerThis.updateFollowBtn(false, followBtn);
          }
          else {
            outerThis.updateFollowBtn(true, followBtn);
          }

          // Follow the topic
          this.followUser(`${url}/follow`, options, followBtn, action);
        }
      });
    }
  }

  followUser = (url, options, followBtn, followed) => {
    const outerThis = this;
    this.fetchWithTimeout(url, options)
      .then(response => {
        response.json()
        .then(data => {
          // If data has unverified, open the join popup
          if (data.unverified) {
            // Get body
            const body = document.querySelector('body');

            // Open the join popup
            outerThis.openJoin(body);

            // revert the follow button
            outerThis.updateFollowBtn(followed, followBtn);
          }

          // if success is false, show toast message
          if (!data.success) {
            outerThis.showToast(data.message, false);

            // revert the follow button
            outerThis.updateFollowBtn(followed, followBtn);
          }
          else {
            // Show toast message
            outerThis.showToast(data.message, true);

            // Check for followed boolean
            outerThis.updateFollowBtn(data.followed, followBtn);

            // Update the followers
            // outerThis.updateFollowers(data.followed);
          }
        });
      })
      .catch(_error => {
        // console.log(_error);
        // show toast message
        outerThis.showToast('An error occurred!', false);

        // revert the follow button
        outerThis.updateFollowBtn(followed, followBtn);
      });
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

  updateFollowBtn = (following, btn) => {
    if (following) {
      // Change the text to following
      btn.textContent = 'following';

      // remove the follow class
      btn.classList.remove('follow');

      // add the following class
      btn.classList.add('following');
    }
    else {
      // Change the text to follow
      btn.textContent = 'follow';

      // remove the following class
      btn.classList.remove('following');

      // add the follow class
      btn.classList.add('follow');
    }
  }

  showToast = (text, success) => {
    // Get the toast element
    const toast = this.getToast(text, success);

    // Get body element
    const body = document.querySelector('body');

    // Insert the toast into the DOM
    body.insertAdjacentHTML('beforeend', toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      // Select the toast element
      const toast = body.querySelector('.toast');

      // Remove the toast
      if(toast) {
        toast.remove();
      }
    }, 3000);
  }

  getToast = (text, success) => {
    if (success) {
      return /* html */`
        <div class="toast true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
        </svg>
          <p class="toast-message">${text}</p>
        </div>
      `;
    }
    else {
      return /* html */`
      <div class="toast false">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
        </svg>
          <p class="toast-message">${text}</p>
        </div>
      `;
    }
    
  }

  openJoin = body => {
    // Insert getJoin beforeend
    body.insertAdjacentHTML('beforeend', this.getJoin());
  }

  getJoin = () => {
    // get url from the : only the path
    const url = window.location.pathname;

    return /* html */`
      <join-popup register="/join/register" login="/join/login" next="${url}"></join-popup>
    `
  }

  updateFollowers = (followed) => {
    const outerThis = this;
    let value = followed ? 1 : -1;
    // Get followers attribute : convert to number then add value

    let followers = this.parseToNumber(this.getAttribute('followers')) + value;

    // if followers is less than 0, set it to 0
    followers = followers < 0 ? 0 : followers;

    // set user follow attribute
    this.setAttribute('user-follow', followed.toString());

    // Set the followers attribute
    this.setAttribute('followers', followers.toString());

    this.setAttributes('followers', followers)

    this.setAttributes('user-follow', followed.toString());

    // select the followers element
    const followersStat = outerThis.shadowObj.querySelector('.stats > span.followers');
    if (followersStat) {
      // select no element
      const no = followersStat.querySelector('.number');
      const text = followersStat.querySelector('.label');

      // Update the followers
      no.textContent = this.formatNumber(followers);

      // Update the text
      text.textContent = followers === 1 ? 'follower' : 'followers';
    }
  }

  formatNumber = n => {
    if (n >= 0 && n <= 999) {
      return n.toString();
    } else if (n >= 1000 && n <= 9999) {
      const value = (n / 1000).toFixed(2);
      return `${value}k`;
    } else if (n >= 10000 && n <= 99999) {
      const value = (n / 1000).toFixed(1);
      return `${value}k`;
    } else if (n >= 100000 && n <= 999999) {
      const value = (n / 1000).toFixed(0);
      return `${value}k`;
    } else if (n >= 1000000 && n <= 9999999) {
      const value = (n / 1000000).toFixed(2);
      return `${value}M`;
    } else if (n >= 10000000 && n <= 99999999) {
      const value = (n / 1000000).toFixed(1);
      return `${value}M`;
    } else if (n >= 100000000 && n <= 999999999) {
      const value = (n / 1000000).toFixed(0);
      return `${value}M`;
    } else if (n >= 1000000000) {
      return "1B+";
    }
    else {
      return 0;
    }
  }

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
      ${this.getContent()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    return /* html */`
      ${this.getHeader()}
      ${this.getActions()}
		`
  }

  getHeader = () => {
    // Get name and check if it's greater than 20 characters
    const name = this.getAttribute('name');

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 25 ? `${name.substring(0, 25)}..` : name;

    return /* html */ `
      <div class="top">
        ${this.getPicture(this.getAttribute('picture'))}
        <div class="info">
          <div class="name">
            <h4 class="name">
              <span class="name">${displayName}</span>
            </h4>
            <span class="stat">
              ${this.getStats()}
            </span>
          </div>
        </div>
      </div>
      ${this.getBio()}
    `
  }

  getBio = () => {
    // get bio
    let bio = this.getAttribute('bio') || '';

    bio = bio.trim();

    // check if bio is empty
    if (bio === '') {
      return '';
    }
    else {
      // check if bio is greater than 70 characters
      let displayBio = bio.length > 150 ? `${bio.substring(0, 150)}..` : bio;

      return /*html*/`
        <p class="bio">${displayBio}</p>
      `
    }
  }

  getPicture = picture => {
    // check if picture is empty || null || === "null"
    if (picture === '' || picture === null || picture === 'null') {
      return /*html*/`
        <div class="avatar svg">
          <div class="svg-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
            </svg>
          </div>
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="avatar">
          <img src="${picture}" alt="Author picture">
        </div>
      `
    }
  }

  getStats = () => {
    // Get total followers & following and parse to integer
    const followers = this.getAttribute('followers') || 0;

    // Convert the followers & following to a number
    const totalFollowers = this.parseToNumber(followers);

    //  format the number
    const followersFormatted = this.formatNumber(totalFollowers);

    return /* html */`
      <span class="number">${followersFormatted}</span>
      <span class="label">${totalFollowers === 1 ? 'follower' : 'followers'}</span>
		`
  }

  getActions = () => {
    // You is true
    if (this._you) {
      return /*html*/`
        <div class="actions">
          <span class="action you" id="you-action">You</span>
          <a href="/u/${this.getAttribute('hash')}" class="action view" id="view-action">view</a>
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="actions">
          ${this.checkFollowing(this.getAttribute('user-follow'))}
          <a href="/u/${this.getAttribute('hash')}" class="action view" id="view-action">view</a>
        </div>
      `
    }
  }

  checkFollowing = following => {
    if (following === 'true') {
      return /*html*/`
			  <span class="action following" id="follow-action">Following</span>
			`
    }
    else {
      return /*html*/`
			  <span class="action follow" id="follow-action">Follow</span>
			`
    }
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
          padding: 0;
          margin: 0;
        }

        a {
          text-decoration: none;
        }

        :host {
          font-size: 16px;
          padding: 0 0 8px 0;
          width: 100%;
          min-width: 100%;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 2px;
        }

        .top {
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        .top > .avatar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          min-width: 38px;
          min-height: 38px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar.svg {
          background: var(--gray-background);
        }

        .top > .avatar > .svg-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar > .svg-avatar svg {
          width: 25px;
          height: 25px;
          color: var(--gray-color);
          display: inline-block;
          margin: 0 0 5px 0;
        }

        .top > .avatar > img {
          width: 38px;
          height: 38px;
          object-fit: cover;
          overflow: hidden;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar > svg {
          position: absolute;
          bottom: 0px;
          right: -3px;
          width: 30px;
          height: 30px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .top > .avatar > svg path#top {
          color: var(--background);
        }
        
        .top > .avatar > svg path#bottom {
          color: var(--accent-color);
        }

        .top > .info {
          display: flex;
          flex-flow: column;
          padding: 0;
          gap: 0;
          align-items: start;
          justify-content: center;
          align-content: center;
        }

        .top > .info > .name {
          display: flex;
          justify-content: center;
          flex-flow: column;
          gap: 0;
        }

        .top > .info > .name > h4.name {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .top > .info > .name > span.username {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-main), monospace;
          font-size: 0.9rem;
          font-weight: 400;
          text-decoration: none;
          display: flex;
          gap: 2px;
          align-items: center;
        }

        .top > .info > .name > span.username svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 2px 0 0 0;
        }

        .top > .info > .name > span.username:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .top > .info > .name > span.username:hover svg {
          color: var(--accent-color);
        }

        .stat {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 3px;
        }

        .stat > .label {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-transform: lowercase;
          font-size: 0.85rem;
          font-weight: 400;
        }

        .stat > .number {
          color: var(--highlight-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .bio {
          display: flex;
          flex-flow: column;
          margin: 5px 0;
          gap: 0;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          line-height: 1.4;
          font-weight: 400;
        }

        .bio > p {
          all: inherit;
          margin: 0 0 2px;
        }

        .actions {
          border-bottom: var(--border);
          width: 100%;
          display: flex;
          flex-flow: row;
          gap: 20px;
          padding: 0 0 10px;
          margin: 0;
        }

        .actions > .action {
          text-decoration: none;
          padding: 2px 12px 3px;
          font-weight: 400;
          background: var(--accent-linear);
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          cursor: pointer;
          width: max-content;
          text-transform: lowercase;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 10px;
        }

        .actions > .action.donate {
          background: var(--second-linear);
        }

        .actions > .action.you {
          text-transform: capitalize;
          padding: 3px 12px 4px;
          cursor: default;
          pointer-events: none;
          border: none;
          background: var(--gray-background);
        }

        .actions > .action.view,
        .actions > .action.socials,
        .actions > .action.following,
        .actions > .action.settings {
          padding: 2px 12px 3px;
          background: unset;
          border: var(--action-border);
          color: var(--gray-color);
        }

        .actions > .action.highlights {
          background: var(--second-linear);
          padding: 4px 12px 5px;
        }

        @media screen and (max-width: 660px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }

          a,
          span.stat,
          span.action {
            cursor: default !important;
          }

          .stats {
            margin: 0 5px 0 0;
            width: 100%;
            gap: 5px;
          }
        }
      </style>
    `;
  }
}
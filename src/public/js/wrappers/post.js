export default class PostWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.you = this.convertToBoolean(this.getAttribute('you'));

    this.render();
  }

  convertToBoolean = value => {
    return value === "true";
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.style.display = 'flex';

    // Open read more
    this.openReadMore();

    // Open url
    this.openUrl();
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

  // Get lapse time
  getLapseTime = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    // Get the current time
    const currentTime = new Date();

    // Get the difference in time
    const timeDifference = currentTime - date;

    // Get the seconds
    const seconds = timeDifference / 1000;

    // Check if seconds is less than 60: return Just now
    if (seconds < 60) {
      return 'Just now';
    }
    // check if seconds is less than 86400: return time AM/PM
    if (seconds < 86400) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // check if seconds is less than 604800: return day and time
    if (seconds <= 604800) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // Check if the date is in the current year:: return date and month short 2-digit year without time
    if (date.getFullYear() === currentTime.getFullYear()) {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', });
    }
    else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  // Open read more
  openReadMore = () => {
    // Get the read more button
    const readMore = this.shadowObj.querySelector('.content .read-more');

    // Get the content
    const content = this.shadowObj.querySelector('.content');

    // Check if the read more button exists
    if (readMore && content) {
      readMore.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Prevent event from reaching any immediate nodes.
        e.stopImmediatePropagation()

        // Toggle the active class
        content.classList.remove('extra');

        // remove the read more button
        readMore.remove();
      });
    }
  }

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  openUrl = () => {
    // get all the links
    const links = this.shadowObj.querySelectorAll('div#content a');
    const body = document.querySelector('body');

    // loop through the links
    if (!links) return;

    links.forEach(link => {
      // add event listener to the link
      link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        // get the url
        const url = link.getAttribute('href');

        // link pop up
        let linkPopUp = `<url-popup url="${url}"></url-popup>`

        // open the popup
        body.insertAdjacentHTML('beforeend', linkPopUp);
      });
    });
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody() {
    return `
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getFooter()}
    `;
  }

  getHeader = () => {
    return /*html*/`
      <div class="meta top-meta">
        ${this.getHeaderMeta()}
      </div>
    `
  }

  getContent = () => {
    const content = this.innerHTML;

    // Convert content to str and check length
    const contentStr = content.toString();
    const contentLength = contentStr.length;
    const url = `/p/${this.getAttribute('hash')}`;

    // Check if content length is greater than 400
    if (contentLength > 400) {
      return /*html*/`
        <div class="request">
          <h3 class="title">
            <a href="${url}" class="link">${this.getAttribute('name')}</a>
          </h3>
          <span class="location">${this.getAttribute('location')}</span>
        </div>
        <div class="content extra" id="content">
          ${content}
          <div class="read-more">
            <span class="action">view more</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
            </svg>
          </div>
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="request">
          <h3 class="title">
            <a href="${url}" class="link">${this.getAttribute('name')}</a>
          </h3>
          <span class="location">${this.getAttribute('location')}</span>
        </div>
        <div class="content" id="content">
          ${content}
        </div>
      `
    }
  }

  getFooter = () => {
    const views = this.parseToNumber(this.getAttribute('views'));
    return /*html*/`
      <div class="actions">
        <span class="action price plain">Ksh. ${this.numberWithCommas(this.getAttribute('price'))}</span>
        ${this.checkYou(this.you)}
        <span class="action views plain">
          <span class="no">${this.formatNumber(views)}</span> <span class="text">${views === 1 ? 'view' : 'views'}</span>
        </span>
      </div>
    `
  }

  checkYou = you => {
    const email = this.getAttribute('user-email');
    if (you) {
      return `<span class="action edit" id="edit-action">edit</span>`
    } else {
      return `<a href="mailto:${email}" class="action contact">contact</a>`
    }
  }

  getHeaderMeta = () => {
    // Get name and check if it's greater than 20 characters
    const name = this.getAttribute('user-name');

    // GET url
    const url = this.getAttribute('user-url');

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 20 ? `${name.substring(0, 20)}..` : name;

    const time =  this.getLapseTime(this.getAttribute('time'));

    return /* html */ `
      <div class="top">
        ${this.getPicture(this.getAttribute('user-picture'))}
        <div class="name">
          <h4 class="name">
            <a href="${url}" class="name">${displayName}</a>
          </h4>
          <span class="username" id="username">
            <span class="text">${time}</span>
          </span>
        </div>
      </div>
    `
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
          font-family: inherit;
          line-height: 1.4;
        }

        p,
        ul,
        ol {
          font-family: inherit;
          line-height: 1.4;
        }

        a {
          text-decoration: none;
        }


        :host {
          font-size: 16px;
          border-bottom: var(--border);
          font-family: var(--font-main), sans-serif;
          padding: 15px 0;
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .meta {
          width: 100%;
          height: max-content;
          display: flex;
          position: relative;
          color: var(--gray-color);
          align-items: center;
          font-family: var(--font-mono),monospace;
          gap: 5px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .top {
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          padding: 0;
          gap: 8px;
        }

        .top > .avatar {
          position: relative;
          margin-top: -2px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar.svg {
          background: var(--gray-background);
        }

        .top > .avatar > .svg-avatar {
          border: var(--border-button);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar > .svg-avatar svg {
          width: 25px;
          height: 25px;
          color: var(--gray-color);
        }

        .top > .avatar > img {
          width: 100%;
          height: 100%;
          overflow: hidden;
          object-fit: cover;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar > svg  {
          position: absolute;
          bottom: -1px;
          right: -4px;
          width: 20px;
          height: 20px;
          z-index: 1;
          fill: var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .top > .avatar > svg path#top {
          color: var(--gray-background);
        }
        
        .top > .avatar > svg path#bottom {
          color: var(--accent-color);
        }

        .top > .name {
          display: flex;
          justify-content: center;
          flex-flow: column;
          color: var(--text-color);
          gap: 0;
          font-weight: 500;
        }

        .top > .name > h4.name {
          margin: 0;
          display: flex;
          text-decoration: none;
          align-items: center;
          line-height: 1;
          gap: 5px;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .top > .name > h4.name > a.name {
          text-decoration: none;
          color: inherit;
        }

        .top > .name > h4.name > a.name:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .top > .name > h4.name svg {
          color: var(--alt-color);
          margin: 5px 0 0 0;
        }

        .top > .name > span.username {
          color: var(--gray-color);
          font-family: var(--font-main), monospace;
          font-size: 0.8rem;
          font-weight: 400;
          text-decoration: none;
          display: flex;
          gap: 2px;
          align-items: center;
        }

        .top > .name > a.username svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 3px 0 0 0;
        }

        .top > .name > a.username:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .top > .name > a.username:hover svg {
          color: var(--accent-color);
        }

        .request {
          display: flex;
          position: relative;
          cursor: pointer;
          flex-flow: column;
          color: var(--text-color);
          line-height: 1;
          gap: 0;
          margin: 0;
          padding: 5px 0 9px;
        }
  
        .request span.location {
          margin: 0;
          padding: 0;
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
        }

        .request h3.title {
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
        }
  
        .request h3.title > a {
          text-decoration: none;
          color: inherit;
        }

        .content {
          width: 100%;
          display: flex;
          cursor: pointer;
          flex-flow: column;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.4;
          gap: 0;
          margin: 0;
          padding: 0 0 5px;
        }

        .content.extra {
          max-height: 200px;
          overflow: hidden;
          position: relative;
        }

        .content.extra .read-more {
          position: absolute;
          bottom: -5px;
          right: 0;
          left: 0;
          width: 100%;
          padding: 5px 0 9px;
          display: flex;
          align-items: end;
          justify-content: center;
          min-height: 80px;
          gap: 3px;
          cursor: pointer;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          color: var(--gray-color);
          background: var(--fade-linear-gradient);
        }

        .content.extra .read-more svg {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 0 2px 0;
        }

        .content h6,
        .content h5,
        .content h4,
        .content h3,
        .content h1 {
          padding: 0;
          font-size: 1.3rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 5px 0;
        }

        .content p {
          margin: 2px 0;
          line-height: 1.4;
        }

        .content a {
          text-decoration: none;
          cursor: pointer;
          color: var(--anchor-color) !important;
        }

        .content a:hover {
          text-decoration: underline;
        }

        .content blockquote {
          margin: 5px 0;
          padding: 5px 15px;
          font-style: italic;
          border-left: 2px solid var(--gray-color);
          background: var(--background);
          color: var(--text-color);
          font-weight: 400;
          line-height: 1.4;
        }

        .content blockquote:before {
          content: open-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        blockquote:after {
          content: close-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        .content hr {
          border: none;
          background-color: var(--text-color);
          height: 1px;
          margin: 10px 0;
        }

        .content code {
          background: var(--gray-background);
          padding: 5px;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          border-radius: 5px;
        }

        .content b,
        .content strong {
          font-weight: 700;
          line-height: 1.4;

        }

        .content ul,
        .content ol {
          margin: 5px 0 15px 20px;
          padding: 0 0 0 15px;
          color: inherit;
          line-height: 1.4;
        }

        .content ul li,
        .content ol li {
          margin: 6px 0;
          padding: 0;
          color: inherit;
        }

        .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 15px;
          margin: 0;
          padding: 3px 0 0;
        }
        
        .actions > .action {
          border: var(--border-button);
          text-decoration: none;
          color: var(--gray-color);
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: lowercase;
          justify-content: center;
          padding: 1.5px 10px 2.5px;
          border-radius: 10px;
        }
        .actions > .action.contact {
          border: none;
          background: var(--gray-background);
          color: var(--gray-color);
          font-size: 0.95rem;
          font-weight: 500;
          padding: 3px 12px 4px;
        }

        .actions > .action.plain {
          padding: 0;
          font-weight: 500;
          pointer-events: none;
          font-family: var(--font-text), sans-serif;
          color: var(--gray-color);
          border: none;
          background: none;
        }

        .actions > .action.plain.price {
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          text-transform: none;
          font-weight: 600;
          color: var(--title-color);
        }
        
        .actions > .action.plain > span.no {
          font-family: var(--font-main), sans-serif;
          font-size: 0.85rem;
          color: var(--text-color);
        }

        .actions > .action.plain > span.text {
          display: inline-block;
          padding: 0 0 0 3px;
        }

        @media screen and (max-width:660px) {
          :host {
            font-size: 16px;
            width: 100%;
            border-bottom: var(--border);
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .meta a.reply-link,
          .meta div.author-name > a,
          a,
          .stats > .stat {
            cursor: default !important;
          }

          .content a {
            cursor: default !important;
          }

          a,
          .content.extra .read-more,
          .replying-to,
          .content,
          span.action {
            cursor: default !important;
          }

          .actions {
            width: 100%;
          }

          .actions > .action.plain > span.no {
            font-family: var(--font-main), sans-serif;
            font-size: 0.8rem;
            color: var(--text-color);
          }

          a {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}
// import apps
import AppHome from "./apps/app.js";
import AppLogon from "./apps/logon.js";
import AppSearch from "./apps/search.js";
import AppProfile from "./apps/profile.js";

// import containers
import FormContainer from "./containers/add.js";
import PeopleContainer from "./containers/people.js";
import InfoContainer from "./containers/info.js";

// import feeds
import PostFeed from "./feeds/posts.js";

// import wrappers
import PostWrapper from "./wrappers/post.js";
import UserWrapper from "./wrappers/user.js";
import HeaderWrapper from "./wrappers/header.js";

// import loaders
import PeopleLoader from "./loaders/people.js";
import InfoLoader from "./loaders/info.js";

// import popups
import JoinPopup from "./popups/join.js";

// register custom elements: apps
customElements.define("app-home", AppHome);
customElements.define("app-logon", AppLogon);
customElements.define("app-search", AppSearch);
customElements.define("app-profile", AppProfile);

// register custom elements: containers
customElements.define("add-container", FormContainer);
customElements.define("people-container", PeopleContainer);
customElements.define("info-container", InfoContainer);

// register custom elements: feeds
customElements.define("post-feed", PostFeed);

// register custom elements: wrappers
customElements.define("post-wrapper", PostWrapper);
customElements.define("user-wrapper", UserWrapper);
customElements.define("header-wrapper", HeaderWrapper);

// register custom elements: loaders
customElements.define("people-loader", PeopleLoader);
customElements.define("info-loader", InfoLoader);

// register custom elements: popups
customElements.define("join-popup", JoinPopup);
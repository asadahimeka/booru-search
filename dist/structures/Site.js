"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class Site{domain;type;aliases;nsfw;api;paginate;random;tagQuery;tagJoin;insecure;defaultTags;constructor(a){this.domain=a.domain,this.type=a.type??"json",this.aliases=a.aliases??[],this.nsfw=a.nsfw,this.api=a.api??{},this.paginate=a.paginate??"page",this.random=a.random??!1,this.tagQuery=a.tagQuery??"tags",this.tagJoin=a.tagJoin??"+",this.insecure=a.insecure??!1,this.defaultTags=a.defaultTags??[]}}exports.default=Site;
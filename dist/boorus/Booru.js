"use strict";var __importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.Booru=void 0;const node_fetch_1=__importDefault(require("node-fetch")),Constants_1=require("../Constants"),Utils_1=require("../Utils"),Post_1=__importDefault(require("../structures/Post")),SearchResults_1=__importDefault(require("../structures/SearchResults"));class Booru{domain;site;credentials;constructor(t,e){const s=(0,Utils_1.resolveSite)(t.domain);if(null===s)throw new Error(`Invalid site passed: ${t}`);this.domain=s,this.site=t,this.credentials=e}async search(t,{limit:e=1,random:s=!1,page:r=1,showUnavailable:a=!1}={}){const i=s&&!this.site.random?100:0;try{const o=await this.doSearchRequest(t,{limit:e,random:s,page:r,showUnavailable:a});return this.parseSearchResult(o,{fakeLimit:i,tags:t,limit:e,random:s,page:r,showUnavailable:a})}catch(t){throw t instanceof Error?new Constants_1.BooruError(t):t}}postView(t){if("string"==typeof t&&Number.isNaN(parseInt(t,10)))throw new Constants_1.BooruError(`Not a valid id for postView: ${t}`);return`http${this.site.insecure?"":"s"}://${this.domain}${this.site.api.postView}${t}`}async doSearchRequest(t,{uri:e=null,limit:s=1,random:r=!1,page:a=1}={}){let i;Array.isArray(t)||(t=[t]),r&&(this.site.random?t.push("order:random"):i=100),this.site.defaultTags&&(t=t.concat(this.site.defaultTags.filter((e=>!t.includes(e)))));const o=e||this.getSearchUrl({tags:t,limit:i||s,page:a}),n=Constants_1.defaultOptions,l="xml"===this.site.type;try{const t=await(0,node_fetch_1.default)(o,n);if(503===t.status&&(await t.clone().text()).includes("cf-browser-verification"))throw new Constants_1.BooruError("Received a CloudFlare browser verification request. Can't proceed.");const e=l?await t.text():await t.json(),s=l?(0,Utils_1.jsonfy)(e):e;if(t.ok)return s;throw new Constants_1.BooruError(`Received HTTP ${t.status} from booru: '${s.error||s.message||JSON.stringify(s)}'`)}catch(t){if("invalid-json"===t.type)return"";throw t}}getSearchUrl({tags:t=[],limit:e=100,page:s=1}){return(0,Constants_1.searchURI)(this.site,t,e,s)}parseSearchResult(t,{fakeLimit:e,tags:s,limit:r,random:a,page:i,showUnavailable:o}){if(!1===t.success)throw new Constants_1.BooruError(t.message||t.reason);let n;t["@attributes"]&&(t="0"!==t["@attributes"].count&&t.post?Array.isArray(t.post)?t.post:[t.post]:[]),t.posts&&(t=t.posts),t.images&&(t=t.images),""===t?n=[]:e?n=(0,Utils_1.shuffle)(t):t.constructor===Object&&(n=[t]);let l=(n||t).slice(0,r).map((t=>new Post_1.default(t,this)));const u={limit:r,random:a,page:i,showUnavailable:o};return void 0===s&&(s=[]),Array.isArray(s)||(s=[s]),o||(l=l.filter((t=>t.available))),new SearchResults_1.default(l,s,u,this)}}exports.Booru=Booru,exports.default=Booru;
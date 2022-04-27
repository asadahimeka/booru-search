"use strict";function parseImageUrl(e,t,i){if(!e||""===e.trim()||t.is_deleted)return null;if(e.startsWith("/data")&&(e=`https://danbooru.donmai.us${e}`),e.startsWith("/cached")&&(e=`https://danbooru.donmai.us${e}`),e.startsWith("/_images")&&(e=`https://dollbooru.org${e}`),e.startsWith("//derpicdn.net")&&(e=`https:${t.image}`),!t.file_url&&void 0!==t.directory){const s=t.directory??`${t.hash.substr(0,2)}/${t.hash.substr(2,2)}`;e=`//${i.domain}/images/${s}/${t.image}`}return e.startsWith("http")||(e=`https:${e}`),encodeURI(e)}function getTags(e){let t=[];return Array.isArray(e.tags)?e.tags:(t=e.tags&&e.tags.general?Object.values(e.tags).reduce(((e,t)=>e.concat(t)),[]):e.tags?e.tags.split(" "):e.tag_string.split(" ").map((e=>e.replace(/,/g,"").replace(/ /g,"_"))),t.filter((e=>""!==e)))}function formatFileSize(e){return e>1048576?(e/1048576).toFixed(2)+"MB":e>1024?(e/1024).toFixed(2)+"KB":e.toFixed(2)+"B"}Object.defineProperty(exports,"__esModule",{value:!0});class Post{booru;fileUrl;height;width;sampleUrl;sampleHeight;sampleWidth;previewUrl;previewHeight;previewWidth;id;available;tags;score;source;rating;createdAt;data;constructor(e,t){this.data=e,this.booru=t;const i=e.is_deleted||e.is_banned;this.fileUrl=parseImageUrl(e.file_url||e.image||(i?e.source:void 0)||e.file&&e.file.url||e.representations&&e.representations.full,e,t),this.available=!i&&null!==this.fileUrl,this.height=parseInt(e.height||e.image_height||e.file&&e.file.height,10),this.width=parseInt(e.width||e.image_width||e.file&&e.file.width,10),this.sampleUrl=parseImageUrl(e.sample_url||e.large_file_url||e.representations&&e.representations.large||e.sample&&e.sample.url,e,t),this.sampleHeight=parseInt(e.sample_height||e.sample&&e.sample.height,10),this.sampleWidth=parseInt(e.sample_width||e.sample&&e.sample.width,10),this.previewUrl=parseImageUrl(e.preview_url||e.preview_file_url||e.representations&&e.representations.small||e.preview&&e.preview.url,e,t),this.previewHeight=parseInt(e.preview_height||e.preview&&e.preview.height,10),this.previewWidth=parseInt(e.preview_width||e.preview&&e.preview.width,10),this.id=e.id?e.id.toString():"No ID available",this.tags=getTags(e),e.score&&e.score.total?this.score=e.score.total:this.score=e.score?parseInt(e.score,10):e.score,this.source=e.source||e.sources||e.source_url,this.rating=e.rating||/(safe|suggestive|questionable|explicit)/i.exec(e.tags)||"u",Array.isArray(this.rating)&&(this.rating=this.rating[0]),"suggestive"===this.rating&&(this.rating="q"),this.rating=this.rating.charAt(0),this.createdAt=null,"object"==typeof e.created_at?this.createdAt=new Date(1e3*e.created_at.s+e.created_at.n/1e9):"number"==typeof e.created_at?this.createdAt=new Date(1e3*e.created_at):"number"==typeof e.change?this.createdAt=new Date(1e3*e.change):this.createdAt=new Date(e.created_at||e.date)}get isRatingS(){return"s"===this.rating}get isRatingQ(){return"q"===this.rating}get isRatingE(){return"e"===this.rating}get aspectRatio(){return this.width/this.height}get jpegUrl(){return this.data.jpeg_url??""}get jpegWidth(){return this.data.jpeg_width??0}get jpegHeight(){return this.data.jpeg_height??0}get fileExt(){return this.data.file_ext??""}get sampleSize(){return this.data.sample_file_size??0}get jpegSize(){return this.data.jpeg_file_size??0}get fileSize(){return this.data.file_size??0}get sampleSizeText(){return formatFileSize(this.data.sample_file_size)}get sampleDownloadText(){return`${this.sampleWidth}×${this.sampleHeight} [${this.sampleSizeText}]`}get sampleDownloadSecondText(){return`${this.sampleWidth}×${this.sampleHeight} [${this.sampleSizeText}]`}get sampleDownloadName(){return`${this.booru.domain}.${this.id}.${this.sampleWidth}x${this.sampleHeight}`.replace(/\./g,"_")}get jpegSizeText(){return formatFileSize(this.data.jpeg_file_size)}get jpegDownloadText(){return`${this.jpegWidth}×${this.jpegHeight} [${this.jpegSizeText}]`}get jpegDownloadSecondText(){return`${this.jpegWidth}×${this.jpegHeight} [${this.jpegSizeText}]`}get jpegDownloadName(){return`${this.booru.domain}.${this.id}.${this.jpegWidth}x${this.jpegHeight}`.replace(/\./g,"_")}get fileSizeText(){return formatFileSize(this.data.file_size)}get fileDownloadText(){return`${this.width}×${this.height} [${this.fileSizeText}] ${this.fileExt.toUpperCase()}`}get fileDownloadSecondText(){return`${this.width}×${this.height} [${this.fileSizeText}] ${this.fileExt.toUpperCase()}`}get fileDownloadName(){return`${location.hostname}.${this.id}.${this.width}x${this.height}`.replace(/\./g,"_")}get createdTime(){const e=this.createdAt;return e?`${e.toLocaleDateString()} ${e.toLocaleTimeString("en-DE")}`:""}get sourceUrl(){const e=Array.isArray(this.source)?this.source[0]:this.source;if(!e)return"";if(/^https:\/\/i\.pximg\.net\/img-original\/img\/[\d/]{19}\/([\d]{1,})_p[\d]{1,}\.(jpg|png)$/.test(e)){return`https://pixiv.net/artworks/${RegExp.$1}`}return e}get postView(){return this.booru.postView(this.id)}}exports.default=Post;
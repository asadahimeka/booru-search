/**
 * @packageDocumentation
 * @module Structures
 */

import Booru from '../boorus/Booru'

/**
 * Tries to figure out what the image url should be
 *
 * @param {string} url   why
 * @param {*}      data  boorus
 * @param {Booru}  booru so hard
 */
function parseImageUrl(url: string, data: any, booru: Booru, type = 'file'): string | null {
  // If the image's file_url is *still* undefined or the source is empty or it's deleted
  // Thanks danbooru *grumble grumble*
  if (!url || url.trim() === '' || data.is_deleted) {
    return null
  }

  if (url.startsWith('/data')) {
    url = `https://${booru.domain}${url}`
  }

  if (url.startsWith('/cached')) {
    url = `https://${booru.domain}${url}`
  }

  if (url.startsWith('/_images')) {
    url = `https://dollbooru.org${url}`
  }

  if (url.startsWith('//derpicdn.net')) {
    url = `https:${data.image}`
  }

  // Why???
  if (!data[`${type}_url`] && data.directory !== undefined) {
    // Danbooru-based boorus sometimes sort their files into directories
    // There's 2 directories, one named after the first 2 characters of the hash
    // and one named after the next 2 characters of the hash
    // Sometimes we get it in the API response as `data.directory`, sometimes it's null
    // for some ungodly reason
    // I despise the danbooru api honestly
    const directory = data.directory ?? `${data.hash.substr(0, 2)}/${data.hash.substr(2, 2)}`
    const hash = data.image.split('.')[0]
    const map: Record<string, string> = {
      preview: `//${booru.domain}/thumbnails/${directory}/thumbnail_${hash}.jpg`,
      sample: `//${booru.domain}/samples/${directory}/sample_${hash}.jpg`,
      file: `//${booru.domain}/images/${directory}/${data.image}`,
    }
    url = map[type]
  }

  if (!url.startsWith('http')) {
    url = `https:${url}`
  }

  return encodeURI(url)
}

/**
 * Takes and transforms tags from the booru's api into a common format
 * (which is an array of strings)
 * @param {any} data The data from the booru
 * @returns {string[]} The tags as a string array, and not just a string or an object
 */
 function getTags(data: any): string[] {
  let tags = []

  if (Array.isArray(data.tags)) {
    tags = data.tags
  } else if (data.tags && data.tags.general) {
    tags = Object.values<string>(data.tags).reduce(
      (acc: string[], v) => (acc = acc.concat(v)),
      [],
    )
  } else if (typeof data.tags === 'string') {
    tags = fromTagString(data.tags)
  } else if (typeof data.tag_string === 'string') {
    tags = fromTagString(data.tag_string)
  }

  return tags.filter((v: string) => v !== '')
}

/**
 * Parses a string of tags into an array of tags, doing some sanitization
 *
 * @example
 * fromTagString('tag1 tag2 tag3') => ['tag1', 'tag2', 'tag3']
 * fromTagString('tag1 tag,2 tag3 ') => ['tag1', 'tag2', 'tag3']
 * @param tags The tags as a string
 * @returns The string, parsed into an array of tags
 */
function fromTagString(tags: string): string[] {
  return tags.split(' ').map((v) => v.replace(/,/g, ''))
}

/**
 * Format file size to human readable format
 * @param {number} size The file size in bytes
 * @returns {string} The formatted file size, e.g. 512KB
 */
function formatFileSize(size: number): string {
  if (size == null) return 'N/A'
  if (size > 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  }
  if (size > 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  }
  return size.toFixed(2) + 'B'
}

function getFileExt(url: string | null): string {
  return url?.split('.').pop() ?? ''
}

function dealDanbooruPreviewUrl(url: string | null, booru: Booru) {
  if ([
    'danbooru.donmai.us',
    'aibooru.online'
  ].includes(booru.domain)) {
    return url && url.replace(/(.*)preview(.*)jpg/, '$1720x720$2webp')
  }
  return url
}

/**
 * An image from a booru with a few common props
 *
 * @example
 * ```
 * Post {
 *  fileUrl: 'https://aaaa.com/image.jpg',
 *  id: '124125',
 *  tags: ['cat', 'cute'],
 *  score: 5,
 *  source: 'https://giraffeduck.com/aaaa.png',
 *  rating: 's'
 * }
 * ```
 */
export default class Post {
  /** The {@link Booru} it came from */
  public booru: Booru
  /** The direct link to the file */
  public fileUrl: string | null
  /** The height of the file */
  public height: number
  /** The width of the file */
  public width: number
  /** The url to the medium-sized image (if available) */
  public sampleUrl: string | null
  /** The height of the medium-sized image (if available) */
  public sampleHeight: number | null
  /** The width of the medium-sized image (if available) */
  public sampleWidth: number | null
  /** The url to the smallest image (if available) */
  public previewUrl: string | null
  /** The height of the smallest image (if available) */
  public previewHeight: number | null
  /** The width of the smallest image (if available) */
  public previewWidth: number | null
  /** The id of this post */
  public id: string
  /** If this post is available (ie. not deleted, not banned, has file url) */
  public available: boolean
  /** The tags of this post */
  public tags: string[]
  /** The score of this post */
  public score: number
  /** The source of this post, if available */
  public source?: string | string[]
  /**
   * The rating of the image, as just the first letter
   * (s/q/e/u) => safe/questionable/explicit/unrated
   */
  public rating: string
  /** The Date this post was created at */
  public createdAt?: Date | null
  /** All the data given by the booru @private */
  protected data: any

  /**
   * Create an image from a booru
   *
   * @param {Object} data The raw data from the Booru
   * @param {Booru} booru The booru that created the image
   */
  constructor(data: any, booru: Booru) {
    // eslint-disable-next-line complexity
    // Damn wild mix of boorus
    this.data = data
    this.booru = booru

    // Again, thanks danbooru
    const deletedOrBanned = data.is_deleted || data.is_banned

    this.fileUrl = parseImageUrl(
      data.file_url ||
        data.image ||
        (deletedOrBanned ? data.source : undefined) ||
        (data.file && data.file.url) ||
        (data.representations && data.representations.full),
      data,
      booru,
    )

    this.available = !deletedOrBanned && this.fileUrl !== null

    this.height = parseInt(
      data.height || data.image_height || (data.file && data.file.height),
      10,
    )
    this.width = parseInt(
      data.width || data.image_width || (data.file && data.file.width),
      10,
    )

    this.sampleUrl = parseImageUrl(
      data.sample_url ||
        data.large_file_url ||
        (data.representations && data.representations.large) ||
        (data.sample && data.sample.url) ||
        data.image,
      data,
      booru,
      'sample'
    )

    this.sampleHeight = parseInt(
      data.sample_height || (data.sample && data.sample.height),
      10,
    )
    this.sampleWidth = parseInt(
      data.sample_width || (data.sample && data.sample.width),
      10,
    )

    this.previewUrl = parseImageUrl(
      data.preview_url ||
        dealDanbooruPreviewUrl(data.preview_file_url, booru) ||
        (data.representations && data.representations.small) ||
        (data.preview && data.preview.url) ||
        data.image,
      data,
      booru,
      'preview'
    )

    this.previewHeight = parseInt(
      data.preview_height || (data.preview && data.preview.height),
      10,
    )
    this.previewWidth = parseInt(
      data.preview_width || (data.preview && data.preview.width),
      10,
    )

    this.id = data.id ? data.id.toString() : 'No ID available'
    this.tags = getTags(data)

    // Too long for conditional
    // eslint-disable-next-line
    if (data.score && data.score.total) {
      this.score = data.score.total
    } else {
      this.score = data.score ? parseInt(data.score, 10) : data.score
    }

    this.source = data.source || data.sources || data.source_url
    this.rating =
      data.rating ||
      /(safe|suggestive|questionable|explicit)/i.exec(data.tags) ||
      'u'

    if (Array.isArray(this.rating)) {
      this.rating = this.rating[0]
    }

    // Thanks derpibooru
    if (this.rating === 'suggestive') {
      this.rating = 'q'
    }

    this.rating = this.rating.charAt(0)

    this.createdAt = null
    // eslint-disable-next-line
    if (typeof data.created_at === 'object') {
      this.createdAt = new Date(
        data.created_at.s * 1000 + data.created_at.n / 1000000000,
      )
    } else if (typeof data.created_at === 'number') {
      this.createdAt = new Date(data.created_at * 1000)
    } else if (typeof data.created_at === 'string') {
      this.createdAt = new Date(data.created_at)
    } else if (typeof data.change === 'number') {
      this.createdAt = new Date(data.change * 1000)
    } else {
      this.createdAt = new Date(data.created_at || data.date)
    }
  }

  /* for compatibility start */
  /** Is this post safe */
  get isRatingS() {
    return this.rating === 's'
  }
  /** Is this post questionable */
  get isRatingQ() {
    return this.rating === 'q'
  }
  /** Is this post explicit */
  get isRatingE() {
    return this.rating === 'e'
  }
  /** The aspect ratio of this post: `width / height` */
  get aspectRatio() {
    return this.width / this.height
  }
  /** The jpeg url of this post */
  get jpegUrl(): string {
    return this.data.jpeg_url ?? ''
  }
  /** The jpeg width url of this post */
  get jpegWidth(): number {
    return this.data.jpeg_width ?? 0
  }
  /** The jpeg height url of this post */
  get jpegHeight(): number {
    return this.data.jpeg_height ?? 0
  }
  /** The file extension of this post */
  get fileExt(): string {
    return this.data.file_ext ?? getFileExt(this.fileUrl)
  }
  /** The sample size url of this post */
  get sampleSize(): number {
    return this.data.sample_file_size ?? 0
  }
  /** The jpeg size url of this post */
  get jpegSize(): number {
    return this.data.jpeg_file_size ?? 0
  }
  /** The file size url of this post */
  get fileSize(): number {
    return this.data.file_size ?? 0
  }
  /** The sample image file size of this post */
  get sampleSizeText() {
    return formatFileSize(this.data.sample_file_size)
  }
  /** The sample download text of this post */
  get sampleDownloadText() {
    return `${this.sampleWidth}×${this.sampleHeight} [${this.sampleSizeText}] ${getFileExt(this.sampleUrl).toUpperCase()}`
  }
  /** The sample download name of this post */
  get sampleDownloadName() {
    return `${this.booru.domain}.${this.id}.${this.sampleWidth}x${this.sampleHeight}`.replace(/\./g, '_')
  }
  /** The jpeg image file size of this post */
  get jpegSizeText() {
    return formatFileSize(this.data.jpeg_file_size)
  }
  /** The jpeg download text of this post */
  get jpegDownloadText() {
    return `${this.jpegWidth}×${this.jpegHeight} [${this.jpegSizeText}] ${getFileExt(this.jpegUrl).toUpperCase()}`
  }
  /** The jpeg download name of this post */
  get jpegDownloadName() {
    return `${this.booru.domain}.${this.id}.${this.jpegWidth}x${this.jpegHeight}`.replace(/\./g, '_')
  }
  /** The original image file size of this post */
  get fileSizeText() {
    return formatFileSize(this.data.file_size)
  }
  /** The original file download text of this post */
  get fileDownloadText() {
    return `${this.width}×${this.height} [${this.fileSizeText}] ${this.fileExt.toUpperCase()}`
  }
  /** The original file download name of this post */
  get fileDownloadName() {
    return `${this.booru.domain}.${this.id}.${this.width}x${this.height}`.replace(/\./g, '_')
  }
  /** The formatted created time of this post */
  get createdTime() {
    const date = this.createdAt
    if (!date) return ''
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-DE')}`
  }
  get sourceUrl() {
    const source = Array.isArray(this.source) ? this.source[0] : this.source
    if (!source) return ''
    if (/^https:\/\/i\.pximg\.net\/img-original\/img\/[\d/]{19}\/([\d]{1,})_p[\d]{1,}\.(jpg|png)$/.test(source)) {
      const pid = RegExp.$1
      return `https://pixiv.net/artworks/${pid}`
    }
    return source
  }
  /* for compatibility end */

  // /**
  //  * The direct link to the file
  //  *
  //  * It's prefered to use `.fileUrl` instead because camelCase
  //  */
  // get file_url(): string | null {
  //   return this.fileUrl
  // }

  // /**
  //  * The url to the medium-sized image (if available)
  //  *
  //  * It's prefered to use `.sampleUrl` instead because camelCase
  //  */
  // get sample_url(): string | null {
  //   return this.sampleUrl
  // }

  // /**
  //  * The height of the medium-sized image (if available)
  //  *
  //  * It's prefered to use `.sampleHeight` instead because camelCase
  //  */
  // get sample_height(): number | null {
  //   return this.sampleHeight
  // }

  // /**
  //  * The width of the medium-sized image (if available)
  //  *
  //  * It's prefered to use `.sampleWidth` instead because camelCase
  //  */
  // get sample_width(): number | null {
  //   return this.sampleWidth
  // }

  // /**
  //  * The url to the smallest image (if available)
  //  *
  //  * It's prefered to use `.previewUrl` instead because camelCase
  //  */
  // get preview_url(): string | null {
  //   return this.previewUrl
  // }

  // /**
  //  * The height of the smallest image (if available)
  //  *
  //  * It's prefered to use `.previewHeight` instead because camelCase
  //  */
  // get preview_height(): number | null {
  //   return this.previewHeight
  // }

  // /**
  //  * The width of the smallest image (if available)
  //  *
  //  * It's prefered to use `.previewWidth` instead because camelCase
  //  */
  // get preview_width(): number | null {
  //   return this.previewWidth
  // }

  /**
   * Get the post view (url to the post) of this image
   *
   * @type {String}
   * @example
   * ```
   * const e9 = Booru('e9')
   * const imgs = e9.search(['cat', 'dog'])
   *
   * // Log the post url of the first image
   * console.log(imgs[0].postView)
   * ```
   */
  get postView(): string {
    return this.booru.postView(this.id)
  }
}

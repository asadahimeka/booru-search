/**
 * @packageDocumentation
 * @module Structures
 */
import Booru from '../boorus/Booru';
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
    booru: Booru;
    /** The direct link to the file */
    fileUrl: string | null;
    /** The height of the file */
    height: number;
    /** The width of the file */
    width: number;
    /** The url to the medium-sized image (if available) */
    sampleUrl: string | null;
    /** The height of the medium-sized image (if available) */
    sampleHeight: number | null;
    /** The width of the medium-sized image (if available) */
    sampleWidth: number | null;
    /** The url to the smallest image (if available) */
    previewUrl: string | null;
    /** The height of the smallest image (if available) */
    previewHeight: number | null;
    /** The width of the smallest image (if available) */
    previewWidth: number | null;
    /** The id of this post */
    id: string;
    /** If this post is available (ie. not deleted, not banned, has file url) */
    available: boolean;
    /** The tags of this post */
    tags: string[];
    /** The score of this post */
    score: number;
    /** The source of this post, if available */
    source?: string | string[];
    /**
     * The rating of the image, as just the first letter
     * (s/q/e/u) => safe/questionable/explicit/unrated
     */
    rating: string;
    /** The Date this post was created at */
    createdAt?: Date | null;
    /** All the data given by the booru @private */
    protected data: any;
    /**
     * Create an image from a booru
     *
     * @param {Object} data The raw data from the Booru
     * @param {Booru} booru The booru that created the image
     */
    constructor(data: any, booru: Booru);
    /** Is this post safe */
    get isRatingS(): boolean;
    /** Is this post questionable */
    get isRatingQ(): boolean;
    /** Is this post explicit */
    get isRatingE(): boolean;
    /** The aspect ratio of this post: `width / height` */
    get aspectRatio(): number;
    /** The jpeg url of this post */
    get jpegUrl(): string;
    /** The jpeg width url of this post */
    get jpegWidth(): number;
    /** The jpeg height url of this post */
    get jpegHeight(): number;
    /** The file extension of this post */
    get fileExt(): string;
    /** The sample size url of this post */
    get sampleSize(): number;
    /** The jpeg size url of this post */
    get jpegSize(): number;
    /** The file size url of this post */
    get fileSize(): number;
    /** The sample image file size of this post */
    get sampleSizeText(): string;
    /** The sample download text of this post */
    get sampleDownloadText(): string;
    /** The sample download name of this post */
    get sampleDownloadName(): string;
    /** The jpeg image file size of this post */
    get jpegSizeText(): string;
    /** The jpeg download text of this post */
    get jpegDownloadText(): string;
    /** The jpeg download name of this post */
    get jpegDownloadName(): string;
    /** The original image file size of this post */
    get fileSizeText(): string;
    /** The original file download text of this post */
    get fileDownloadText(): string;
    /** The original file download name of this post */
    get fileDownloadName(): string;
    /** The formatted created time of this post */
    get createdTime(): string;
    get sourceUrl(): string;
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
    get postView(): string;
}

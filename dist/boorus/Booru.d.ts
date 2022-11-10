/**
 * @packageDocumentation
 * @module Boorus
 */
import InternalSearchParameters from '../structures/InternalSearchParameters';
import SearchParameters from '../structures/SearchParameters';
import SearchResults from '../structures/SearchResults';
import Site from '../structures/Site';
export interface BooruCredentials {
    token?: string;
    query?: string;
}
interface SearchUrlParams {
    tags: string[];
    limit: number;
    page: number;
    credentials: BooruCredentials;
}
/**
 * A basic, JSON booru
 * @example
 * ```
 * const Booru = require('booru')
 * // Aliases are supported
 * const e9 = Booru('e9')
 *
 * // You can then search the site
 * const imgs = await e9.search(['cat', 'cute'], {limit: 3})
 *
 * // And use the images
 * imgs.forEach(i => console.log(i.fileUrl))
 *
 * // Or access other methods on the Booru
 * e9.postView(imgs[0].id)
 * ```
 */
export declare class Booru {
    /** The domain of the booru */
    domain: string;
    /** The site object representing this booru */
    site: Site;
    /** The credentials to use for this booru */
    credentials?: BooruCredentials;
    /**
     * Create a new booru from a site
     *
     * @private
     * @param site The site to use
     * @param credentials Credentials for the API (Currently not used)
     */
    constructor(site: Site, credentials?: BooruCredentials);
    /**
     * Search for images on this booru
     * @param {String|String[]} tags The tag(s) to search for
     * @param {SearchParameters} searchArgs The arguments for the search
     * @return {Promise<SearchResults>} The results as an array of Posts
     */
    search(tags: string | string[], { limit, random, page, showUnavailable, credentials }?: SearchParameters): Promise<SearchResults>;
    /**
     * Gets the url you'd see in your browser from a post id for this booru
     *
     * @param {String} id The id to get the postView for
     * @return {String} The url to the post
     */
    postView(id: string | number): string;
    /**
     * The internal & common searching logic, pls dont use this use .search instead
     *
     * @protected
     * @param {String[]|String} tags The tags to search with
     * @param {InternalSearchParameters} searchArgs The arguments for the search
     * @return {Promise<Object>}
     */
    protected doSearchRequest(tags: string[] | string, { uri, limit, random, page, credentials }?: InternalSearchParameters): Promise<any>;
    /**
     * Generates a URL to search the booru with, mostly for debugging purposes
     * @param opt
     * @param {string[]} [opt.tags] The tags to search for
     * @param {number} [opt.limit] The limit of results to return
     * @param {number} [opt.page] The page of results to return
     * @returns A URL to search the booru
     */
    getSearchUrl({ tags, limit, page, credentials }: Partial<SearchUrlParams>): string;
    /**
     * Parse the response from the booru
     *
     * @protected
     * @param {Object} result The response of the booru
     * @param {InternalSearchParameters} searchArgs The arguments used for the search
     * @return {SearchResults} The results of this search
     */
    protected parseSearchResult(result: any, { fakeLimit, tags, limit, random, page, showUnavailable, }: InternalSearchParameters): SearchResults;
}
export default Booru;

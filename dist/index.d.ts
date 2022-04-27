/**
 * @packageDocumentation
 * @module Index
 */
import Booru from './boorus/Booru';
import SearchParameters from './structures/SearchParameters';
import SearchResults from './structures/SearchResults';
/**
 * Create a new booru to search with
 *
 * @constructor
 * @param {String} site The {@link Site} domain (or alias of it) to create a booru from
 * @param {*} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 */
declare function booruForSite(site: string, credentials?: any): Booru;
export { booruForSite as forSite };
export default booruForSite;
/**
 * Searches a site for images with tags and returns the results
 * @param {String} site The site to search
 * @param {String[]|String} [tags=[]] Tags to search with
 * @param {SearchParameters} [searchOptions={}] The options for searching
 *  if provided (Unused)
 * @return {Promise<SearchResults>} A promise with the images as an array of objects
 *
 * @example
 * ```
 * const Booru = require('booru')
 * // Returns a promise with the latest cute glace pic from e926
 * Booru.search('e926', ['glaceon', 'cute'])
 * ```
 */
export declare function search(site: string, tags?: string[] | string, { limit, random, page, credentials }?: SearchParameters): Promise<SearchResults>;
export { Booru as BooruClass } from './boorus/Booru';
export { sites } from './Constants';
export { resolveSite } from './Utils';
export { BooruError } from './Constants';

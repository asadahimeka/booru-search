/**
 * @packageDocumentation
 * @module Index
 */

import { BooruError, sites, SMap } from './Constants'

import Booru, { BooruCredentials } from './boorus/Booru'
import Derpibooru from './boorus/Derpibooru'
import XmlBooru from './boorus/XmlBooru'
import SearchParameters from './structures/SearchParameters'
import SearchResults from './structures/SearchResults'
import Post from './structures/Post'
import Site from './structures/Site'
import { resolveSite } from './Utils'

const BooruTypes: Record<string, typeof Booru> = {
  derpi: Derpibooru,
  xml: XmlBooru,
}

const booruCache: SMap<Booru> = {}

/**
 * Create a new booru, if special type, use that booru, else use default Booru
 *
 * @param booruSite The site to use
 * @param credentials The credentials to use, if any
 * @return A new booru
 */
function booruFrom(booruSite: Site, credentials?: BooruCredentials): Booru {
  return new (
    booruSite.type !== undefined && BooruTypes[booruSite.type]
      ? BooruTypes[booruSite.type]
      : Booru
  )(booruSite, credentials)
}

/**
 * Create a new booru to search with
 *
 * @constructor
 * @param {String} site The {@link Site} domain (or alias of it) to create a booru from
 * @param {*} credentials The credentials to use on this booru
 * @return {Booru} A booru to use
 */
function booruForSite(site: string, credentials: any = null): Booru {
  const rSite = resolveSite(site)

  if (!rSite) throw new BooruError('Site not supported')

  const booruSite = new Site(sites[rSite])

  // If special type, use that booru, else use default Booru
  return booruFrom(booruSite, credentials)
}

export { booruForSite as forSite }
export default booruForSite

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
export function search(
  site: string,
  tags: string[] | string = [],
  { limit = 1, random = false, page = 1, credentials }: SearchParameters = {},
): Promise<SearchResults> {
  const rSite: string | null = resolveSite(site)

  if (typeof limit === 'string') {
    limit = parseInt(limit, 10)
  }

  if (rSite === null) {
    throw new BooruError('Site not supported')
  }

  if (!Array.isArray(tags) && typeof tags !== 'string') {
    throw new BooruError('`tags` should be an array or string')
  }

  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    throw new BooruError('`limit` should be an int')
  }

  const booruSite = new Site(sites[rSite])

  if (!booruCache[rSite]) {
    booruCache[rSite] = booruFrom(booruSite)
  }

  return booruCache[rSite].search(tags, { limit, random, page, credentials })
}

export { Booru as BooruClass } from './boorus/Booru'
export { sites } from './Constants'
export { resolveSite } from './Utils'
export { BooruError } from './Constants'
export { Derpibooru, XmlBooru, Post, SearchResults, Site }
export type { BooruCredentials, SearchParameters }

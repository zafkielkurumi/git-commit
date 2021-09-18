/**
 *  from gitmoji cli
 */
import chalk from 'chalk'
import axios from 'axios'
import ora from 'ora'
import ProxyAgent from 'proxy-agent'

import cache from './emojisCache'

 const GITMOJIS_URL = 'https://gitmoji.dev/api/gitmojis'

export const getEmojis = async (
  skipCache: boolean = false
): Promise<Array<Object>> => {
  const emojisFromCache = cache.getEmojis()

  if (cache.isAvailable() && !skipCache) return emojisFromCache

  const spinner = ora('Fetching gitmojis').start()
  try {
    const agent = new ProxyAgent(process.env.https_proxy || process.env.http_proxy || undefined);
    const response = await axios.get(GITMOJIS_URL, {httpAgent: agent, httpsAgent: agent});
    const data: any =  response.data;
    const emojis = data.gitmojis;
    console.log(emojis, 'emojis')

    cache.createEmojis(emojis)

    if (emojis.length === emojisFromCache.length) {
      spinner.info('Gitmojis already up to date')

      return []
    }

    spinner.succeed('Gitmojis fetched successfully, these are the new emojis:')

    return emojis.filter((emoji) => !emojisFromCache.includes(emoji))
  } catch (error) {
    spinner.fail(`Error: ${error}`)

    return []
  }
}

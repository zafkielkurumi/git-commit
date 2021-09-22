/**
 *  from gitmoji cli
 */
import ora from "ora";
import ProxyAgent from "proxy-agent";
import fetch from 'node-fetch';
import cache from "./emojisCache";

const GITMOJIS_URL = "https://gitmoji.dev/api/gitmojis";

export const getEmojis = async (
  skipCache: boolean = false
): Promise<Array<Object>> => {
  const emojisFromCache = cache.getEmojis();
  if (cache.isAvailable() && emojisFromCache.length && !skipCache)
    return emojisFromCache;

  const spinner = ora("Fetching gitmojis").start();
  try {
    const agent = new ProxyAgent(
      process.env.https_proxy || process.env.http_proxy || undefined
    );
    const response = await fetch(GITMOJIS_URL, {agent})

    const data: any = await response.json();
    const emojis = data.gitmojis;

    cache.createEmojis(emojis);

    if (emojis.length === emojisFromCache.length) {
      spinner.info("Gitmojis already up to date");

      return [];
    }

    spinner.succeed("Gitmojis fetched successfully, these are the new emojis:");

    return emojis.filter((emoji) => !emojisFromCache.includes(emoji));
  } catch (error) {
    spinner.fail(`Error: ${error}`);

    return [];
  }
};

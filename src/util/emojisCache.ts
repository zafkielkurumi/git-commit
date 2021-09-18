/**
 *  from gitmoji cli
 */
import * as fs from 'fs';
import * as path from 'path'

export const GITMOJI_CACHE = {
  FOLDER: '.gitmoji',
  FILE: 'gitmojis.json'
}

export const CACHE_PATH = path.join(
  __dirname,
  GITMOJI_CACHE.FOLDER,
  GITMOJI_CACHE.FILE
)

const createEmojis = (emojis: Array<Object>): void => {
 
  if (!fs.existsSync(path.dirname(CACHE_PATH))) {
    fs.mkdirSync(path.dirname(CACHE_PATH))
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(emojis))
}

const getEmojis = (): Array<Object> => {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH).toString())
  } catch (error) {
    return []
  }
}

const isAvailable = (): boolean => fs.existsSync(CACHE_PATH)

export default {
  createEmojis,
  getEmojis,
  isAvailable
}
#!/usr/bin/env node

import inquirer from "inquirer";

import { COMMIT_TYPE_CHOICES } from "./constant";
import { Command } from "commander";
import { getEmojis } from "./util/getEmojis";
import execa from "execa";
import searchCheckbox from 'inquirer-search-checkbox'

inquirer.registerPrompt('search-checkbox', searchCheckbox)

function main() {
  const commit = new Command();
  commit
    .option("-s, --skip", "skip cache emoji, fetch gitemoji", false)
    .parse()
    const opts = commit.opts();
    gitCommit(opts.skip);
}

async function gitCommit(skipCache: boolean) {
  const res: any[] = await getEmojis(skipCache);
  const EMOJI_CHOICES = [
    {
      name: "无",
      value: "",
    },
    ...res.map((r) => ({
      name: `${r.emoji}${r.name} - ${r.description}`,
      value: r.code,
    })),
  ];
  inquirerPrompt(EMOJI_CHOICES);
}

async function inquirerPrompt(EMOJI_CHOICES) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "type",
        message: "git commit type",
        loop: false,
        choices: COMMIT_TYPE_CHOICES,
      },
      {
        type: "input",
        name: "scope",
        message: "git commit scope(作用范围",
      },
      {
        type: "input",
        name: "subject",
        message: "git commit subject(简短描述",
      },
      {
        type: "input",
        name: "option",
        message: "git commit option",
      },
      {
        type: "search-checkbox",
        name: "emoji",
        message: "git emoji",
        choices: EMOJI_CHOICES,
      },
    ])

    .then(async (r) => {
      console.log(
        `start git commit -m ${r.type}${r.scope ? "(" + r.scope + ")" : ""}:${
          r.subject
        }`
      );
      const [type, emoji] = (r.type as string).split("-");
      const emojis = [emoji, ...r.emoji].join(" ");
      const scope = r.scope ? `(${r.scope})` : "";
      await execa(
        "git",
        ["commit", "-m", `${type}${scope}:${emojis} ${r.subject}`],
        {
          stdio: "inherit",
          buffer: false,
        }
      );
    });
}

main();

#!/usr/bin/env node

import * as inquirer from "inquirer";
import { spawn, execFileSync,exec } from "child_process";
import * as path from "path";
import { COMMIT_TYPE_CHOICES } from "./constant";
import { Command } from "commander";
import { getEmojis } from "./util/getEmojis";
import emojisCache, { CACHE_PATH } from "./util/emojisCache";
import execa from 'execa';

  // const commit = new Command("commit");
  // commit
  //   .option("-s, --skip", "skip cache emoji, fetch gitemoji")
  //   .action((args) => {
  //     console.log(args);
  //     main();
  //     // inquirerPrompt();
  //   });

async function main() {

  const res: any[] = await getEmojis();
  const EMOJI_CHOICES = [
    {
      name: "默认",
      value: "",
    },
    ...res.map(r => ({ name: `${r.emoji}${r.name} - ${r.description}`, value: r.code})),
  ];
  inquirerPrompt(EMOJI_CHOICES)
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
        type: "checkbox",
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
      const [type, emoji] = (r.type as string).split('-');
      const emojis = [emoji, ...r.emoji].join(' ');
      console.log(path.join(__dirname, "./commit.sh"))
      // execFileSync(path.join(__dirname, "./commit.sh"), {
      //   stdio: 'inherit'
      // });
      const scope = r.scope? `(${r.scope})` : '';
      // await execa('git', ['commit', '-m', r.type], {
      //   stdio: "inherit",
      //   buffer: false,
      // });
      await execa('git', ['commit', '-m', `${type}${scope}:${emojis} ${r.subject}`], {
        stdio: "inherit",
        buffer: false,
      });
      // exec("bash", [
      //   path.join(__dirname, "./commit.sh"),
      //   type,
      //   r.scope,
      //   r.subject,
      //   emojis,
      //   r.option
      // ]);
    });
}

// function exec(cmd: string, args: any[]) {
//   return new Promise((resolve, reject) => {
//     console.log(`Started: ${cmd} ${args.join(" ")}`);
//     const app = spawn(cmd, args, { stdio: "inherit" });
//     app.on("close", (code) => {
//       if (code !== 0) {
//         const err: any = new Error(`Invalid status code: ${code}`);
//         err.code = code;
//         return reject(err);
//       }
//       return resolve(code);
//     });
//     app.on("error", reject);
//   });
// }




main();
import { execaCommand } from "execa";

/**
  * @param {string} mergeSha
  */
export async function commitsForMerge(mergeSha) {
  // This currently includes the history before the branch started,
  // so this is excessive
  // await execaCommand(`git log -m ${mergeSha}`);
  
  // last line + 1 is the number of commits to print 
  await execaCommand(`git rev-list --no-merges --count main ^${mergeSha}`);
  let numCommits = 0;
  await execaCommand(`git log ${mergeSha} -${numCommits + 1}`);
}

/**
  * @param {string} sinceTag
  * @param {string} [ branch ]
  */
export async function mergesToBranch(sinceTag, branch = 'main') {
  // https://stackoverflow.com/a/47213799/356849
  //  --first-parent
  //    skips commits from merged branches. This removes the entries where someone merged master into their branches.
  //  --merges 
  //   shows only "merge commits" (commits with more than 1 parent). Omit this argument if you want to see direct commits to your main branch.
  let { stdout } = await execaCommand(`git log ${sinceTag}..${branch} --first-parent --format='%H'`);

  return stdout.replace(new RegExp(`'`, 'g'), '').split('\n');
}

/**
  * @returns {Promise<string>}
  */
export async function getLatestTag() {
  // Examples:
  //   ember-resources@5.6.2
  //  (same output as git tag -l)
  let { stdout: tag } = await execaCommand(`git describe --abbrev=0`);

  return tag;
}

/** @type {import("lint-staged").Config} */
export default {
  // Lint then format TypeScript and JavaScript files
  "**/*.{ts,tsx,mjs,cjs,js,jsx,json,md,astro,svelte,vue,mdx,html,css,yaml,yml}": (filenames) => {
    const commands = getFilesByPackage(filenames).map(({ packageName, filenames }) => {
      return `pnpm turbo lint --filter=@social-sdk/${packageName} -- ${filenames.join(" ")}`;
    });

    return commands;
  },
};

const getFilesByPackage = (filenames) => {
  const filenameMap = {};

  filenames.forEach((fn) => {
    const matchApp = new RegExp(`/apps/(frontends|backends|infra)/(.+?)/`).exec(
      fn,
    );
    const matchPkg = new RegExp(`/packages/(.+?)/`).exec(fn);
    if (matchApp?.length > 0) {
      const appName = matchApp[2];
      if (filenameMap[appName]) {
        filenameMap[appName].push(fn);
      } else {
        filenameMap[appName] = [fn];
      }
    } else if (matchPkg?.length > 0) {
      const packageName = matchPkg[1];
      if (filenameMap[packageName]) {
        filenameMap[packageName].push(fn);
      } else {
        filenameMap[packageName] = [fn];
      }
    }
  });

  return Object.entries(filenameMap).map(([packageName, filenames]) => ({
    packageName,
    filenames,
  }));
};

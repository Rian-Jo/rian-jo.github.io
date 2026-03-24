export type LegacyWritingPathInput = {
  categorySegments: string[];
  date: Date;
  legacySlug: string;
};

const homeRedirects = new Map<string, string>([
  ['/home', '/'],
  ['/home/', '/'],
  ['/home/about', '/about/'],
  ['/home/about/', '/about/'],
  ['/home/publications', '/publications/'],
  ['/home/publications/', '/publications/'],
  ['/home/projects', '/projects/'],
  ['/home/projects/', '/projects/'],
]);

const pad = (value: number) => String(value).padStart(2, '0');

export function resolveHomeRedirect(pathname: string): string {
  if (homeRedirects.has(pathname)) {
    return homeRedirects.get(pathname)!;
  }

  if (pathname.startsWith('/home/projects/')) {
    return '/projects/';
  }

  if (pathname.startsWith('/home/publications/')) {
    return '/publications/';
  }

  return '/';
}

export function buildLegacyWritingPath(input: LegacyWritingPathInput): string {
  const year = input.date.getUTCFullYear();
  const month = pad(input.date.getUTCMonth() + 1);
  const day = pad(input.date.getUTCDate());
  const prefix = input.categorySegments.join('/');

  return `/${prefix}/${year}/${month}/${day}/${input.legacySlug}/`;
}

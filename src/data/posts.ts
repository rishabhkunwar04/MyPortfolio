export interface BlogPost {
  title: string;
  summary: string;
  url: string;
  topics: string[];
  cover?: string;
}

export const posts: BlogPost[] = [
  {
    title: '301 vs 302 for URL shorteners',
    summary: 'What happens when someone edits a short link after a browser has cached its redirect? Choosing an HTTP status code starts with whether the destination can change.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7527443088735105026/',
    topics: ['System design', 'Backend', 'HTTP'],
    cover: 'redirects',
  },
];

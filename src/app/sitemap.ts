import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shadcn-event-calendar.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs/architecture`,
      lastModified: new Date(),
    },
  ];
}

import packageJson from '~/../package.json';

const cleanUrl = 'https://gen-certificates.netlify.app';

const metadata = {
  website: {
    name: 'Certificados',
    slogan: 'Generar certificados',
    description: 'Open-source canvas drawing web application, built with TypeScript, React, and Next.js.',
    cleanUrl,
    url: `https://${cleanUrl}`,
    manifest: `https://${cleanUrl}/manifest.json`,
    thumbnail: `https://${cleanUrl}/images/thumbnail.jpg`,
    locale: 'en',
    themeColor: '#FFFFFF',
    version: packageJson.version,
  },
  social: {
    twitter: 'flatdraw',
  },
  links: {
    github: 'https://github.com/diogocapela/flatdraw',
  },
  services: {
    googleAnalyticsMeasurementId: 'G-1ZQW8YQT2J',
  },
};

export default metadata;

export default {
  resolve({ site, hierarchy, 'arc-site': arcSite }) {
    return `/site/v3/navigation/${site || arcSite}${hierarchy ? `?hierarchy=${hierarchy}` : ''}`;
  },
  schemaName: 'navigation-hierarchy',
  params: {
    site: 'text',
    hierarchy: 'text',
  },
};

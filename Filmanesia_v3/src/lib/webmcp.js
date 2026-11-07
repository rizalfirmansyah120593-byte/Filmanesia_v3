const modelContext = globalThis.navigator?.modelContext;

if (typeof modelContext?.registerTool === 'function') {
  modelContext.registerTool({
    name: 'search_filmanesia',
    description: 'Create a Filmanesia search link for movies and TV shows.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Movie or TV show title to search for.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    execute: ({ query }) => {
      const url = new URL('/search', globalThis.location.origin);
      url.searchParams.set('q', query);
      return {
        content: [{ type: 'text', text: `Search Filmanesia for “${query}”: ${url.href}` }],
        structuredContent: { query, url: url.href },
      };
    },
  });
}

const PROTOCOL_VERSION = '2025-11-25';
const TOOL_NAME = 'search_filmanesia';

function jsonRpcError(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function toolResult(query) {
  const url = new URL('/search', 'https://www.filmanesia.com');
  url.searchParams.set('q', query);
  return {
    content: [{ type: 'text', text: `Search Filmanesia for “${query}”: ${url.href}` }],
    structuredContent: { query, url: url.href },
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, MCP-Protocol-Version');
  res.setHeader('Access-Control-Expose-Headers', 'MCP-Session-Id');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Use POST for MCP JSON-RPC requests.' });
  }

  const request = req.body;
  if (!request || request.jsonrpc !== '2.0' || typeof request.method !== 'string') {
    return res.status(400).json(jsonRpcError(null, -32600, 'Invalid JSON-RPC request.'));
  }

  if (request.method === 'notifications/initialized') return res.status(202).end();

  let result;
  if (request.method === 'initialize') {
    result = {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: 'Filmanesia', version: '1.0.0' },
    };
  } else if (request.method === 'tools/list') {
    result = {
      tools: [{
        name: TOOL_NAME,
        description: 'Create a Filmanesia search link for movies and TV shows.',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string', description: 'Movie or TV show title to search for.', maxLength: 200 } },
          required: ['query'],
          additionalProperties: false,
        },
      }],
    };
  } else if (request.method === 'tools/call') {
    const { name, arguments: args = {} } = request.params || {};
    if (name !== TOOL_NAME) {
      result = { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
    } else if (typeof args.query !== 'string' || !args.query.trim() || args.query.length > 200) {
      result = { isError: true, content: [{ type: 'text', text: 'query must be a non-empty string of at most 200 characters.' }] };
    } else {
      result = toolResult(args.query.trim());
    }
  } else {
    return res.status(200).json(jsonRpcError(request.id ?? null, -32601, `Method not found: ${request.method}`));
  }

  if (request.id === undefined) return res.status(202).end();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({ jsonrpc: '2.0', id: request.id, result });
}

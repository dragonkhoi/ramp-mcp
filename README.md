# Ramp MCP

Simple MCP server that interfaces with the Ramp API, allowing you to talk to your Ramp data from any MCP client like Cursor or Claude Desktop.

I am adding more coverage of the Ramp API over time, let me know which tools you need or just open a PR.

## Installation

Make sure to go to your Ramp Settings to get a [Ramp API Key and Ramp Client ID](https://app.ramp.com/settings/ramp-developer).

### Installing via Smithery

To install mercury-mcp for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@dragonkhoi/mercury-mcp):

```bash
npx -y @smithery/cli install @dragonkhoi/mercury-mcp --client claude
```

To install mixpanel-mcp for Cursor, go to Settings -> Cursor Settings -> Features -> MCP Servers -> + Add

Select Type: command and paste the below, using the arguments `<API_KEY> <CLIENT_ID>` from Ramp

```
npx -y @smithery/cli@latest run @dragonkhoi/mercury-mcp --config "{\"mercury_api_key\":\"YOUR_MERCURY_API_KEY\",}"
```

### Clone and run locally

Clone this repo
Run `npm run build`
Paste this command into Cursor (or whatever MCP Client)
`node /ABSOLUTE/PATH/TO/ramp-mcp/build/index.js RAMP_API_KEY RAMP_CLIENT_ID`

## Examples

Ask "What are my latest credit card transactions"

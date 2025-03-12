import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GET_CREDIT_CARD_TRANSACTIONS_TOOL } from "./tools/transactions/get_credit_card_transactions.js";
import { GET_RAMP_STATEMENTS_TOOL } from "./tools/statements/get_ramp_statements.js";

const server = new McpServer({
  name: "ramp",
  version: "1.0.0",
});

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Please provide a Ramp API key and Client ID");
  process.exit(1);
}

const RAMP_API_KEY = process.env.RAMP_API_KEY || args[0] || "YOUR RAMP API KEY";
const RAMP_CLIENT_ID =
  process.env.RAMP_CLIENT_ID || args[1] || "YOUR RAMP CLIENT ID";

// Create base64 encoded credentials for Basic auth
const credentials = Buffer.from(`${RAMP_CLIENT_ID}:${RAMP_API_KEY}`).toString('base64');

const accessTokenURL = `https://api.ramp.com/developer/v1/token`;
const accessTokenResponse = await fetch(accessTokenURL, {
  method: "POST",
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials&scope=transactions:read",
});

const accessTokenData = await accessTokenResponse.json();
const accessToken = accessTokenData.access_token;

// Create a context object with the access token
const rampContext = {
  accessToken,
};

// Register tools with the context
const transactionsTool = GET_CREDIT_CARD_TRANSACTIONS_TOOL.withContext(rampContext);
const statementsTool = GET_RAMP_STATEMENTS_TOOL.withContext(rampContext);

// Register the tools with the server
server.tool(
  transactionsTool.name,
  transactionsTool.description,
  transactionsTool.inputSchema,
  transactionsTool.handler
);

server.tool(
  statementsTool.name,
  statementsTool.description,
  statementsTool.inputSchema,
  statementsTool.handler
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RAMP MCP SERVER RUNNING ON STDIO");
}

main().catch((error) => {
  console.error("Fatal error in main(): ", error);
  process.exit(1);
});

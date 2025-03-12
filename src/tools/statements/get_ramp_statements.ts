import { defineTool } from "../../utils/defineTool.js";
import { RampContext } from "../transactions/get_credit_card_transactions.js";

export const GET_RAMP_STATEMENTS_TOOL = defineTool<any, RampContext>((z) => ({
  name: "get_ramp_statements",
  description: "Retrieve Ramp statements with optional date filtering and pagination.",
  inputSchema: {
    from_date: z.string().optional().describe("Start date in ISO format (YYYY-MM-DD)"),
    to_date: z.string().optional().describe("End date in ISO format (YYYY-MM-DD)"),
    start: z.string().optional().describe("Token for pagination"),
    page_size: z.number().optional().describe("Number of results per page")
  },
  handler: async (input, context) => {
    // Build URL with query parameters
    const url = new URL("https://api.ramp.com/developer/v1/statements");
    
    // Add query parameters if provided
    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    // Set up request options
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${context.accessToken}`,
      },
    };

    // Make the API request
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  },
})); 
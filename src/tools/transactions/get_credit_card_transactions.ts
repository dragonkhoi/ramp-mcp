import { defineTool, ToolContext } from "../../utils/defineTool.js";

// Define the context type for Ramp API
export interface RampContext extends ToolContext {
  accessToken: string;
}

export const GET_CREDIT_CARD_TRANSACTIONS_TOOL = defineTool<any, RampContext>((z) => ({
  name: "get_credit_card_transactions",
  description: "Retrieve information about your Ramp credit card transactions.",
  inputSchema: {
    sk_category_id: z.string().optional(),
    department_id: z.string().uuid().optional(),
    limit_id: z.string().uuid().optional(),
    location_id: z.string().uuid().optional(), 
    merchant_id: z.string().uuid().optional(),
    card_id: z.string().uuid().optional(),
    statement_id: z.string().uuid().optional(),
    state: z.string().optional(),
    user_id: z.string().uuid().optional(),
    sync_ready: z.boolean().optional(),
    from_date: z.string().datetime().optional(),
    to_date: z.string().datetime().optional(),
    synced_after: z.string().datetime().optional(),
    min_amount: z.union([z.string(), z.number()]).optional(),
    has_no_sync_commits: z.boolean().optional(),
    max_amount: z.union([z.string(), z.number()]).optional(),
    trip_id: z.string().uuid().optional(),
    entity_id: z.string().uuid().optional(),
    requires_memo: z.boolean().optional(),
    include_merchant_data: z.boolean().optional(),
    order_by_amount_asc: z.boolean().optional(),
    order_by_amount_desc: z.boolean().optional(), 
    order_by_date_asc: z.boolean().optional(),
    order_by_date_desc: z.boolean().optional(),
    start: z.string().optional(),
    page_size: z.number().optional()
  },
  handler: async (input, context) => {
    // Build URL with query parameters
    const url = new URL("https://api.ramp.com/developer/v1/transactions");
    
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

import { 
  NetlifyEvent, 
  NetlifyContext, 
  NotionPage, 
  FetchPagesResponse, 
  ErrorResponse 
} from '../shared/models';
import { Bulletin_boardPages_DB } from '../shared/constants';

const handler = async (event: NetlifyEvent, context: NetlifyContext) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    // Get environment variables
    const NOTION_TOKEN = process.env.NOTION_TOKEN;

    if (!NOTION_TOKEN) {
      throw new Error('Missing required environment variable: NOTION_TOKEN');
    }

    // Notion API endpoint for querying database
    const url = `https://api.notion.com/v1/databases/${Bulletin_boardPages_DB}/query`;

    const notionHeaders = {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    };

    // Make request to Notion API
    const response = await fetch(url, {
      method: 'POST',
      headers: notionHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const responseData: FetchPagesResponse = {
      success: true,
      pages: data.results || [],
      count: data.results?.length || 0,
      message: 'Successfully fetched pages from Notion database'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    console.error('Error in fetch-pages function:', error);
    
    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Failed to fetch pages from Notion',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};

export { handler };

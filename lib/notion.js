import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
// console.log("Notion api key:", process.env.NOTION_API_KEY)

// Initialize NotionToMarkdown
const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * Fetches a page's content from Notion and converts it to Markdown.
 * @param {string} pageId - The Notion page ID.
 * @returns {Promise<string>} - The page content as a Markdown string.
 */
export async function getNotionPageContent(pageId) {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return mdString.parent || mdString;
  } catch (error) {
    console.error("Error fetching Notion page:", error);
    throw error;
  }
}

/**
 * Fetches page metadata (title, etc.) from Notion.
 * @param {string} pageId - The Notion page ID.
 * @returns {Promise<object>} - The page metadata.
 */
export async function getNotionPageMeta(pageId) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return page;
  } catch (error) {
    console.error("Error fetching Notion page metadata:", error);
    throw error;
  }
}

/**
 * Fetches all pages from a Notion database.
 * @param {string} databaseId - The Notion database ID.
 * @returns {Promise<Array>} - Array of database entries.
 */
export async function getNotionDatabase(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.error("Error fetching Notion database:", error);
    throw error;
  }
}

export { notion, n2m };

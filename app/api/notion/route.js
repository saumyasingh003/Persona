import { getNotionPageContent } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return NextResponse.json(
      { error: "Missing pageId parameter" },
      { status: 400 }
    );
  }

  try {
    const content = await getNotionPageContent(pageId);
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Notion API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Notion content" },
      { status: 500 }
    );
  }
}

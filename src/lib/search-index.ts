import { FAQ_CATEGORIES, NEWS_ARTICLES, PRODUCT_TABS } from "@/lib/boa-content";
import { PAGE_SEO } from "@/lib/seo-config";
import { FOOTER_LINKS, MAIN_NAV } from "@/lib/site-data";

export type SearchResultType = "page" | "faq" | "nav" | "news";

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  type: SearchResultType;
}

function uniqueKey(r: SearchResult) {
  return `${r.href}::${r.title}`;
}

function addPage(
  map: Map<string, SearchResult>,
  title: string,
  description: string,
  href: string,
  type: SearchResultType = "page"
) {
  const item: SearchResult = { title, description, href, type };
  map.set(uniqueKey(item), item);
}

/** Static index of searchable site content */
export function buildSearchIndex(): SearchResult[] {
  const map = new Map<string, SearchResult>();

  for (const page of Object.values(PAGE_SEO)) {
    addPage(map, page.title.replace(/\s*\|\s*AWS Vision$/, ""), page.description, page.path);
  }

  for (const item of MAIN_NAV) {
    addPage(map, item.label, `Browse ${item.label.toLowerCase()} banking and services`, item.href, "nav");
    for (const section of item.sections) {
      for (const link of section.links) {
        addPage(map, link.label, link.desc, link.href, "nav");
      }
    }
  }

  for (const group of Object.values(FOOTER_LINKS)) {
    for (const link of group) {
      addPage(map, link.label, `Go to ${link.label}`, link.href, "nav");
    }
  }

  for (const tab of PRODUCT_TABS) {
    addPage(map, tab.label, `AWS Vision ${tab.label}`, tab.href, "nav");
  }

  for (const cat of FAQ_CATEGORIES) {
    for (const item of cat.items) {
      addPage(map, item.q, item.a, "/faq", "faq");
    }
  }

  for (const article of NEWS_ARTICLES) {
    addPage(
      map,
      article.title,
      article.excerpt,
      `/news#${article.id}`,
      "news"
    );
  }

  addPage(map, "Sign In to Online Banking", "Access your accounts and investment portal", "/login");
  addPage(map, "Open an Account", "Apply for savings, fixed deposit, or investment accounts", "/signup");
  addPage(map, "Schedule Appointment", "Book a call with an AWS Vision specialist", "/contact#appointment");
  addPage(map, "Contact Support", "Phone, email, and secure message form", "/contact");
  addPage(map, "Help Center", "Browse help topics and popular questions", "/help");

  return Array.from(map.values());
}

export const SEARCH_INDEX = buildSearchIndex();

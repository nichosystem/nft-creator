import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Navigation } from "@/components/docs/Navigation";
import { Prose } from "@/components/docs/Prose";
import { slugifyWithCounter } from "@sindresorhus/slugify";
import Head from "next/head";
import { Hero } from "../Hero";
import { Header } from "../Header";
import { MarkdocNextJsPageProps } from "@markdoc/next.js";

const navigation = [
  {
    title: "Introduction",
    links: [
      { title: "Getting started", href: "/" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Core concepts",
    links: [
      { title: "Understanding caching", href: "/docs/understanding-caching" },
      {
        title: "Predicting user behavior",
        href: "/docs/predicting-user-behavior",
      },
      { title: "Basics of time-travel", href: "/docs/basics-of-time-travel" },
      {
        title: "Introduction to string theory",
        href: "/docs/introduction-to-string-theory",
      },
      { title: "The butterfly effect", href: "/docs/the-butterfly-effect" },
    ],
  },
  {
    title: "Advanced guides",
    links: [
      { title: "Writing plugins", href: "/docs/writing-plugins" },
      { title: "Neuralink integration", href: "/docs/neuralink-integration" },
      { title: "Temporal paradoxes", href: "/docs/temporal-paradoxes" },
      { title: "Testing", href: "/docs/testing" },
      { title: "Compile-time caching", href: "/docs/compile-time-caching" },
      {
        title: "Predictive data generation",
        href: "/docs/predictive-data-generation",
      },
    ],
  },
  {
    title: "API reference",
    links: [
      { title: "CacheAdvance.predict()", href: "/docs/cacheadvance-predict" },
      { title: "CacheAdvance.flush()", href: "/docs/cacheadvance-flush" },
      { title: "CacheAdvance.revert()", href: "/docs/cacheadvance-revert" },
      { title: "CacheAdvance.regret()", href: "/docs/cacheadvance-regret" },
    ],
  },
  {
    title: "Contributing",
    links: [
      { title: "How to contribute", href: "/docs/how-to-contribute" },
      { title: "Architecture guide", href: "/docs/architecture-guide" },
      { title: "Design principles", href: "/docs/design-principles" },
    ],
  },
];

function useTableOfContents(tableOfContents: any) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);

  let getHeadings = useCallback((tableOfContents: any) => {
    return tableOfContents
      .flatMap((node: any) => [
        node.id,
        ...node.children.map((child: any) => child.id),
      ])
      .map((id: any) => {
        let el = document.getElementById(id);
        if (!el) return;

        let style = window.getComputedStyle(el);
        let scrollMt = parseFloat(style.scrollMarginTop);

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      });
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    let headings = getHeadings(tableOfContents);
    function onScroll() {
      let top = window.scrollY;
      let current = headings[0].id;
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [getHeadings, tableOfContents]);

  return currentSection;
}

function getNodeText(node: any) {
  let text = "";
  for (let child of node.children ?? []) {
    if (typeof child === "string") {
      text += child;
    }
    text += getNodeText(child);
  }
  return text;
}

function collectHeadings(nodes: any, slugify = slugifyWithCounter()): any[] {
  let sections = [];

  for (let node of nodes) {
    if (node.name === "h2" || node.name === "h3") {
      let title = getNodeText(node);
      if (title) {
        let id = slugify(title);
        node.attributes.id = id;
        if (node.name === "h3") {
          if (!sections[sections.length - 1]) {
            throw new Error(
              "Cannot add `h3` to table of contents without a preceding `h2`"
            );
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          });
        } else {
          sections.push({ ...node.attributes, title, children: [] });
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify));
  }

  return sections;
}

export function Layout({
  pageProps,
  children,
}: {
  pageProps: MarkdocNextJsPageProps;
  children: React.ReactNode;
}) {
  let router = useRouter();
  let isHomePage = router.pathname === "/docs";
  let allLinks = navigation.flatMap((section) => section.links);
  let linkIndex = allLinks.findIndex((link) => link.href === router.pathname);
  let previousPage = allLinks[linkIndex - 1];
  let nextPage = allLinks[linkIndex + 1];
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === router.pathname)
  );

  let title = pageProps.markdoc?.frontmatter.title;

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} - NFT Creator Docs`;

  let description = pageProps.markdoc?.frontmatter.description;

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : [];

  let currentSection = useTableOfContents(tableOfContents);

  function isActive(section: any) {
    if (section.id === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>

      <Header />

      {isHomePage && <Hero />}
      <div className="max-w-8xl relative mx-auto flex justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
            <div className="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
            <div className="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block" />
            <Navigation />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            {(title || section) && (
              <header className="mb-9 space-y-1">
                {section && (
                  <p className="font-display text-sm font-medium text-sky-500">
                    {section.title}
                  </p>
                )}
                {title && (
                  <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
                    {title}
                  </h1>
                )}
              </header>
            )}
            <Prose>{children}</Prose>
          </article>
          <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
            {previousPage && (
              <div>
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link href={previousPage.href} passHref>
                    <div className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300">
                      <span aria-hidden="true">&larr;</span>{" "}
                      {previousPage.title}
                    </div>
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link href={nextPage.href} passHref>
                    <div className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300">
                      {nextPage.title} <span aria-hidden="true">&rarr;</span>
                    </div>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            {tableOfContents.length > 0 && (
              <>
                <h2
                  id="on-this-page-title"
                  className="font-display text-sm font-medium text-slate-900 dark:text-white"
                >
                  On this page
                </h2>
                <ol role="list" className="mt-4 space-y-3 text-sm">
                  {tableOfContents.map((section: any) => (
                    <li key={section.id}>
                      <h3>
                        <Link href={`#${section.id}`} passHref>
                          <span
                            className={clsx(
                              isActive(section)
                                ? "text-sky-500"
                                : "font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                            )}
                          >
                            {section.title}
                          </span>
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                        >
                          {section.children.map((subSection: any) => (
                            <li key={subSection.id}>
                              <Link href={`#${subSection.id}`} passHref>
                                <span
                                  className={
                                    isActive(subSection)
                                      ? "text-sky-500"
                                      : "hover:text-slate-600 dark:hover:text-slate-300"
                                  }
                                >
                                  {subSection.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

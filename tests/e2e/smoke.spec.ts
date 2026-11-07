import { expect, test, type Page } from "@playwright/test";

/** Collects uncaught page errors so each test can assert there were none. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** The preloader covers the page until its iris has opened. */
async function waitForPreloader(page: Page) {
  await expect(page.locator("[data-preloader]")).toHaveCount(0, { timeout: 20_000 });
}

test.describe("pages", () => {
  test("English home renders every section", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    for (const id of ["about", "shareholders", "governance", "links", "media", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.locator("#contact")).toContainText("info@smnpower.com");
    expect(errors).toEqual([]);
  });

  test("Arabic home is right-to-left and translated", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#about")).toContainText("ولكونها الشركة القابضة");
    expect(errors).toEqual([]);
  });

  test("every image on the home page loads", async ({ page }) => {
    const broken: string[] = [];
    page.on("response", (res) => {
      if (res.request().resourceType() === "image" && res.status() >= 400)
        broken.push(`${res.status()} ${res.url()}`);
    });
    await page.goto("/en");
    await waitForPreloader(page);
    // Lazy images: scroll the whole page so every one is requested.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    await page.waitForLoadState("networkidle");
    const unloaded = await page.$$eval("img", (imgs) =>
      imgs
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
    expect([...broken, ...unloaded]).toEqual([]);
  });

  test("an inner page shows 'coming soon', an unknown page is a 404", async ({ page }) => {
    await page.goto("/en/about/vision-mission");
    await expect(page.getByText("Coming soon", { exact: false }).first()).toBeVisible();

    const missing = await page.goto("/en/this-page-does-not-exist");
    expect(missing?.status()).toBe(404);
  });
});

test.describe("board of directors", () => {
  test("picking a tile swaps the bio, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/corporate-governance/board-of-directors");
    await waitForPreloader(page);

    const tiles = page.locator(".board-tile");
    const panel = page.locator(".board-panel");
    await expect(tiles).toHaveCount(8);
    await tiles.first().scrollIntoViewIfNeeded();
    await expect(panel).toContainText("Chairman");
    await expect(tiles.first()).toHaveAttribute("aria-pressed", "true");

    const david = tiles.filter({ hasText: "David Beaufays" });
    await david.click();
    await expect(david).toHaveAttribute("aria-pressed", "true");
    await expect(tiles.first()).toHaveAttribute("aria-pressed", "false");
    await expect(panel).toContainText("Vice Chairman");
    await expect(panel).toContainText("ING Bank");
    await expect(panel.locator("[data-panel-fade]").first()).toBeVisible();
    // The flying copy of the portrait is gone once it lands.
    await expect(page.locator(".board-ghost > *")).toHaveCount(0);

    // Picking again mid-change must not leave the panel half hidden.
    const imran = tiles.filter({ hasText: "Imran Sheikh" });
    const ruben = tiles.filter({ hasText: "Ruben Ramalho" });
    await imran.click();
    await ruben.click();
    await expect(panel).toContainText("Brookfield");
    await expect(panel.locator("[data-panel-photo]")).toBeVisible();
    await expect(page.locator(".board-ghost > *")).toHaveCount(0);

    await page.goto("/ar/corporate-governance/board-of-directors");
    await waitForPreloader(page);
    await expect(page.locator(".board-panel")).toContainText("رئيس مجلس الإدارة");
    expect(errors).toEqual([]);
  });
});

test.describe("management", () => {
  test("picking a tile swaps the bio, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/corporate-governance/management");
    await waitForPreloader(page);

    const tiles = page.locator(".board-tile");
    const panel = page.locator(".board-panel");
    await expect(tiles).toHaveText(["Boris Smondack", "Khalifa Al Kalbani", "Anupam Kunwar"]);
    await tiles.first().scrollIntoViewIfNeeded();
    await expect(panel).toContainText("Chief Executive Officer");

    await tiles.nth(1).click();
    await expect(tiles.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(panel).toContainText("Chief Financial Officer");
    // Both of the CFO's experience paragraphs.
    await expect(panel).toContainText("spans oil and gas");
    await expect(panel).toContainText("Oman Polypropylene");
    await expect(page.locator(".board-ghost > *")).toHaveCount(0);
    await expect(page.getByText("Coming soon")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/corporate-governance/management");
    await waitForPreloader(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.locator(".board-tile").nth(2).scrollIntoViewIfNeeded();
    await page.locator(".board-tile").nth(2).click();
    await expect(page.locator(".board-panel")).toContainText("الرئيس الفني");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("csr", () => {
  test("shows every section, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/csr");
    await waitForPreloader(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Commitment");
    await expect(page.getByText("Coming soon")).toHaveCount(0);
    await expect(page.locator("main h2")).toHaveCount(3);
    await expect(page.locator(".csr-component")).toHaveCount(4);
    await expect(page.locator(".csr-scroll")).toContainText("second edition of the forum");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/csr");
    await waitForPreloader(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".csr-scroll")).toContainText("النسخة الثانية من المنتدى");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("annual report", () => {
  test("links the latest edition and tags samples, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/investors/annual-report");
    await waitForPreloader(page);

    // The band's links stay hidden until it animates in.
    const latest = page.locator(".report-latest");
    await latest.scrollIntoViewIfNeeded();
    await expect(latest.getByRole("link", { name: /View the report/ })).toHaveAttribute(
      "href",
      /233399-Annual%20Report%202025_SMN_English%20final\.pdf$/,
    );
    await expect(latest.getByRole("link", { name: /Arabic edition/ })).toHaveAttribute(
      "href",
      /4326762-Annual%20Report%202025_SMN_Arabic%20final\.pdf$/,
    );
    await expect(latest).toContainText("112");

    // Samples are marked and go nowhere until a real PDF is added.
    const shelf = page.locator(".report-shelf-item");
    await expect(shelf).toHaveCount(6);
    await expect(page.locator(".report-shelf-sample")).toHaveCount(6);
    await expect(page.locator(".report-shelf a")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/investors/annual-report");
    await waitForPreloader(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.locator(".report-latest").scrollIntoViewIfNeeded();
    await expect(
      page.locator(".report-latest").getByRole("link", { name: /عرض التقرير/ }),
    ).toHaveAttribute("href", /4326762-Annual%20Report%202025_SMN_Arabic%20final\.pdf$/);
    await expect(page.locator(".report-latest")).toContainText("104");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });

  test("the investor menu opens the page, the footer card still opens the PDF", async ({
    page,
  }) => {
    await page.goto("/en");
    await waitForPreloader(page);
    await expect(page.locator('header a[href="/en/investors/annual-report"]')).toHaveCount(1);
    await expect(page.locator("footer a", { hasText: /annual report/i })).toHaveAttribute(
      "href",
      /233399-Annual%20Report%202025_SMN_English%20final\.pdf$/,
    );
  });
});

test.describe("dividends disclosures", () => {
  test("lists every payment, in both languages, without sideways scroll", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/investors/dividends-disclosures");
    await waitForPreloader(page);

    const table = page.locator(".dividend-table");
    await expect(table.locator("tbody tr")).toHaveCount(15);
    await expect(table.locator("tbody")).toHaveCount(10);
    await expect(table.locator("tbody tr").first()).toContainText("Apr 08, 2025");
    await expect(page.locator(".dividend-latest")).toContainText("Mar 26, 2025");
    await expect(page.locator(".dividend-latest")).toContainText("73.00");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/investors/dividends-disclosures");
    await waitForPreloader(page);
    await expect(page.locator(".dividend-table thead")).toContainText("تاريخ الاستقطاع");
    await expect(page.locator(".dividend-table tbody tr")).toHaveCount(15);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("msx discussion session", () => {
  test("picks and plays sessions, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/investors/msx-discussion-session");
    await waitForPreloader(page);

    const tiles = page.locator(".msx-tile");
    await expect(tiles).toHaveCount(9);
    await expect(page.locator(".msx-meta")).toContainText("30th June 2026");
    await expect(tiles.first()).toHaveAttribute("aria-pressed", "true");

    await page.locator("#sessions").scrollIntoViewIfNeeded();
    // Five years fit, so the timeline has nothing to slide to.
    await expect(page.locator(".msx-rail-arrow")).toHaveCount(0);

    // Tiles carry the session's full title, free of the live site's CMS leftovers.
    await expect(tiles.nth(4)).toContainText(
      "MSX discussion for the Six-month period ended 30th June 2024",
    );
    await expect(page.locator("#sessions")).not.toContainText(/\bH1\b|<br/);

    // A recording in the browser's own player. Stops the file from downloading in the test.
    await page.route("**/*.mp4", (route) => route.abort());
    const fy2023 = page.getByRole("button", { name: "MSX discussion for full year 2023" });
    await fy2023.click();
    await expect(fy2023).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".msx-stage video")).toHaveAttribute(
      "src",
      /Session-Financial2023-2024\.mp4$/,
    );
    await expect(page.locator(".msx-meta")).toContainText("full year 2023");

    // A Vimeo one, stepping back to it. Vimeo itself isn't loaded in the test.
    await page.route("**/player.vimeo.com/**", (route) => route.abort());
    await page.getByRole("button", { name: "Previous session" }).click();
    await page.getByRole("button", { name: "Previous session" }).click();
    await expect(page.locator(".msx-stage iframe")).toHaveAttribute(
      "src",
      /player\.vimeo\.com\/video\/1067305142/,
    );

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/investors/msx-discussion-session");
    await waitForPreloader(page);
    await expect(page.locator(".msx-meta")).toContainText("30 يونيو 2026");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors.filter((e) => !e.includes("vimeo"))).toEqual([]);
  });
});

test.describe("tenders", () => {
  test("filters, unfolds and links documents, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/tenders");
    await waitForPreloader(page);
    await page.locator("#tender-board").scrollIntoViewIfNeeded();

    const cards = page.locator(".tender-card");
    await expect(cards).toHaveCount(6);

    // A single-file open tender starts unfolded; the rest are closed until picked.
    const smnb = cards.filter({ hasText: "SMNB invitation" });
    await expect(smnb.getByRole("link", { name: /Invitation to independent/ })).toBeVisible();
    const spare = cards.filter({ hasText: "Sale of spare parts" });
    const tenderDoc = spare.getByRole("link", { name: "PDF Tender document" });
    await expect(tenderDoc).toBeHidden();
    await spare.getByRole("button").click();
    await expect(tenderDoc).toBeVisible();
    await expect(spare).toContainText("30 November 2025");
    await expect(spare.getByRole("link")).toHaveCount(4);

    // The filter narrows the board and says what it's showing.
    await page.getByRole("button", { name: /^02\s*Closed/ }).click();
    await expect(cards).toHaveCount(2);
    await page.getByRole("button", { name: /^04\s*Open/ }).click();
    await expect(cards).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    // Arabic gets its own edition of a file where one exists.
    await page.goto("/ar/tenders");
    await waitForPreloader(page);
    await expect(page.locator(".tender-card").first()).toContainText("دعوة للترشح");
    await expect(page.locator(".tender-card").first().locator("a")).toHaveAttribute(
      "href",
      /SMNB-Arabic\.pdf$/,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("investor menu", () => {
  test("sends Disclosures, Financial Reports and Share Price to MSX in a new tab", async ({
    page,
    isMobile,
  }) => {
    const errors = trackErrors(page);
    // Three items share one address, which must not trip React's duplicate key check.
    const consoleErrors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    await page.goto("/en");
    await waitForPreloader(page);
    const links = page.locator('header a[href="https://www.msx.om/snapshot.aspx?s=SMNP"]');
    await expect(links).toHaveCount(3);
    for (const name of ["Disclosures", "Financial Reports", "Share Price"]) {
      await expect(links.filter({ hasText: new RegExp(`^${name}$`) })).toHaveCount(1);
    }
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
    }
    if (isMobile) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      const drawer = page.getByRole("dialog");
      await drawer.getByRole("button", { name: /Investor/ }).click();
      await expect(drawer.getByRole("link", { name: "Share Price" })).toHaveAttribute(
        "href",
        "https://www.msx.om/snapshot.aspx?s=SMNP",
      );
    }
    expect(errors).toEqual([]);
    expect(consoleErrors.filter((text) => text.includes("same key"))).toEqual([]);
  });
});

test.describe("main shareholders", () => {
  test("tells both companies' stories without their logos, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/about/main-shareholders");
    await waitForPreloader(page);
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 2 })).toContainText([
      "Kahrabel F.Z.E.",
      "Mubadala Power Holding Company Limited",
    ]);
    await expect(main.locator("#kahrabel")).toContainText("International Power Ltd.");
    await expect(main.locator("#mubadala")).toContainText("Government of Abu Dhabi");
    // Not by role: the link stays hidden until it animates in.
    await expect(main.locator('#kahrabel a[href="https://www.engie.com"]')).toContainText(
      "www.engie.com",
    );
    // The client asked for no shareholder logos, on this page or in its photos.
    const sources = await main
      .locator("img")
      .evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).src).join(" "));
    expect(sources).not.toMatch(/engie|shareholder-kahrabel|images%2Flinks|images\/links/i);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    // The ownership line reaches the last owner by the end of the chapter.
    const lastOwner = main.locator("#kahrabel [data-chain-owner]").last();
    await page.evaluate(() => {
      const chapter = document.querySelector("#kahrabel") as HTMLElement;
      window.scrollTo(0, chapter.offsetTop + chapter.offsetHeight - innerHeight);
    });
    await expect(lastOwner).toHaveAttribute("data-lit", "");

    await page.goto("/ar/about/main-shareholders");
    await waitForPreloader(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("main")).toContainText("تشرف شركة كهربيل");
    // Arabic arrays fall back to English item by item, so nothing English may leak in.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("المؤسسون");
    await expect(page.locator("#mubadala .holder-figure-feature")).not.toContainText("US $");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("ethics", () => {
  test("shows all four principles and links the charter, in both languages", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/corporate-governance/ethics");
    await waitForPreloader(page);
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 3 })).toHaveText([
      "Compliance with laws & regulations",
      "Integrity",
      "Fairness and honesty",
      "Respect for others",
    ]);
    await expect(main.getByRole("link", { name: /View the Ethics Charter/ })).toHaveAttribute(
      "href",
      /ETHICS%20CHARTER.*\.pdf$/,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/corporate-governance/ethics");
    await waitForPreloader(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("main")).toContainText("تتمحور النزاهة حول");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });

  test("scrolling the stage moves through the principles", async ({ page, isMobile }) => {
    test.skip(isMobile, "The stage only pins on large screens");
    await page.goto("/en/corporate-governance/ethics");
    await waitForPreloader(page);
    await page.locator("#principles").scrollIntoViewIfNeeded();

    const steps = page.locator(".ethics-rail-step");
    await steps.nth(2).click();
    await expect(steps.nth(2)).toHaveAttribute("aria-current", "step");
    await expect(page.locator(".ethics-principle").nth(2)).toHaveCSS("opacity", "1");
    await expect(page.locator(".ethics-principle").nth(0)).toHaveCSS("opacity", "0");
  });
});

test.describe("contact", () => {
  test("offers the ways to reach SMN and the plant site maps, in both languages", async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await page.route("**/www.google.com/maps/**", (route) => route.abort());

    // The header's link now comes here rather than to the footer.
    await page.goto("/en/contact");
    await waitForPreloader(page);
    const main = page.getByRole("main");
    await expect(page.locator('a[href="/en/contact"]').first()).toBeAttached();

    await expect(main.getByRole("link", { name: "Call" })).toHaveAttribute(
      "href",
      "tel:+96824935800",
    );
    await expect(main.getByRole("link", { name: "Write an email" })).toHaveAttribute(
      "href",
      "mailto:info@smnpower.com",
    );
    // Asked for specifically: no copy controls anywhere on the page.
    await expect(main.getByRole("button", { name: /copy/i })).toHaveCount(0);
    await main.locator(".contact-office").scrollIntoViewIfNeeded();
    await expect(main).toContainText("E&Y Building, No. 1023");
    await expect(main.getByRole("link", { name: "Open in Google Maps" })).toHaveAttribute(
      "href",
      /23\.6171229/,
    );

    // A plant's site map loads only when asked for, then closes again.
    await expect(page.locator("iframe")).toHaveCount(0);
    const rusail = main.getByRole("button", { name: /Al Rusail power plant/ });
    await rusail.scrollIntoViewIfNeeded();
    await rusail.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("iframe")).toHaveAttribute("src", /1hSw_ZcTSRhIEXDerhIFR3mK_UD4/);
    // The map is the point of the dialog, so it has to be roomy and clear of the header.
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.width).toBeGreaterThan((viewport?.width ?? 0) * 0.5);
    const onTop = await dialog.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + 12);
      return !!hit && el.contains(hit);
    });
    expect(onTop).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);

    await page.goto("/ar/contact");
    await waitForPreloader(page);
    await expect(page.getByRole("main")).toContainText("بناية إرنست ويونج");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("our company map", () => {
  test("scrolls from the globe to a labelled Oman, then the explore cards", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/about/our-company");
    await waitForPreloader(page);

    const stage = page.locator(".oman-stage");
    const muscat = stage.getByText("MUSCAT");
    await stage.scrollIntoViewIfNeeded();
    await expect(muscat).toBeHidden();
    const hint = stage.locator(".oman-scroll-hint");
    await expect(hint).toHaveAttribute("data-shown");

    // The foot of the pinned track is the finished map.
    await page.evaluate(() => {
      const track = document.querySelector(".oman-stage")!.parentElement!;
      const end = track.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      window.scrollTo({ top: end, behavior: "instant" });
    });
    await expect(muscat).toBeVisible();
    await expect(hint).not.toHaveAttribute("data-shown");
    await expect(stage.getByText("Salalah")).toBeInViewport();

    // The cards fade in as they are reached.
    await page
      .locator("h2", { hasText: "Explore Further" })
      .evaluate((heading) => heading.scrollIntoView({ block: "center", behavior: "instant" }));
    const cards = page.getByRole("main").getByRole("link", {
      name: /Mission & Vision|Main Shareholders/,
    });
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toHaveAttribute("href", "/en/about/vision-mission");
    expect(errors).toEqual([]);
  });

  test("prompts on arrival, returns when the reader stalls, and the rail jumps", async ({
    page,
  }) => {
    const errors = trackErrors(page);
    await page.goto("/en/about/our-company");
    await waitForPreloader(page);

    const stage = page.locator(".oman-stage");
    const prompt = stage.locator(".oman-prompt");
    const rail = stage.getByRole("navigation", { name: "Map journey" });
    const scrollToProgress = (progress: number) =>
      page.evaluate((p) => {
        const track = document.querySelector(".oman-stage")!.parentElement!;
        const top = track.getBoundingClientRect().top + window.scrollY;
        const span = track.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + p * span, behavior: "instant" });
      }, progress);

    await scrollToProgress(0);
    await expect(prompt).toHaveAttribute("data-shown");
    await expect(prompt).toContainText("Scroll to travel to Oman");
    await expect(rail.getByRole("button", { name: "Our Sites" })).toBeVisible();

    // Gone as soon as they scroll; back once they have stopped for a moment.
    await scrollToProgress(0.15);
    await expect(prompt).not.toHaveAttribute("data-shown");
    await expect(prompt).toHaveAttribute("data-shown", "", { timeout: 8_000 });

    // The last step lands on the finished map.
    await rail.getByRole("button", { name: "Our Sites" }).click();
    await expect(stage.getByText("MUSCAT")).toBeVisible();
    await expect(rail.locator("[data-step]").last()).toHaveAttribute("data-reached");
    expect(errors).toEqual([]);
  });

  test("shows the finished map straight away with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/about/our-company");
    const stage = page.locator(".oman-stage");
    await stage.scrollIntoViewIfNeeded();
    await expect(stage.getByText("MUSCAT")).toBeVisible();
  });
});

test.describe("four-dot drawer", () => {
  test("shows the contact card only, then closes", async ({ page }) => {
    await page.goto("/en");
    await waitForPreloader(page);

    await page.getByRole("button", { name: "Open site menu" }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toContainText("Get in touch");
    await expect(drawer).toContainText("Office Tel:");
    await expect(drawer.getByRole("navigation")).toHaveCount(0);

    await drawer.getByRole("button", { name: "Close site menu" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("hamburger drawer", () => {
  test("is hidden on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/en");
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeHidden();
  });

  test("opens the full menu on mobile and navigates to a section", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/en");
    await waitForPreloader(page);

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).not.toContainText("Get in touch");

    await drawer.getByRole("button", { name: "About Us" }).click();
    await drawer.getByRole("link", { name: "Main Shareholders" }).click();

    await expect(page).toHaveURL(/\/en\/about\/main-shareholders$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

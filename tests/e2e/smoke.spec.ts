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

test.describe("our company map", () => {
  test("scrolls from the globe to a labelled Oman, then the explore cards", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/en/about/our-company");
    await waitForPreloader(page);

    const stage = page.locator(".oman-stage");
    const muscat = stage.getByText("MUSCAT");
    await stage.scrollIntoViewIfNeeded();
    await expect(muscat).toBeHidden();

    // The foot of the pinned track is the finished map.
    await page.evaluate(() => {
      const track = document.querySelector(".oman-stage")!.parentElement!;
      const end = track.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      window.scrollTo({ top: end, behavior: "instant" });
    });
    await expect(muscat).toBeVisible();
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

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("#shareholders")).toBeInViewport();
  });
});

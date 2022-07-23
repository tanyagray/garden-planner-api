import puppeteer, { ElementHandle } from "puppeteer";
import { KingsSeedsProduct } from "./product.model";

export const scrapeKingsSeedsProductList = async (pageNumber: number) => {
  const url = `https://www.kingsseeds.co.nz/cat_view.html?page=${pageNumber}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const totalPages: number = await page
    .$(".drop-select ul li:last-of-type")
    .then((el) => el as ElementHandle<HTMLUListElement>)
    .then((liElement) => liElement.evaluate((el) => +el.dataset.value));

  const productCards: ElementHandle<HTMLDivElement>[] = await page.$$(
    ".product-card"
  );
  const products: any[] = await Promise.all(
    productCards.map(async (cardEl) =>
      cardEl.evaluate(
        (el: HTMLDivElement): KingsSeedsProduct => {
          const titleLinkEl: HTMLLinkElement = el.querySelector(
            ".item-title a"
          );
          const descriptionEl: HTMLDivElement = el.querySelector(
            ".description"
          );

          return {
            sku: el.dataset.sku,
            name: titleLinkEl.innerText,
            url: titleLinkEl.getAttribute("href"),
            botanicalName: descriptionEl.innerText.replace(
              "Botanical Name: ",
              ""
            ),
          };
        }
      )
    )
  );

  await browser.close();

  return {
    pageNumber,
    totalPages,
    products,
  };
};

import {load} from "cheerio";
import { fetchPage, getProductIdFromRoute, isProductInCatalog, downloadImage } from "./utils.js";

const url = "https://www.velilla-group.com/es/velilla/alta-visibilidad";

const imgRoutes = [];

async function main(){

    let pageIndex = 1;
    let pagesCount = 1;
    do{

        const response = await fetchPage(url, pageIndex);
        const html = await response.text();

        let $ = load(html);
        
        if(pageIndex === 1){

            const pages = $(".pages-items li");
            pagesCount = pages.length -1 || 1; // -1 por el item con la flecha para ir al siguiente
        }

        console.log("PAGES: ", pagesCount);

        const listItems = $(".product-item .product-item-info a .product-image-container .product-image-wrapper img");
        
        listItems.each((idx, el) => {
            const text = $(el).attr('src');
            const productId = getProductIdFromRoute(text);
            if(isProductInCatalog(productId)){
                imgRoutes.push({
                    id: productId,
                    route: text,
                });
            }
        });

        pageIndex++;
    } while(pageIndex <= pagesCount)

    console.log(imgRoutes);
    imgRoutes.map(imgData => {
        downloadImage(imgData.route, './images/list', imgData.id);
    })
}

(async () => {
    await main();
})().catch(e => {
    // Deal with the fact the chain failed
    console.error(e);
});
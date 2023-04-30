import {load} from "cheerio";
import { fetchPage, getProductIdFromRoute, isProductInCatalog, downloadImage } from "./utils.js";
import puppeteer from "puppeteer";

const url = "https://www.velilla-group.com/es/velilla/alta-visibilidad";

const productData = [];

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
            const link = $(el).parent().parent().parent().attr('href');
            
            const productId = getProductIdFromRoute(text);
            if(isProductInCatalog(productId)){
                productData.push({
                    id: productId,
                    route: text,
                    link,
                });
                downloadImage(text, './images/list', productId);

            }
        });

        pageIndex++;
    } while(pageIndex <= pagesCount)

    console.log(productData);
    for(const product of productData){

    // productData.map(async data => {
        // REEMPLAZAR productData[0] por data al descomentar el bucle
        // downloadImage(product.route, './images/list', product.id);
        
        // Imágenes de listado descargadas 
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768});
        
        await page.goto(product.link);
        const colorSelector = '.swatch-option.image';
        
        const colorLinks = await page.$$(colorSelector);
        const colorIds = await page.$$eval(colorSelector, el => el.map(e => e.getAttribute('data-option-label')));
        console.log(colorLinks.length, colorIds)
        let cont = 0;
        for(const link of colorLinks){
        
            await link.click()
            const colorIdsParsed = colorIds[cont].split(' - ');
            const colorName = colorIdsParsed[0];
            const colorId = colorIdsParsed[1].replace('/','_');
            const route = await manageColorLink(page);
            const productPageData = {
                colorId, colorName, route
            }
            console.log(productPageData);
            downloadImage(route, './images/product', `${product.id}-${colorId}`)
            cont++;
        }

        // const result = await page.$eval('.swatch-option', el => {
        //     console.log(el.getAttribute('data-option-tooltip-value'));
        //     return el.getAttribute('data-option-tooltip-value');
        // });
        // page.click(colorSelector)
        // page.click(colorSelector)
        // console.log(result)
        console.log('no paramos');
        await browser.close();
    }



}

async function manageColorLink(page){
    
        
        // await page.waitForTimeout(4000);

        
        
        // const image = document.querySelector('.fotorama__stage__shaft .fotorama_vertical_ratio img.fotorama__img')
        // const imgXPath = `/html/body/div[@class="page-wrapper"]/main/div/div/div[@class="product-info-main"]/div[@class="product media"]/div[@class="gallery-placeholder"]/div[2]/div[2]/div[@class="fotorama__stage"]/div[@class="fotorama__stage__shaft fotorama__grab"]/div[1]/img`;
        const imgXPath = `/html/body/div[@class="page-wrapper"]/main/div/div/div[@class="product-info-main"]/div[@class="product media"]/div[@class="gallery-placeholder"]/div[2]/div[2]/div[@class="fotorama__stage"]/div[3]/div[1]/img`;
        await page.waitForXPath(imgXPath)
        const imgSrc = await page.evaluate(el => el.getAttribute('src'), (await page.$x(imgXPath))[0])
        // console.log(imgSrc);
        
        // const imgSrc = image[0].src;
        // console.log("data:", {
        //     colorName, colorId, imgSrc
        // });

        return imgSrc;
        // console.log("data:", {
        //      imgSrc
        // })
    //     console.log('EEEEEEEº',link);
    //     // await page.waitForSelector(colorSelector);
    //     await page.focus(colorSelector)
    //     console.log('EEEEEEE1',link);
    //     await page.click(link);
    //     console.log('EEEEEEE2',link);
    };


(async () => {
    await main();
})().catch(e => {
    // Deal with the fact the chain failed
    console.error(e);
});
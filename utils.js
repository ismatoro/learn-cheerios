import fetch from 'node-fetch';
import fs from 'fs';

export function fetchPage(url, page){
    const finalURL = page === 1 ? `${url}` : `${url}?p=${page}`;
    console.log('Calling...', finalURL)
    return fetch(finalURL, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "mage-banners-cache-storage=%7B%7D; country_code=ES; _ga=GA1.2.242891435.1671312063; _gid=GA1.2.770819688.1671312063; _gat_UA-61942008-1=1; form_key=Wbsy6TNxdS3sq2D2; mage-cache-storage=%7B%7D; mage-cache-storage-section-invalidation=%7B%7D; mage-cache-sessid=true; searchsuiteautocomplete=%7B%7D; recently_viewed_product=%7B%7D; recently_viewed_product_previous=%7B%7D; recently_compared_product=%7B%7D; recently_compared_product_previous=%7B%7D; product_data_storage=%7B%7D; mage-messages="
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    });
}

export async function downloadImage(imageUrl, path, imageName) {
    fetch(imageUrl)
        .then(res =>
            res.body.pipe(fs.createWriteStream(`${path}/${imageName}.jpg`))
        )
}


export function getProductIdFromRoute(photoURL) {
    const [route, params ]= photoURL.split('.jpg');
    const photoName = route.split('/').pop();
    return photoName.split('_')[0];
}

export function isProductInCatalog(productId){
    const IDS = ["14001","141","144","145","146","148","151","153","154","155","157","159","161","165","166","173","175","179","183","205904","301001","303002S","303007","305506","305513","305515","305701","305901","306001","306003","B-450A","707001","707002","707003","707004","707005","707006","940-P","042-W","043W","040-P","033-P","910-C","902-c","012-W","001-P","NITPF","200","584001","584002","584003","66","70","72","74","76","78","79","411-","105502-","105503-","105508S-","105509S-","11","3","301","303","350","351","391","403001","403002S","403003S","403004S","403005S","403006","403007","403008","404002","404004","404006","404007","404008","404201","404202","404203","404204","404205","404206","404207","404208","404209","404210B","404211B","404212","404213","405002","405003","405004S","405005S","405006S","405007S","405008","405009","405010","405011","405012S","405013S","405014S","405015S","405201","405202TC","405203TC","405204","405205","405206","405207","405208","405208A","405209","405210","405501","405502","405503","405504","410","411","417","432","434","4S","5","51","52","529-","531-","535203","538","539","56","90","CABERNET","ENELDO","LAUREL","LISTAN","MACIS","MACIS_RY","MELISA","MERLOT","OREGANO_00","OREGANO_50","OREGANO_52","PIMENTON","SUBIRAT","TREPAT","VIURA","253001","254002","254201","255201","255901","256001","259001","7","705","9","91","93","103002S","103004","103006","103008S","103011","103011B","103012S","103015S","103022S","105501","105502","105503","105504","105505","105506","105508S","105509S","105514","105515","105701","105703","105704","106002S","108","11501","187","19000","195","201502","201504","204001","204002","205902","206001","206002","206003","206004","206009","208","214","256","290","342","343","344","345","346","349","380","5010","520","522","529","531","532","533","645","700","700P","907","908","COBRE","MONCAYO","NIQUEL","PLOMO","707501","319","333","334","336","533001","533005","533006S","533007","534001","534007","535201","535202","535203-","535205","535206S","535207","539001","539002","539003","539004","539005","539006S","539007S","539008S","539009S","579","585","587","588","589","590","599","800","952","306002","305902","80","82","404005","VAINILLA","404001","105507","201","MASC"];
    return IDS.findIndex(el => el === productId) !== -1
}
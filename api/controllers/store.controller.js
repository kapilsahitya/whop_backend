const db = require("../config/db.config");
const enc = require("../utils/myencrypt");
const helper = require("../utils/myfunction");

exports.createStore = async(req,res) => {
    console.log("req.body", req.body);

    const seller_id = req.body?.infoz?.seller_id;
    const store_name = req.body?.infoz?.name;
    const store_tagline = req.body?.infoz?.prod_tagline;
    const store_info = req.body?.infoz?.prod_info;
    const fb = req.body?.infoz?.facebooklink;
    const insta = req.body?.infoz?.instagramlink;
    const yt = req.body?.infoz?.youtubelink;
    const twit = req.body?.infoz?.twitterlink;

    const qry1 = `insert into store_mst (seller_id, name, tagline, info, facebook, instagram, youtube, twitter, is_active) values (${seller_id} ,'${store_name}', '${store_tagline}', '${store_info}', '${fb}', '${insta}', '${yt}', '${twit}', 1);`; 
    db.query(qry1, (err, result) => {
        if(!err)
        {
            const storeId = result.insertId;
            if(req.body.products && req.body.products.length)
            {
                const products = req.body.products;
                // console.log("products", products);
                products.map((product, index) => {
                    db.query(`insert into product_mst (cat_id, seller_id, store_id, name, base_price, prod_info, prod_type, prod_link) values (${product.product_cat}, ${seller_id}, ${storeId}, '${product.product_name}', ${product.price}, '${product.product_desc}', '${product.product_type}', '${product.product_link}' )`, (err, result)=>{
                        if(!err)
                        {
                            console.log(`Product ${index} added`);
                        }
                        else{
                            console.log("err", err);
                            return; 
                        }
                    })
                })
                console.log("Products Added!")
            }
            // console.log("last store id", result.insertId);
        }
        else{
            console.log("err", err)
        }
    })  
}
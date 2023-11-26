const Product = require('../models/products');

const getAllProducts = async(req, res) => {
    const { company, name, featured, sort, select} = req.query;

    const queryObject = {};

    if (company) {
        queryObject.company = company;
    }

    if (featured) {
        queryObject.featured = featured;
    }

    if (name) {
        queryObject.name = { $regex : name, $options: "i" };
    }

    let apiData = Product.find(queryObject);
    
    if (sort) {
        let sortFix = sort.replace(",", " ");
        apiData = apiData.sort(sortFix);
    }

    if (select) {
        // let selectFix = sort.replace(",", " ");
        let selectFix = select.split(",").join(" ");
        apiData = apiData.select(selectFix);
    }

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
    let skip = (page - 1) * limit;
    console.log("page", page, "limit",limit)
    //page = 2;
    //limit = 3;
    //skip = 1 * 3 = 3

    apiData = apiData.skip(skip).limit(limit);


    const Products = await apiData
    res.status(200).json({Products, nbHits: Products.length });
};

const getAllProductsTesting = async(req, res) => {
    const myData = await Products.find(req.query).skip();
    res.status(200).json({myData});
};


module.exports = { getAllProducts, getAllProductsTesting };
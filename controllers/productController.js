const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures');


// Get products - /api/v1/products
exports.getProducts = catchAsyncError(async (req,res,next)=>{
    const resPerPage = 2;
    const apiFeatures = new APIFeatures(Product.find(),req.query).search().filter().paginate(resPerPage);

    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count : products.length,
        products
    }) 
});


// create product - /api/v1/products/new
exports.newProduct = catchAsyncError(async (req,res,next)=>{

    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    }) 
});

// Get Single Product - /api/v1/products/:id
exports.getSingleProduct = catchAsyncError(async (req,res,next)=> {
    const product = await Product.findById(req.params.id);

    if (!product){
       return next(new ErrorHandler('Product Not Found',400));
    }

    res.status(201).json({
        success : true,
        product
    })
})

//Update Product - /api/v1/products/:id
exports.updateProduct = async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if (!product){
        return res.status(404).json({
            success : false,
            message : "product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators: true
    })

    res.status(200).json({
        success : true,
        product
    })

}


//Delete Product
exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    try {
      await Product.deleteOne({ _id: productId }); // Use deleteOne() instead of remove()
      res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Deleting product failed!' });
    }
  }
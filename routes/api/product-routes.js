const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  const products = await Product.findAll({
    include: Category
  })

  res.json(products);
});

// get one product
router.get('/:product_id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const id = req.params.product_id;
  const product = await Product.findByPk(id, {
    include: [
      { model: Category },
      { model: Tag }
    ]
  });
  res.json(product);
});


//!this post route isnt working!
// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body)
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);

  } catch (error) {
    console.log('Product POST error:', error);

    res.status(500).json(error);

  }
});

//!this one is returning an array w a Number?!
// update product
router.put('/:id', async (req, res) => {
  // update product data

  try {
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })

    if (req.body.tagIds && req.body.tagIds.length) {

      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      })
      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      // run both actions
      // return Promise.all([
      await ProductTag.destroy({ where: { id: productTagsToRemove } })
      await ProductTag.bulkCreate(newProductTags)
      // ]);

    }

    return res.json(product);

  } catch (error) {
    // console.log(err);
    console.log(' Product PUT route error:', error)
    res.status(400).json(error);
  };
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  await Product.destroy({
    where: {
      id: req.params.id
    }
  })
  res.json({
    message: 'product deleted'
  })

});

module.exports = router;

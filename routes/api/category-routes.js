const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  const categories = await Category.findAll({
    include: Product
  });
  // be sure to include its associated Products

  res.json(categories);
});

router.get('/:category_id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const id = req.params.category_id;
  const category = await Category.findByPk(id, {
    include: Product
  })

  res.status(200).json(category);
});

router.post('/', async (req, res) => {
  // create a new category
  const formData = req.body;

  await Category.create(formData);

  res.json({
    message: 'Category created successfully.'
  });
});

//! this did not work in insomnia
router.put('/:category_id', async (req, res) => {
  // update a category by its `id` value
  const category = await Category.update(
    request.body,
    {
      where: req.params.category_id
    }
  )

  res.json(category);
});

router.delete('/:category_id', async (req, res) => {
  // delete a category by its `id` value
  await Category.destroy({
    where: {
      id: req.params.category_id
    }
  })
  res.json({
    message: 'category deleted.'
  })
});

module.exports = router;

const router = require('express').Router();
const { response } = require('express');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const tags = await Tag.findAll({
    include: Product
  });

  res.json(tags);

});

router.get('/:tag_id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const id = req.params.tag_id;
  const tag = await Tag.findByPk(id, {
    include: Product
  });

  res.json(tag);
});


router.post('/', async (req, res) => {
  // create a new tag
  const formData = req.body;

  const tag = await Tag.create(formData);

  res.json({
    message: 'new tag created.',
    tag
  });
});

router.put('/:tag_id', async (req, res) => {
  // update a tag's name by its `id` value
  const tag = await Tag.update(
    req.body, {
    where: {
      id: req.params.tag_id
    }
  }
  );
  res.json(tag);
});

router.delete('/:tag_id', async (req, res) => {
  // delete on tag by its `id` value
  await Tag.destroy({
    where: {
      id: req.params.tag_id
    }
  });

  res.json({
    message: 'tag deleted'
  })
});

module.exports = router;

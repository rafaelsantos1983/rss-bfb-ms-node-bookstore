import express from 'express';

const router = express.Router();

router.get('/api/books/online', (req, res) => {
  res.send('[book] Online');
});

export { router as onlineRouter };

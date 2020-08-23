import express from 'express';

const router = express.Router();

router.get('/api/stores/online', (req, res) => {
  res.send('[store] Online');
});

export { router as onlineRouter };

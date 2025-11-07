import express from 'express';
import { getCart, addToCart, removeFromCart, checkout ,} from '../controllers/cartController.js';
import { updateCartItem } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.put('/update/:id', updateCartItem);
router.delete('/:id', removeFromCart);
router.post('/checkout', checkout);

export default router;
// 2. Configuration du client Stripe (dans un fichier stripe.js)
import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = loadStripe('pk_test_51QRZeURxBBzO6509o9wgswut9ldsACIgbZA5MuGzw7tjS8U24Af6Crfz8cGWYOpy1mcij607zISfAK1iui1Zbx0T00v5InE5Io');
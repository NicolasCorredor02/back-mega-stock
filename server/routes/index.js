import express from 'express';
import { Router } from "express";
import products from "./product.route.js";

const router = Router()

/**
 * Get de Home Page
 */
router.get('/', (req, res) => {
    res.send(`<div style='height: 100%; width: 100%; text-align: center; font-size: 2em'>
        <h1>!Bienvenido a la API de Mega-Stock!</h1>
        <p>Para ver los productos ve a <a href="http://localhost:8080/api/products">/api/products</a></p>
        </div>`)
})

router.use("/api/products", products)

export default router
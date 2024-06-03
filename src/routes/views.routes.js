import { Router } from "express";
import productManager from "../productManager.js";
import { io } from "../app.js";

const router = Router();

//Obtener todos los productos (OBTENER /)
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Obtener página de productos en tiempo real (GET /realtimeproducts)
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Agregar producto (POST /productos en tiempo real)
router.post("/realtimeproducts", async (req, res) => {
  try {
    const { title, price, description } = req.body;
    await productManager.addProduct({ title, price, description });
    const products = await productManager.getProducts();
    io.emit("products", products);

    res.render("realTimeProducts");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Eliminar producto (BORRAR /realtimeproducts)
router.delete("/realtimeproducts", async (req, res) => {
  try {
    const { id } = req.body;
    await productManager.deleteProduct(Number(id));
    const products = await productManager.getProducts();
    io.emit("products", products);

    res.render("realTimeProducts");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
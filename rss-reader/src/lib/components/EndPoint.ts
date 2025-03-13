import express, { Request, Response } from 'express';
import pool from './db'; // Importa la conexión a la base de datos

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para obtener todos los registros de una tabla
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items'); // Cambia "items" por el nombre de tu tabla
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
});

// Endpoint para crear un nuevo registro
app.post('/api/items', async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ id: (result as any).insertId, name, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el registro' });
  }
});

// Endpoint para actualizar un registro
app.put('/api/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query(
      'UPDATE items SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    res.json({ id, name, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el registro' });
  }
});

// Endpoint para eliminar un registro
app.delete('/api/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el registro' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
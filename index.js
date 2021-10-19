const express = require('express');
const productsRouter = require('./routes/productsRouter');
const ErrorController = require('./controllers/ErrorController');

const PORT = 3000;
const app = express();
app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use('/products', productsRouter);

app.use(ErrorController);

app.listen(PORT, () => { console.log(`Ouvindo a porta ${PORT}`); });

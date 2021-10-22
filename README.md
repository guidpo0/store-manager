### Informações Gerais

Projeto desenvolvido durante formação em desenvolvedor Web Full Stack pela Trybe.

---

# Boas vindas ao repositório do projeto Store Manager!

Neste projeto foi desenvolvida uma API utilizando a arquitetura MSC (Model, Service, Controller) aplicando os padrões RESTful. A API trata-se de um sistema de gerenciamento de vendas, onde é possível criar, visualizar, deletar e atualizar produtos e vendas.

Lembrando que esta aplicação corresponde aos meus esforços para melhorar minhas hard skills e soft skills, sinta-se à vontade para explorá-la! Feedbacks construtivos são sempre bem vindos!

Abaixo você poderá encontrar mais informações técnicas sobre este projeto.

---

# Sumário

- [Habilidades](#habilidades)
- [Instruções para testar a aplicação localmente
](#intruções-para-testar-a-aplicação-localmente)
- [Informações do projeto](#informações-do-projeto)
  - [Linter](#linter)
  - [Testes](#Testes)
    - [e2e](#e2e)
    - [unit](#unit)
  - [Banco de Dados](#Banco-de-Dados)
    - [Tabelas](#tabelas)
  - [Desenvolvimento](#Desenvolvimento)
- [Padrões e Conexões](#padrões-e-conexões)
  - [Endpoints da API](#endpoints-da-api)
  - [Mensagens de erro](#mensagens-de-erro)

---

# Habilidades

Nesse projeto, fui capaz de:

- Entender o funcionamento da camada de Model;
- Delegar responsabilidades específicas para essa camada;
- Conectar sua aplicação com diferentes bancos de dados;
- Estruturar uma aplicação em camadas;
- Delegar responsabilidades específicas para cada parte do seu app;
- Melhorar manutenibilidade e reusabilidade do seu código;
- Entender e aplicar os padrões REST;
- Escrever assinaturas para APIs intuitivas e facilmente entendíveis.

---

# Instruções para testar a aplicação localmente

1. Faça o fork do repositório

2. Instale as dependências do projeto
  * Instale as dependências:
    * `npm install`

3. Para realizar testes locais:
  * Comentar a linha 7 no /models/connection.js;
  * Descomentar a linha 8 no /models/connection.js;

---

# Informações do projeto

## Linter

Para garantir a qualidade do código de forma a tê-lo mais legível, de mais fácil manutenção e seguindo as boas práticas de desenvolvimento foi utilizado neste projeto o linter `ESLint`.

Você pode também instalar o plugin do `ESLint` no `VSCode`, basta ir em extensions e baixar o [plugin `ESLint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

## Testes

### e2e

Para este projeto a Trybe forneceu os testes e2e.

Foi utilizado o [Jest](https://jestjs.io/docs/getting-started) e o [Frisby](https://docs.frisbyjs.com/) para fazer os testes de api.

Para poder executar os testes e2e basta executar o comando `npm test` e o resultado será igual o abaixo:

![Testes](./public/testejestfrisby.png)

### unit

Para este projetos foram desenvolvidos testes unitários para as camadas MSC.

Foram utilizados o [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/) e [sinon](https://sinonjs.org/releases/latest/) para escrevê-los.

Para poder executar os testes unitários basta executar o comando `npm run test:mocha`.

## Banco de Dados

O banco de dados utilizado é não relacional e será utilizado o MongoDB.

### Tabelas

O banco possui duas tabelas: produtos e vendas.

A tabela de produtos possui o seguinte nome: `products`

Os campos da tabela `products` possuem esse formato:

```json
{ "name": "Produto Silva", "quantity": 10 }
```

A resposta do insert que deve retornar após a criação é parecida com essa:

```json
{ "_id": ObjectId("5f43cbf4c45ff5104986e81d"), "name": "Produto Silva", "quantity": 10 }
```

(O \_id será gerado automaticamente)

A tabela de vendas possui o seguinte nome: `sales`

Os campos da tabela `sales` possuem esse formato:

```json
{ "itensSold": [{ "productId": "5f43cbf4c45ff5104986e81d", "quantity": 2 }] }
```

A resposta do insert que deve retornar após a criação é parecida com essa:

```json
{
  "_id": ObjectId("5f43cc53c45ff5104986e81e"),
  "itensSold": [{ "productId": "5f43cbf4c45ff5104986e81d", "quantity": 2 }]
}
```

(O \_id será gerado automaticamente)

## Desenvolvimento

Neste projeto as seguintes stacks foram utilizadas no desenvolvimento:

- [Node.js](https://nodejs.org/en/docs/)

- [Express.js](https://expressjs.com/pt-br/)

- [MongoDB Node Driver](https://docs.mongodb.com/drivers/node/current/)

- [Joi](https://joi.dev/api/?v=17.4.2)

- [Express Rescue](https://www.npmjs.com/package/express-rescue)

---

# Padrões e Conexões

## Endpoints da API

### http://localhost:3000/products

- Método GET:

O retorno da API será:

```json
{
  products: [
    {
      "_id": "5f43a7ca92d58904914656b6",
      "name": "Produto do Batista",
      "quantity": 100
    },
    ...
  ],
}
```

- Método POST:

O endpoint deve receber a seguinte estrutura:

```json
{
  "name": "product_name",
  "quantity": "product_quantity"
}
```

  - `name` deve ser uma _string_ com mais de 5 caracteres;
  - `quantity` deve ser um número inteiro maior que 0;

O retorno da API de um produto cadastrado com sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

### http://localhost:3000/products/:id

- Método GET

O retorno da API em caso de sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

- Método PUT

O endpoint deve receber a seguinte estrutura:

```json
{
  "name": "product_name",
  "quantity": "product_quantity"
}
```

  - `name` deve ser uma _string_ com mais de 5 caracteres;
  - `quantity` deve ser um número inteiro maior que 0;

O retorno da API de um produto cadastrado com sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

- Método DELETE

O retorno da API em caso de sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "name": "Produto do Batista",
  "quantity": 100
}
```

### http://localhost:3000/sales

- Método GET

O retorno da API será:

```json
{
  sales: [
    {
      "_id": "5f43a7ca92d58904914656b6",
      "itensSold": [
        {
          "productId": "1f33a7ca92d58904914655a2",
          "quantity": 10,
        },
        ...
      ],
    },
    ...
  ],
}
```

- Método POST

O endpoint deve receber a seguinte estrutura:

```json
[
  {
    "productId": "1f33a7ca92d58904914655a2",
    "quantity": 10,
  },
  ...
]
```

  - `quantity` deve ser um número inteiro maior que 0 e deve ser menor ou igual a quantidade disponível do produto;

O retorno da API de uma venda cadastrada com sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "itensSold": [
    {
      "productId": "1f33a7ca92d58904914655a2",
      "quantity": 10,
    },
    ...
  ],
}
```

### http://localhost:3000/sales/:id

- Método GET

O retorno da API em caso de sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "itensSold": [
    {
      "productId": "1f33a7ca92d58904914655a2",
      "quantity": 10,
    },
    ...
  ],
}
```

- Método PUT

O endpoint deve receber a seguinte estrutura:

```json
[
  {
    "productId": "1f33a7ca92d58904914655a2",
    "quantity": 10,
  },
  ...
]
```

  - `quantity` deve ser um número inteiro maior que 0 e deve ser menor ou igual a quantidade disponível do produto;


O retorno da API de uma venda cadastrada com sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "itensSold": [
    {
      "productId": "1f33a7ca92d58904914655a2",
      "quantity": 10,
    },
    ...
  ],
}
```

- Método DELETE

O retorno da API em caso de sucesso será:

```json
{
  "_id": "5f43a7ca92d58904914656b6",
  "itensSold": [
    {
      "productId": "1f33a7ca92d58904914655a2",
      "quantity": 10,
    },
    ...
  ],
}
```

## Mensagens de erro

Em caso de algum erro ocorrer durante alguma requisição, a API retorna o status HTTP adequado e o body no seguinte padrão:
`{ err: { message: 'Dados inválidos', code: <código do erro> } }`.

---

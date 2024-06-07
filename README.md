# Desafio Técnico: API de Clima, Tempo e Notícias

## Objetivo

Desenvolver uma API que integre múltiplas fontes de dados para apresentar informações de clima, tempo e notícias de diferentes regiões do Brasil.

O projeto visa consolidar os conhecimentos adquiridos no módulo 3, envolvendo PostgreSQL e consumo de APIs externas.

## Descrição

O desafio consiste em dois principais scripts:

1. **Script de Captura de Dados**: Este script será responsável por capturar informações de diferentes APIs e armazená-las no banco de dados.
2. **API de Consulta**: Esta API permitirá a consulta dos dados armazenados, com suporte à paginação.

### Script de Captura de Dados

1. **Entrada**: Uma lista de CEPs em um arquivo de texto.
2. **Processamento**:
    - Utilizei a [Zip Code Base API](https://app.zipcodebase.com/) para obter informações sobre o CEP, incluindo cidade, bairro, estado, latitude e longitude.
    - Usar a [API de Clima e Tempo](https://api.openweathermap.org) para obter os dados meteorológicos com base na latitude e longitude.
    - Utilizar uma API de notícias, como a [News API](https://newsapi.org), para obter notícias baseadas na cidade e estado.
3. **Armazenamento**: Os dados devem ser processados e armazenados em um banco de dados PostgreSQL.

### API de Consulta

1. **Requisição**: O usuário fornecerá um CEP.
2. **Resposta**: A API retornará as informações de clima, tempo e notícias, ordenadas por data e paginadas.

## Estrutura do Projeto

### Requisitos

- Node.js
- PostgreSQL
- Biblioteca `pg` para PostgreSQL no Node.js
- APIs externas (Brasil API, OpenWeather API, News API)


### Banco de Dados

Estrutura das tabelas sugerida:

- **CEPs**
  - id (PK)
  - cep (Unique)
  - cidade
  - bairro
  - estado
  - latitude
  - longitude

- **Clima**
  - id (PK)
  - cep_id (FK)
  - temperatura
  - descricao
  - data_hora

- **Noticias**
  - id (PK)
  - cep_id (FK)
  - titulo
  - descricao
  - url
  - data_hora
  - foto_de_capa

### Rodando o Script de Captura de Dados

1. Execute o script com `node capture.js`.
2. O script lerá a lista de CEPs do arquivo, consultará as APIs e armazenará os dados no banco de dados.

### API de Consulta

1. Inicie o servidor com `node server.js`.
2. A API estará disponível em `http://localhost:3000`.

### Endpoints da API

- `GET /dados?cep={cep}&page={page}&limit={limit}`
  - Retorna os dados de clima, tempo e notícias para o CEP informado, com paginação.

### Paginação

Paginação é o processo de dividir um conjunto de resultados em partes menores, ou "páginas". Isso é útil para lidar com grandes volumes de dados, facilitando a navegação e melhorando a performance.

Exemplo de implementação de paginação:

```javascript
app.get('/dados', async (req, res) => {
  const { cep, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const result = await db.query(`
    SELECT *
    FROM dados
    WHERE cep = $1
    ORDER BY data_hora DESC
    LIMIT $2 OFFSET $3
  `, [cep, limit, offset]);

  res.json(result.rows);
});
```

## Considerações Finais

- Certifique-se de lidar com erros de forma adequada (ex.: CEP inválido, falha na API externa).
- Documente seu código e siga boas práticas de desenvolvimento.

Bom desafio e boa sorte!

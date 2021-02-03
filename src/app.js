const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json({repositories});
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 1
  };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if(isUuid(id)){
    const findedRepositoryIndex = repositories.findIndex(repository => repository.id === id);
    const { title, url, techs } = request.body;
    repositories[findedRepositoryIndex] = { ...repositories[findedRepositoryIndex], title, url, techs};
    return response.json(repositories[findedRepositoryIndex]);
  }else{
    return response.status(404).json({message : "repository not found"});
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const findedRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(isUuid(id) && findedRepositoryIndex != -1){
    repositories.splice(findedRepositoryIndex, 1);
    return response.status(204).send();
  }else{
    return response.status(404).json({message : "repository not found"});
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const findedRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(isUuid(id) && findedRepositoryIndex != -1){
    let { likes } = repositories[findedRepositoryIndex];
    likes ++;
    repositories[findedRepositoryIndex] = { ...repositories[findedRepositoryIndex], likes };
    return response.json(repositories[findedRepositoryIndex]);
  }else{
    return response.status(404).json({message : "repository not found"});
  }
});

module.exports = app;

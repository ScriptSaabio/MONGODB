require ("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {type} = require("os");
const path = require("path");
const app = express();


app.use(express.urlencoded({ extended: true }));

const alunosSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true },
    idade: { type: Number, required: true },
    curso: { type: String, required: true }
});

const Aluno = mongoose.model("Aluno", alunosSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/alunos", async (req, res) => {
    try {
        await Aluno.create({nome: req.body.nome, idade: req.body.idade, curso: req.body.curso});
        res.status(201).send("Aluno cadastrado com sucesso!");
        res.redirect("/alunos");
    } catch (error) {
        res.status(400).send("Erro ao cadastrar aluno: " + error.message);
    }
});

app.get("/alunos", async (req, res) => {
    try {
        const alunos = await Aluno.find();
        res.json(alunos);
    } catch (error) {
        res.status(500).send("Erro ao buscar alunos: " + error.message);
    }
});

async function iniciar() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbname: "Mongo04" });
        console.log("Conectado ao MongoDB");
        app.listen(5000, () => {
            console.log(`Servidor rodando na porta 5000: http://localhost:5000`);
        });
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB:", err.message);
    }
}

iniciar();
package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Fornecedor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import br.com.EchoVision.EchoVision.repository.FornecedorRepository;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/fornecedor")
public class FornecedorController {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @GetMapping("/")
    public List<Fornecedor> encontrarTodosFornecedor() {
        return fornecedorRepository.findAll();
    }

    @PostMapping(value = "/salvar", produces = "application/json")
    public Fornecedor create(@RequestBody Fornecedor dados) {
        return fornecedorRepository.save(dados);
    }
}
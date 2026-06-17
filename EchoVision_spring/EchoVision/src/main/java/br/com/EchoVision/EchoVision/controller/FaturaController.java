package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Fatura;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import br.com.EchoVision.EchoVision.repository.FaturaRepository;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/fatura")
public class FaturaController {

    @Autowired
    private FaturaRepository faturaRepository;

    @GetMapping("/")
    public List<Fatura> encontrarTodosFatura() {
        return faturaRepository.findAll();
    }

    @PostMapping(value = "/salvar", produces = "application/json")
    public Fatura create(@RequestBody Fatura dados) {
        return faturaRepository.save(dados);
    }
}

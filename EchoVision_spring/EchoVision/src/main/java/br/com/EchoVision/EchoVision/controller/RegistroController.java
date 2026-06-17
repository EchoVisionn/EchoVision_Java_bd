package br.com.EchoVision.EchoVision.controller;


import br.com.EchoVision.EchoVision.models.Registro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import br.com.EchoVision.EchoVision.repository.RegistroRepository;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/registro")
public class RegistroController {

    @Autowired
    private RegistroRepository registroRepository;

    @GetMapping("/")
    public List<Registro> encontrarTodosRegistro() {
        return registroRepository.findAll();
    }

    @PostMapping(value = "/salvar", produces = "application/json")
    public Registro create(@RequestBody Registro dados) {
        return registroRepository.save(dados);
    }
}
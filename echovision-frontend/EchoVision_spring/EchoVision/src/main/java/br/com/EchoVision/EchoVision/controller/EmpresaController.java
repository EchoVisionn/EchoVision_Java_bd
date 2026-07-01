package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Empresa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import br.com.EchoVision.EchoVision.repository.EmpresaRepository; 
import java.util.List;

@RestController
@CrossOrigin 
@RequestMapping("/empresa") // Define o prefixo para as URLs da API, assim fica mais organizado e fácil de entender
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository; 
    
    @GetMapping("/")
    public List<Empresa> encontrarTodasEmpresas(){ // Ajustado nome do método para camelCase
        return empresaRepository.findAll(); 
    }

    // Endpoint para criar um novo registro
    @PostMapping(value = "/salvar", produces = "application/json")
    public Empresa create(@RequestBody Empresa dados) {
        return empresaRepository.save(dados); 
    }
}

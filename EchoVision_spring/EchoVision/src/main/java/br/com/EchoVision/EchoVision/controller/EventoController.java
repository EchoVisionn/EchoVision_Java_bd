package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Evento;
import br.com.EchoVision.EchoVision.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/evento")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    // Rota para cadastrar um novo evento associado a uma empresa
    @PostMapping(value = "/salvar", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Evento> criarEvento(@RequestBody Evento evento) {
        // Salva o evento amarrado com o objeto empresa que o React vai enviar
        Evento novoEvento = eventoRepository.save(evento);
        return ResponseEntity.ok(novoEvento);
    }

    // Rota para buscar todos os eventos (Alimenta a tela inicial/Galeria do app) bem... ainda vamos utilizar isso em breve, se quiser pode fazer frank
    @GetMapping(produces = "application/json")
    public ResponseEntity<List<Evento>> listarTodosEventos() {
        List<Evento> eventos = eventoRepository.findAll();
        return ResponseEntity.ok(eventos);
    }
}
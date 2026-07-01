package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Ingresso;
import br.com.EchoVision.EchoVision.repository.IngressoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/ingresso")
public class IngressoController { 

    @Autowired
    private IngressoRepository ingressoRepository;

    @PostMapping(value = "/comprar", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Ingresso> comprarIngresso(@RequestBody Ingresso ingresso) {

        ingresso.setDataIng(LocalDate.now());
        ingresso.setValiIng(LocalDateTime.now().plusDays(30)); // Válido por 30 dias

        Ingresso novoIngresso = ingressoRepository.save(ingresso);
        return ResponseEntity.ok(novoIngresso);
    }
}
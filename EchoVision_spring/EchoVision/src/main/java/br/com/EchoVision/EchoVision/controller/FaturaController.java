package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Fatura;
import br.com.EchoVision.EchoVision.repository.FaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/faturas")
@CrossOrigin(origins = "*") // Permite a conexão direta com o seu Front-End em React
public class FaturaController {

    @Autowired
    private FaturaRepository faturaRepository;

    // 1. LISTAR TODAS AS FATURAS (Histórico geral de compras do app)
    @GetMapping
    public List<Fatura> listarTodas() {
        return faturaRepository.findAll();
    }

    // 2. BUSCAR UMA FATURA ESPECÍFICA POR ID (Para abrir os detalhes de um cupom/recibo)
    @GetMapping("/{id}")
    public ResponseEntity<Fatura> buscarPorId(@PathVariable Integer id) {
        Optional<Fatura> fatura = faturaRepository.findById(id);
        if (fatura.isPresent()) {
            return ResponseEntity.ok(fatura.get());
        }
        return ResponseEntity.notFound().build();
    }

    // 3. GERAR NOVA FATURA (Chamado quando o usuário finaliza a compra no React)
    @PostMapping
    public ResponseEntity<Fatura> criarFatura(@RequestBody Fatura fatura) {
        Fatura novaFatura = faturaRepository.save(fatura);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaFatura);
    }
}
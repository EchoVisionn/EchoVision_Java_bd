package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Fornecedor;
import br.com.EchoVision.EchoVision.repository.FornecedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fornecedores")
@CrossOrigin(origins = "*") // Deixa o React fazer requisições sem erro de CORS
public class FornecedorController {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    // 1. LISTAR TODOS OS FORNECEDORES
    @GetMapping
    public List<Fornecedor> listarTodos() {
        return fornecedorRepository.findAll();
    }

    // 2. BUSCAR FORNECEDOR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Fornecedor> buscarPorId(@PathVariable Integer id) {
        Optional<Fornecedor> fornecedor = fornecedorRepository.findById(id);
        if (fornecedor.isPresent()) {
            return ResponseEntity.ok(fornecedor.get());
        }
        return ResponseEntity.notFound().build();
    }

    // 3. CADASTRAR NOVO FORNECEDOR
    @PostMapping
    public ResponseEntity<Fornecedor> cadastrar(@RequestBody Fornecedor fornecedor) {
        Fornecedor novoFornecedor = fornecedorRepository.save(fornecedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoFornecedor);
    }

    // 4. DELETAR FORNECEDOR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (!fornecedorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        fornecedorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Registro;
import br.com.EchoVision.EchoVision.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/registros")
@CrossOrigin(origins = "*") // Permite que o front-end React acesse sem problemas de segurança
public class RegistroController {

    @Autowired
    private RegistroRepository registroRepository;

    // 1. LISTAR TODOS OS REGISTROS DE PRESENÇA
    @GetMapping
    public List<Registro> listarTodos() {
        return registroRepository.findAll();
    }

    // 2. BUSCAR UM REGISTRO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Registro> buscarPorId(@PathVariable Integer id) {
        Optional<Registro> registro = registroRepository.findById(id);
        if (registro.isPresent()) {
            return ResponseEntity.ok(registro.get());
        }
        return ResponseEntity.notFound().build();
    }

    // 3. REGISTRAR ENTRADA/PRESENÇA (Acionado pelo botão do QR Code no React)
    @PostMapping
    public ResponseEntity<Registro> criarRegistro(@RequestBody Registro registro) {
        Registro novoRegistro = registroRepository.save(registro);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRegistro);
    }
}
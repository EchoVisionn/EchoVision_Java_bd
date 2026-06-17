package br.com.EchoVision.EchoVision.controller;

import br.com.EchoVision.EchoVision.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import br.com.EchoVision.EchoVision.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@CrossOrigin 
@RequestMapping("/usuario") 
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository; 

    @GetMapping("/")
    public List<Usuario> encontrarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    // Endpoint para criar um novo registro
    @PostMapping(value = "/salvar", produces = "application/json")
    public Usuario create(@RequestBody Usuario dados) {
        return usuarioRepository.save(dados);
    }

    // Endpoint para validar o Login
    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody Usuario dados) {
        java.util.Optional<Usuario> usuarioDb = usuarioRepository.buscarPorEmail(dados.getEmail_user());

        // Verifica se o e-mail existe no banco
        if (usuarioDb.isEmpty()) {
            return ResponseEntity.status(401).body("{\"erro\": \"E-mail não encontrado!\"}");
        }

        //  Verifica se a senha bate com a do banco
        if (!usuarioDb.get().getSenha_user().equals(dados.getSenha_user())) {
            return ResponseEntity.status(401).body("{\"erro\": \"Senha incorreta!\"}");
        }

        //  Se tudo der certo, retorna o usuário logado com status 200 (OK) ai é gg
        return ResponseEntity.ok(usuarioDb.get());
    }

    // Endpoint para ATUALIZAR um usuário existente
    @PutMapping(value = "/atualizar/{id}", produces = "application/json")
    public ResponseEntity<?> atualizarUsuario(@PathVariable int id, @RequestBody Usuario dadosAtualizados) {
        // 1. Buscamos o usuário pelo ID
        java.util.Optional<Usuario> usuarioDb = usuarioRepository.findById(id);

        //  Se o usuário NÃO existir, já barramos aqui e retornamos o erro 404 esse é basic
        if (usuarioDb.isEmpty()) {
            return ResponseEntity.status(404).body("{\"erro\": \"Usuário não encontrado!\"}");
        }

        //Se ele existir, extraímos o registro do banco
        Usuario usuarioExistente = usuarioDb.get();

        // Atualizamos os atributos com os novos dados vindos do React
        usuarioExistente.setUser_name(dadosAtualizados.getUser_name());
        usuarioExistente.setEmail_user(dadosAtualizados.getEmail_user());
        usuarioExistente.setSenha_user(dadosAtualizados.getSenha_user());
        usuarioExistente.setCpf_user(dadosAtualizados.getCpf_user());

        //    Salvamos a modificação no MySQL
        Usuario usuarioSalvo = usuarioRepository.save(usuarioExistente);

        //  Retornamos o usuário atualizado com status 200 (OK)
        return ResponseEntity.ok(usuarioSalvo);
    }

    // Endpoint para DELETAR um usuário pelo ID
    @DeleteMapping(value = "/deletar/{id}", produces = "application/json")
    public ResponseEntity<?> deletarUsuario(@PathVariable int id) {
        //  Verificamos se o usuário existe no banco
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.status(404).body("{\"erro\": \"Usuário não encontrado para exclusão!\"}");
        }

        //  Se existir, deletamos usando o ID fornecido na URL
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok("{\"mensagem\": \"Usuário deletado com sucesso do banco EchoVision!\"}");
    }
}


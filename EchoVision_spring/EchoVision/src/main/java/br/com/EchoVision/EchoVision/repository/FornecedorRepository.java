package br.com.EchoVision.EchoVision.repository;

import br.com.EchoVision.EchoVision.models.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Integer> {
    // O Spring Boot já cria todos os métodos de salvar, listar e deletar usando o id_for automaticamente!
}
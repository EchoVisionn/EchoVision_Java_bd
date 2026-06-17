package br.com.EchoVision.EchoVision.repository; 

import br.com.EchoVision.EchoVision.models.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {
}
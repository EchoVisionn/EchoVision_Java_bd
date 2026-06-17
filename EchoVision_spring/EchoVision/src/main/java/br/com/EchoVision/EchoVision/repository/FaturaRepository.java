package br.com.EchoVision.EchoVision.repository; 

import br.com.EchoVision.EchoVision.models.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaturaRepository extends JpaRepository<Fatura, Long> {
}
package br.com.EchoVision.EchoVision.repository;

import br.com.EchoVision.EchoVision.models.Ingresso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngressoRepository extends JpaRepository<Ingresso, Integer> {
}
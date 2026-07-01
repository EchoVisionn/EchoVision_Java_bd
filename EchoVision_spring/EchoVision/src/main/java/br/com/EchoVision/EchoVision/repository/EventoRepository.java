package br.com.EchoVision.EchoVision.repository;

import br.com.EchoVision.EchoVision.models.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {
}
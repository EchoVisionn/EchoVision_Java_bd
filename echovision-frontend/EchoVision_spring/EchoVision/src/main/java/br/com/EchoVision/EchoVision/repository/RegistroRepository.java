package br.com.EchoVision.EchoVision.repository;

import br.com.EchoVision.EchoVision.models.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Integer> {
}
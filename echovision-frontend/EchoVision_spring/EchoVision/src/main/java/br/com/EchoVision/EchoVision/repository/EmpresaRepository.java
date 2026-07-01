package br.com.EchoVision.EchoVision.repository;

import br.com.EchoVision.EchoVision.models.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
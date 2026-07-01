package br.com.EchoVision.EchoVision.repository;

import br.com.EchoVision.EchoVision.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param; 
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    @Query("SELECT u FROM Usuario u WHERE u.email_user = :email")
    Optional<Usuario> buscarPorEmail(@Param("email") String email);
}
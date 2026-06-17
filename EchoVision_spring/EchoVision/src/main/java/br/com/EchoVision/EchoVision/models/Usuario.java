package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuario")


public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private int id_user;

    private String cpf_user;
    private String user_name;
    private String email_user;
    private String senha_user;

    public int getId_user() {
        return id_user;
    }

    public void setId_user(int id_user) {
        this.id_user = id_user;
    }

    public String getCpf_user() {
        return cpf_user;
    }

    public void setCpf_user(String cpf_user) {
        this.cpf_user = cpf_user;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getEmail_user() {
        return email_user;
    }

    public void setEmail_user(String email_user) {
        this.email_user = email_user;
    }

    public String getSenha_user() {
        return senha_user;
    }

    public void setSenha_user(String senha_user) {
        this.senha_user = senha_user;
    }
}

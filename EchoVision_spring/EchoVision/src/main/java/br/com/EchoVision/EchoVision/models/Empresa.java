package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Empresa")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_emp")
    private int id_emp;

    private String nm_emp;
    private String cnpj_emp;
    private String email_emp;
    private String tel_emp;
    private String token_emp;
    private String end_emp;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_emp", nullable = false)
    private StatusEmp status_emp = StatusEmp.ATIVO;

    // --- GETTERS E SETTERS ---
    public int getId_emp() { return id_emp; }
    public void setId_emp(int id_emp) { this.id_emp = id_emp; }

    public String getNm_emp() { return nm_emp; }
    public void setNm_emp(String nm_emp) { this.nm_emp = nm_emp; }

    public String getCnpj_emp() { return cnpj_emp; }
    public void setCnpj_emp(String cnpj_emp) { this.cnpj_emp = cnpj_emp; }

    public String getEmail_emp() { return email_emp; }
    public void setEmail_emp(String email_emp) { this.email_emp = email_emp; }

    public String getTel_emp() { return tel_emp; }
    public void setTel_emp(String tel_emp) { this.tel_emp = tel_emp; }

    public String getToken_emp() { return token_emp; }
    public void setToken_emp(String token_emp) { this.token_emp = token_emp; }

    public String getEnd_emp() { return end_emp; }
    public void setEnd_emp(String end_emp) { this.end_emp = end_emp; }

    // Ajustado para refletir o nome correto
    public StatusEmp getStatus_emp() { return status_emp; }
    public void setStatus_emp(StatusEmp status_emp) { this.status_emp = status_emp; }
}
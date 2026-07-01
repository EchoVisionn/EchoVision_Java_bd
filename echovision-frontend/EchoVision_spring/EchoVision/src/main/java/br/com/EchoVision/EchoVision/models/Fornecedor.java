package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Fornecedor")

public class Fornecedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_for")
    private int id_for;

    private String nm_for;
    private char cnpj_for;
    private String setor_for;
    private String andar_for;
    private String email_for;
    private char tel_for;

    public int getId_for() {
        return id_for;
    }

    public void setId_for(int id_for) {
        this.id_for = id_for;
    }

    public String getNm_for() {
        return nm_for;
    }

    public void setNm_for(String nm_for) {
        this.nm_for = nm_for;
    }

    public char getCnpj_for() {
        return cnpj_for;
    }

    public void setCnpj_for(char cnpj_for) {
        this.cnpj_for = cnpj_for;
    }

    public String getSetor_for() {
        return setor_for;
    }

    public void setSetor_for(String setor_for) {
        this.setor_for = setor_for;
    }

    public String getAndar_for() {
        return andar_for;
    }

    public void setAndar_for(String andar_for) {
        this.andar_for = andar_for;
    }

    public String getEmail_for() {
        return email_for;
    }

    public void setEmail_for(String email_for) {
        this.email_for = email_for;
    }

    public char getTel_for() {
        return tel_for;
    }

    public void setTel_for(char tel_for) {
        this.tel_for = tel_for;
    }





}

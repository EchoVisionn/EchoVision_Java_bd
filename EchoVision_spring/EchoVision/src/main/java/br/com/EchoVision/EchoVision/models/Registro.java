package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Registro_Presenca")

public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reg")
    private int id_reg;

    private LocalDate ent_reg;
    private LocalDate sai_reg;
    private boolean pres_reg;

    public int getId_reg() {
        return id_reg;
    }

    public void setId_reg(int id_reg) {
        this.id_reg = id_reg;
    }

    public LocalDate getEnt_reg() {
        return ent_reg;
    }

    public void setEnt_reg(LocalDate ent_reg) {
        this.ent_reg = ent_reg;
    }

    public LocalDate getSai_reg() {
        return sai_reg;
    }

    public void setSai_reg(LocalDate sai_reg) {
        this.sai_reg = sai_reg;
    }

    public boolean isPres_reg() {
        return pres_reg;
    }

    public void setPres_reg(boolean pres_reg) {
        this.pres_reg = pres_reg;
    }
}

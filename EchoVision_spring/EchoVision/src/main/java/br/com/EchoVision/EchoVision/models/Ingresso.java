package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;
import java.math.BigDecimal; 
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Ingresso")
public class Ingresso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ing")
    private Integer idIng;

    @Column(name = "valor_ing", nullable = false)
    private BigDecimal valorIng; 

    @Column(name = "desc_ing")
    private String descIng;

    @Column(name = "vali_ing")
    private LocalDateTime valiIng;

    @Column(name = "data_ing")
    private LocalDate dataIng;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_ing")
    private TipoIng tipoIng; 

    @Enumerated(EnumType.STRING)
    @Column(name = "dig_fis")
    private DigFis digFis; 

    //  Relacionamento com Evento (fk_id_Even no banco)
    @ManyToOne
    @JoinColumn(name = "fk_id_Even", nullable = false)
    private Evento evento;

    //Relacionamento com Usuário (fk_id_user no banco)
    @ManyToOne
    @JoinColumn(name = "fk_id_user", nullable = false)
    private Usuario usuario;

    // --- GETTERS E SETTERS ---

    public Integer getIdIng() { return idIng; }
    public void setIdIng(Integer idIng) { this.idIng = idIng; }

    public BigDecimal getValorIng() { return valorIng; } // 🔥 Atualizado para BigDecimal
    public void setValorIng(BigDecimal valorIng) { this.valorIng = valorIng; }

    public String getDescIng() { return descIng; }
    public void setDescIng(String descIng) { this.descIng = descIng; }

    public LocalDateTime getValiIng() { return valiIng; }
    public void setValiIng(LocalDateTime valiIng) { this.valiIng = valiIng; }

    public LocalDate getDataIng() { return dataIng; }
    public void setDataIng(LocalDate dataIng) { this.dataIng = dataIng; }

    public TipoIng getTipoIng() { return tipoIng; }
    public void setTipoIng(TipoIng tipoIng) { this.tipoIng = tipoIng; }

    public DigFis getDigFis() { return digFis; }
    public void setDigFis(DigFis digFis) { this.digFis = digFis; }

    public Evento getEvento() { return evento; }
    public void setEvento(Evento evento) { this.evento = evento; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
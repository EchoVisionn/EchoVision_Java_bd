package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_even")
    private int id_even;

    @Column(nullable = false, length = 50)
    private String nm_even;

    @Column(nullable = false, length = 50)
    private String local_even;

    @Column(nullable = false, length = 30)
    private String tipo_even;

    @Column(nullable = false, length = 80)
    private String desc_even;

    @ManyToOne
    @JoinColumn(name = "fk_id_emp", nullable = false)
    private Empresa empresa;


    public int getId_even() { return id_even; }
    public void setId_even(int id_even) { this.id_even = id_even; }

    public String getNm_even() { return nm_even; }
    public void setNm_even(String nm_even) { this.nm_even = nm_even; }

    public String getLocal_even() { return local_even; }
    public void setLocal_even(String local_even) { this.local_even = local_even; }

    public String getTipo_even() { return tipo_even; }
    public void setTipo_even(String tipo_even) { this.tipo_even = tipo_even; }

    public String getDesc_even() { return desc_even; }
    public void setDesc_even(String desc_even) { this.desc_even = desc_even; }

    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }
}
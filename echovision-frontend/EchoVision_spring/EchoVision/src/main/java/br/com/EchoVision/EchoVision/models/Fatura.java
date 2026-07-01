package br.com.EchoVision.EchoVision.models;

import jakarta.persistence.*;

import javax.xml.crypto.Data;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Fatura")

public class Fatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_fat")
    private int id_fat;

    private String item_fat;
    private String desc_fat;
    private float preco_item;
    private LocalDate data_comp;

    public int getId_fat() {
        return id_fat;
    }

    public void setId_fat(int id_fat) {
        this.id_fat = id_fat;
    }

    public String getItem_fat() {
        return item_fat;
    }

    public void setItem_fat(String item_fat) {
        this.item_fat = item_fat;
    }

    public String getDesc_fat() {
        return desc_fat;
    }

    public void setDesc_fat(String desc_fat) {
        this.desc_fat = desc_fat;
    }

    public float getPreco_item() {
        return preco_item;
    }

    public void setPreco_item(float preco_item) {
        this.preco_item = preco_item;
    }

    public LocalDate getData_comp() {
        return data_comp;
    }

    public void setData_comp(LocalDate data_comp) {
        this.data_comp = data_comp;
    }
}

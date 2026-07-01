package br.com.EchoVision.EchoVision.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DigFis {
    DIGITAL("digital"),
    FISICO("fisico");

    private final String valor;

    DigFis(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static DigFis fromString(String texto) {
        if (texto == null) return null;
        for (DigFis formato : DigFis.values()) {
            if (formato.valor.equalsIgnoreCase(texto)) {
                return formato;
            }
        }
        throw new IllegalArgumentException("Formato de ingresso inválido: " + texto);
    }
}

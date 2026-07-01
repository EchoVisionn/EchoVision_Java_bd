package br.com.EchoVision.EchoVision.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoIng {
    MEIA("meia"),
    INTEIRA("inteira");

    private final String valor;

    TipoIng(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static TipoIng fromString(String texto) {
        if (texto == null) return null;
        for (TipoIng tipo : TipoIng.values()) {
            if (tipo.valor.equalsIgnoreCase(texto)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de ingresso inválido: " + texto);
    }
}

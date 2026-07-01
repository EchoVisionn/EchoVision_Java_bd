package br.com.EchoVision.EchoVision.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusEmp {
    ATIVO("ativo"),
    INATIVO("inativo");

    private final String valor;

    StatusEmp(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() { 
        return valor;
    }

    @JsonCreator
    public static StatusEmp fromString(String texto) {
        // Evita erro de tela azul (NullPointerException) se o cliente enviar o campo nulo
        if (texto == null) {
            return null;
        }

        for (StatusEmp status : StatusEmp.values()) {
            if (status.valor.equalsIgnoreCase(texto)) {
                return status;
            }
        }
        // Alterado para IllegalArgumentException para o Spring Boot capturar o erro automaticamente
        throw new IllegalArgumentException("Status inválido: " + texto);
    }
}

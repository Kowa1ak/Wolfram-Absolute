package com.stk.wolframabsolute.calculations;

import java.util.Arrays;

public class MatrixOperations {
    private double[][] matrix;

    public MatrixOperations(String matrixString) {
        this.matrix = parseMatrix(matrixString);
    }

    private double[][] parseMatrix(String matrixString) {
        return Arrays.stream(matrixString.split("\\}, \\{"))
                .map(row -> Arrays.stream(row.replaceAll("\\{", "").replaceAll("\\}", "").split(", "))
                        .mapToDouble(Double::parseDouble).toArray())
                .toArray(double[][]::new);
    }

    public double[][] add(MatrixOperations other) {
        double[][] otherMatrix = other.matrix;
        double[][] result = new double[matrix.length][];
        for (int i = 0; i < matrix.length; i++) {
            result[i] = new double[matrix[i].length];
            for (int j = 0; j < matrix[i].length; j++) {
                result[i][j] = matrix[i][j] + otherMatrix[i][j];
            }
        }
        return result;
    }

    public double[][] subtract(MatrixOperations other) {
        double[][] otherMatrix = other.matrix;
        double[][] result = new double[matrix.length][];
        for (int i = 0; i < matrix.length; i++) {
            result[i] = new double[matrix[i].length];
            for (int j = 0; j < matrix[i].length; j++) {
                result[i][j] = matrix[i][j] - otherMatrix[i][j];
            }
        }
        return result;
    }

    public double[][] multiply(MatrixOperations other) {
        double[][] otherMatrix = other.matrix;
        double[][] result = new double[matrix.length][otherMatrix[0].length];
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < otherMatrix[0].length; j++) {
                for (int k = 0; k < matrix[0].length; k++) {
                    result[i][j] += matrix[i][k] * otherMatrix[k][j];
                }
            }
        }
        return result;
    }

}


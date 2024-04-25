package com.stk.wolframabsolute.calculations;

public class IntegralCalculator {

    interface Function {
        double eval(double... args);
    }

    public double singleIntegral(Function f, double a, double b, int n) {
        double h = (b - a) / n;
        double sum = 0.5 * (f.eval(a) + f.eval(b));
        for (int i = 1; i < n; i++) {
            sum += f.eval(a + h * i);
        }
        return sum * h;
    }

    public double doubleIntegral(Function f, double a, double b, double c, double d, int n, int m) {
        double hx = (b - a) / n;
        double hy = (d - c) / m;
        double sum = 0;
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                double x = a + hx * i;
                double y = c + hy * j;
                double add = f.eval(x, y);
                if (i == 0 || i == n) {
                    add /= 2;
                }
                if (j == 0 || j == m) {
                    add /= 2;
                }
                sum += add;
            }
        }
        return sum * hx * hy;
    }

    public double tripleIntegral(Function f, double a, double b, double c, double d, double e, double p, int n, int m, int l) {
        double hx = (b - a) / n;
        double hy = (d - c) / m;
        double hz = (p - e) / l;
        double sum = 0;
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {
                for (int k = 0; k <= l; k++) {
                    double x = a + hx * i;
                    double y = c + hy * j;
                    double z = e + hz * k;
                    double add = f.eval(x, y, z);
                    if (i == 0 || i == n) {
                        add /= 2;
                    }
                    if (j == 0 || j == m) {
                        add /= 2;
                    }
                    if (k == 0 || k == l) {
                        add /= 2;
                    }
                    sum += add;
                }
            }
        }
        return sum * hx * hy * hz;
    }
}

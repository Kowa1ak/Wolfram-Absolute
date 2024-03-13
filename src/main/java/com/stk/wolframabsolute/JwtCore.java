package com.stk.wolframabsolute;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

import java.net.Authenticator;

@Component
public class JwtCore {
    @Value("${wabsolte.app.secret}")
    private String secret;
    @Value("${wabsolte.app.expirationMs}")
    private int lifetime;

    public String generateToken(Authentication authentication) {

    }
}

package org.example.gherabi_projet.web;

import org.example.gherabi_projet.entities.Compte;
import org.example.gherabi_projet.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class Controller {

    @Autowired
    private CompteRepository compteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Compte compte) {
        try {

            Compte authenticatedUser = compteRepository.findByLogin(compte.getLogin());
            if (authenticatedUser == null || !authenticatedUser.getPassword().equals(compte.getPassword()) || !"admin".equals(authenticatedUser.getRole())) {
                throw new Exception();
            }
            return ResponseEntity.ok(Map.of(
                    "message", "User successfully logged in",
                    "login", authenticatedUser.getLogin()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }
    }


}

package org.example.gherabi_projet.web;

import jakarta.persistence.criteria.Path;
import org.example.gherabi_projet.entities.Compte;
import org.example.gherabi_projet.entities.Filiere;
import org.example.gherabi_projet.repository.CompteRepository;
import org.example.gherabi_projet.repository.FiliereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import javax.naming.AuthenticationException;

import static jakarta.persistence.GenerationType.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class Controller {

    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private FiliereRepository filiereRepository;

    @GetMapping("/filiere")
    public List<Filiere> getAllFilieres() {
        return filiereRepository.findAll();
    }


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

    @GetMapping("/{id}")
    public ResponseEntity<Filiere> getFiliereById(@PathVariable Long id) {
        Optional<Filiere> filiere = filiereRepository.findById(id);
        return filiere.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/filiere/add")
    public ResponseEntity<String> addFiliere(
                                             @RequestParam("nom") String nom,
                                             @RequestParam("description") String description,
                                             @RequestParam("file") String imagePath) {

        Filiere filiere = new Filiere();
        filiere.setNom(nom);
        filiere.setDescription(description);
        filiere.setImagePath("/images/" + imagePath);

        filiereRepository.save(filiere);

        return ResponseEntity.ok("Filière ajoutée avec succès");
    }

    @DeleteMapping("filiere/delete/{id}")
    public ResponseEntity<Void> deleteFiliere(@PathVariable Long id) {
        if (!filiereRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        filiereRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/filiere/update/{id}")
    public ResponseEntity<?> updateFiliere(
            @PathVariable Long id,
            @RequestBody Filiere updatedFiliere
    ) {

        Filiere existingFiliere = filiereRepository.findById(id)
                .orElse(null);

        if (existingFiliere == null) {
            return ResponseEntity.notFound().build();
        }

        existingFiliere.setNom(updatedFiliere.getNom());
        existingFiliere.setDescription(updatedFiliere.getDescription());


        filiereRepository.save(existingFiliere);

        return ResponseEntity.ok("Filière mise à jour avec succès");
    }

}

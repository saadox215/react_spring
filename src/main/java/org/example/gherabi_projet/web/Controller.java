package org.example.gherabi_projet.web;

import org.example.gherabi_projet.entities.Compte;
import org.example.gherabi_projet.entities.Filiere;
import org.example.gherabi_projet.entities.Professeur;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.CompteRepository;
import org.example.gherabi_projet.repository.FiliereRepository;
import org.example.gherabi_projet.repository.ModuleRepository;
import org.example.gherabi_projet.repository.ProfesseurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class Controller {

    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private ProfesseurRepository professeurRepository;
    @Autowired
    private FiliereRepository filiereRepository;
    @Autowired
    private ModuleRepository moduleRepository;

    // -------------------- AUTHENTIFICATION --------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Compte compte) {
        try {
            Compte authenticatedUser = compteRepository.findByLogin(compte.getLogin());
            if (authenticatedUser == null || !authenticatedUser.getPassword().equals(compte.getPassword()) || !"admin".equals(authenticatedUser.getRole())) {
                throw new Exception();
            }
            return ResponseEntity.ok(Map.of("message", "User successfully logged in", "login", authenticatedUser.getLogin()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }
    }

    // -------------------- FILIERE SERVICES --------------------
    @GetMapping("/filiere")
    public List<Filiere> getAllFilieres() {
        return filiereRepository.findAll();
    }

    @GetMapping("/filiere/{id}")
    public ResponseEntity<Filiere> getFiliereById(@PathVariable Long id) {
        Optional<Filiere> filiere = filiereRepository.findById(id);
        return filiere.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/filiere/add")
    public ResponseEntity<String> addFiliere(@RequestParam("nom") String nom,
                                             @RequestParam("description") String description,
                                             @RequestParam("file") String imagePath) {
        Filiere filiere = new Filiere();
        filiere.setNom(nom);
        filiere.setDescription(description);
        filiere.setImagePath("/images/" + imagePath);

        filiereRepository.save(filiere);
        return ResponseEntity.ok("Filière ajoutée avec succès");
    }

    @PutMapping("/filiere/update/{id}")
    public ResponseEntity<String> updateFiliere(@PathVariable Long id, @RequestBody Filiere updatedFiliere) {
        return filiereRepository.findById(id)
                .map(existingFiliere -> {
                    existingFiliere.setNom(updatedFiliere.getNom());
                    existingFiliere.setDescription(updatedFiliere.getDescription());
                    filiereRepository.save(existingFiliere);
                    return ResponseEntity.ok("Filière mise à jour avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/filiere/delete/{id}")
    public ResponseEntity<Void> deleteFiliere(@PathVariable Long id) {
        if (!filiereRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        filiereRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // -------------------- PROFESSEUR SERVICES --------------------
    @GetMapping("/professeurs")
    public List<Professeur> getAllProfesseurs() {
        return professeurRepository.findAll();
    }

    @PostMapping("/professeurs/add")
    public ResponseEntity<String> addProfesseur(@RequestBody Professeur professeur) {
        professeurRepository.save(professeur);
        return ResponseEntity.ok("Professeur ajouté avec succès");
    }

    @PutMapping("/professeurs/update/{id}")
    public ResponseEntity<String> updateProfesseur(@PathVariable Long id, @RequestBody Professeur professeurDetails) {
        return professeurRepository.findById(id)
                .map(existingProfesseur -> {
                    existingProfesseur.setCode(professeurDetails.getCode());
                    existingProfesseur.setNom(professeurDetails.getNom());
                    existingProfesseur.setPrenom(professeurDetails.getPrenom());
                    existingProfesseur.setSpecialite(professeurDetails.getSpecialite());
                    professeurRepository.save(existingProfesseur);
                    return ResponseEntity.ok("Professeur mis à jour avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/professeurs/delete/{id}")
    public ResponseEntity<Void> deleteProfesseur(@PathVariable Long id) {
        if (!professeurRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        professeurRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // -------------------- MODULE SERVICES --------------------
    @GetMapping("/modules")
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @PostMapping("/modules/add")
    public ResponseEntity<String> addModule(@RequestBody Module module) {
        moduleRepository.save(module);
        return ResponseEntity.ok("Module ajouté avec succès");
    }

    @PutMapping("/modules/update/{id}")
    public ResponseEntity<String> updateModule(@PathVariable Long id, @RequestBody Module moduleDetails) {
        return moduleRepository.findById(id)
                .map(existingModule -> {
                    existingModule.setCode(moduleDetails.getCode());
                    existingModule.setNom(moduleDetails.getNom());
                    existingModule.setFiliere(moduleDetails.getFiliere());
                    moduleRepository.save(existingModule);
                    return ResponseEntity.ok("Module mis à jour avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/modules/delete/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        if (!moduleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        moduleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

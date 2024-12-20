package org.example.gherabi_projet.web;

import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.CompteRepository;
import org.example.gherabi_projet.repository.FiliereRepository;
import org.example.gherabi_projet.repository.ModuleRepository;
import org.example.gherabi_projet.repository.ProfesseurRepository;
import org.example.gherabi_projet.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class Controller {

    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private FiliereRepository filiereRepository;
    @Autowired
    private ProfesseurRepository professeurRepository;
    @Autowired
    private ModuleRepository moduleRepository;
    @Autowired
    private EmailService emailService;

    @GetMapping("/filiere")
    public List<Filiere> getAllFilieres() {
        return filiereRepository.findAll();
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Compte compte) {
        try {
            Compte authenticatedUser = compteRepository.findByLogin(compte.getLogin());

            // Vérification des identifiants
            if (authenticatedUser == null ||
                    !authenticatedUser.getPassword().equals(compte.getPassword()) ||
                    !"admin".equals(authenticatedUser.getRole())) {
                throw new Exception("Invalid credentials");
            }

            // Générer un code de validation aléatoire
            String validationCode = generateValidationCode();
            // Sauvegarder le code dans la base de données avec une expiration (par exemple, 10 minutes)
            authenticatedUser.setValidationCode(validationCode);
            authenticatedUser.setValidationCodeExpiration(LocalDateTime.now().plusMinutes(10)); // Expiration dans 10 minutes
            compteRepository.save(authenticatedUser);

            // Envoi de l'e-mail avec le code de validation
            emailService.sendEmail(
                    authenticatedUser.getLogin(),
                    "Code de validation",
                    "Votre code de validation est : " + validationCode
            );

            // Retourner un message indiquant que l'e-mail a été envoyé
            return ResponseEntity.ok(Map.of(
                    "message", "User successfully logged in. Validation code sent.",
                    "login", authenticatedUser.getLogin()
            ));
        } catch (Exception e) {
            // Gestion des erreurs
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }
    }

    private String generateValidationCode() {
        Random rand = new Random();
        return String.format("%06d", rand.nextInt(999999));  // Code à 6 chiffres
    }
    @PostMapping("/validateCode")
    public ResponseEntity<?> validateCode(@RequestBody Compte request) {
        try {
            Compte user = compteRepository.findByLogin(request.getLogin());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }

            if (user.getValidationCode() == null || user.getValidationCodeExpiration().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Code expired or not found"));
            }

            // Vérifier si le code de validation est correct
            if (!user.getValidationCode().equals(request.getValidationCode())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid validation code"));
            }

            // Code validé avec succès
            user.setValidationCode(null);  // Invalider le code une fois qu'il a été utilisé
            user.setValidationCodeExpiration(null); // Supprimer la date d'expiration
            compteRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Validation successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error during validation"));
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
    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(module -> new ModuleDTO(
                        module.getId(),
                        module.getNom(),
                        module.getFiliere().getNom()))
                .collect(Collectors.toList());
    }


    @PostMapping("/modules/add")
    public ResponseEntity<String> addModule(@RequestBody Module module) {
        Module savedModule = moduleRepository.save(module);
        return ResponseEntity.ok("Module ajouté avec succès: " + savedModule);
    }

    @PutMapping("/modules/update/{id}")
    public ResponseEntity<String> updateModule(@PathVariable Long id, @RequestBody Module moduleDetails) {
        return moduleRepository.findById(id)
                .map(existingModule -> {
                    existingModule.setNom(moduleDetails.getNom());
                    existingModule.setFiliere(moduleDetails.getFiliere());
                    moduleRepository.save(existingModule);
                    return ResponseEntity.ok("Module mis à jour avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/modules/delete")
    public ResponseEntity<Void> deleteModule(@RequestBody Map<String, Long> payload) {
        Long id = payload.get("id");

        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!moduleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        moduleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}

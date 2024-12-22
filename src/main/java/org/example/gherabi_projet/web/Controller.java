package org.example.gherabi_projet.web;

import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.CompteRepository;
import org.example.gherabi_projet.repository.FiliereRepository;
import org.example.gherabi_projet.repository.ModuleRepository;
import org.example.gherabi_projet.repository.ProfesseurRepository;
import org.example.gherabi_projet.services.EmailService;
import org.antlr.v4.runtime.misc.NotNull;
import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.*;
import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.*;
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
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

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
    @Autowired
    private ProfesseurRepository professeurRepository;
    @Autowired
    private ModuleRepository moduleRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private Etudiantarepository etudiantRepository;
    @Autowired
    private ElementRepository elementRepository;

    @GetMapping("/filiere")
    public List<Filiere> getAllFilieres() {
        return filiereRepository.findAll();
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Compte compte) {
        try {

            Compte authenticatedUser = compteRepository.findByLogin(compte.getLogin());
            if (authenticatedUser == null ||
                    !authenticatedUser.getPassword().equals(compte.getPassword()) ||
                    !"admin".equals(authenticatedUser.getRole())) {
                throw new Exception("Invalid credentials");
            }
            String validationCode = generateValidationCode();
            authenticatedUser.setValidationCode(validationCode);
            authenticatedUser.setValidationCodeExpiration(LocalDateTime.now().plusMinutes(10));
            compteRepository.save(authenticatedUser);

            emailService.sendEmail(
                    authenticatedUser.getLogin(),
                    "Code de validation",
                    "Votre code de validation est : " + validationCode
            );

            return ResponseEntity.ok(Map.of(
                    "message", "User successfully logged in. Validation code sent.",
                    "login", authenticatedUser.getLogin()
            ));
        } catch (Exception e) {
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
            if (!user.getValidationCode().equals(request.getValidationCode())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid validation code"));
            }
            user.setValidationCode(null);
            user.setValidationCodeExpiration(null);
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

    @PutMapping("/modules/affecter-element")
    public ResponseEntity<String> assignElementToProfesseur(
            @RequestParam Long professeurId,
            @RequestParam String elementCode,
            @RequestParam String moduleNom) {

        Optional<Professeur> optionalProfesseur = professeurRepository.findById(professeurId);
        if (optionalProfesseur.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Professeur introuvable avec l'ID " + professeurId);
        }
        Professeur professeur = optionalProfesseur.get();

        Module module = moduleRepository.findByNom(moduleNom);
        if (module == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Module introuvable avec le nom " + moduleNom);
        }

        Element element = elementRepository.findByCode(elementCode);
        if (element == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Élément introuvable avec le code " + elementCode);
        }

        if (element.getProfeseur() != null && !element.getProfeseur().getId().equals(professeurId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Élément déjà assigné à un autre professeur");
        }

        module.setElements(element);
        element.setProfeseur(professeur);
        elementRepository.save(element);
        moduleRepository.save(module);

        return ResponseEntity.ok("Élément " + elementCode + " assigné au professeur " + professeur.getNom());
    }

    // Utility function to generate the class name
    private String generateClassNameFromFiliere(String filiereName) {
        // List of words to ignore
        String[] ignoreWords = {"de", "d'", "du", "le", "la", "l'", "et"};
        List<String> ignoredList = Arrays.asList(ignoreWords);

        // Split the name into words and filter
        return Arrays.stream(filiereName.split("\\s+"))
                .filter(word -> !ignoredList.contains(word.toLowerCase())) // Exclude ignored words
                .map(word -> word.substring(0, 1).toUpperCase()) // Take the first letter
                .collect(Collectors.joining()); // Join letters
    }

}





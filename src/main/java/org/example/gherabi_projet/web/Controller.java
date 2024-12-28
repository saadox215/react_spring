package org.example.gherabi_projet.web;

import jakarta.persistence.EntityNotFoundException;
import org.example.gherabi_projet.dto.CompteDTO;
import org.example.gherabi_projet.dto.ElementDTO;
import org.example.gherabi_projet.dto.EtudiantDTO;
import org.example.gherabi_projet.dto.ModuleDTO;
import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.CompteRepository;
import org.example.gherabi_projet.repository.FiliereRepository;
import org.example.gherabi_projet.repository.ModuleRepository;
import org.example.gherabi_projet.repository.ProfesseurRepository;
import org.example.gherabi_projet.services.EmailService;
import org.example.gherabi_projet.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.*;

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
                        module.getFiliere().getNom(),
                        module.getSemesterType()))
                .collect(Collectors.toList());
    }


    @PostMapping("/modules/add")
    public ResponseEntity<String> addModule(@RequestBody Module module) {
        if (module.getSemesterType() == null) {
            return ResponseEntity.badRequest().body("Semester type must be specified");
        }
        Module savedModule = moduleRepository.save(module);
        return ResponseEntity.ok("Module ajouté avec succès: " + savedModule);
    }

    @PutMapping("/modules/update/{id}")
    public ResponseEntity<String> updateModule(@PathVariable Long id, @RequestBody Module moduleDetails) {
        return moduleRepository.findById(id)
                .map(existingModule -> {
                    existingModule.setNom(moduleDetails.getNom());
                    existingModule.setFiliere(moduleDetails.getFiliere());
                    if (moduleDetails.getSemesterType() != null) {
                        existingModule.setSemesterType(moduleDetails.getSemesterType());
                    }
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

    @GetMapping("/etudiants")
    public List<EtudiantDTO> getAllEtudiants() {
        return etudiantRepository.findAll().stream()
                .map(etudiant -> new EtudiantDTO(
                        etudiant.getId(),
                        etudiant.getNom(),
                        etudiant.getPrenom(),
                        etudiant.getFiliere() != null ? etudiant.getFiliere().getNom() : null,
                        etudiant.getFiliere() != null ? etudiant.getFiliere().getId() : null))
                .collect(Collectors.toList());
    }
    @PostMapping("/etudiant/add")
    public ResponseEntity<String> addEtudiant(@RequestBody Etudiant etudiant){
        etudiantRepository.save(etudiant);
        return ResponseEntity.ok("Etudiant ajouté avec succès");
    }
    @DeleteMapping("/etudiant/delete/{id}")
    public ResponseEntity<String> deleteEtudiant(@PathVariable Long id){
        etudiantRepository.deleteById(id);
        return ResponseEntity.ok("Etudiant supprimé avec succès");
    }
    @PutMapping("/etudiant/update/{id}")
    public ResponseEntity<String> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiantDetails) {
        return etudiantRepository.findById(id)
                .map(existingEtudiant -> {
                    existingEtudiant.setNom(etudiantDetails.getNom());
                    existingEtudiant.setPrenom(etudiantDetails.getPrenom());
                    existingEtudiant.setFiliere(etudiantDetails.getFiliere());
                    etudiantRepository.save(existingEtudiant);
                    return ResponseEntity.ok("Etudiant mis à jour avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }
    // -------------------- Comptes SERVICES --------------------
    @GetMapping("/comptes")
    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAllWithProfesseur()
                .stream()
                .map(CompteDTO::fromEntity)
                .collect(Collectors.toList());
    }
    @PostMapping("/compte/add")
    public ResponseEntity<?> addCompte(@RequestBody Compte compte) {
        try {
            compteRepository.save(compte);
            return ResponseEntity.ok("Compte ajouté avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de l'ajout du compte: " + e.getMessage());
        }
    }

    @DeleteMapping("/compte/delete/{id}")
    public ResponseEntity<?> deleteCompte(@PathVariable Long id) {
        try {
            if (!compteRepository.existsById(Math.toIntExact(id))) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Compte non trouvé");
            }


            int deleted = compteRepository.deleteCompteById(id);

            if (!compteRepository.existsById(Math.toIntExact(id))) {
                return ResponseEntity.ok("Compte supprimé avec succès");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("La suppression n'a pas été effectuée");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    @PutMapping("/compte/update/{id}")
    public ResponseEntity<?> updateCompte(@PathVariable Long id, @RequestBody Compte compteDetails) {
        try {
            return compteRepository.findById(Math.toIntExact(id))
                    .map(existingCompte -> {
                        existingCompte.setLogin(compteDetails.getLogin());
                        existingCompte.setPassword(compteDetails.getPassword());
                        existingCompte.setRole(compteDetails.getRole());
                        existingCompte.setProfesseur(compteDetails.getProfesseur());
                        compteRepository.save(existingCompte);
                        return ResponseEntity.ok("Compte mis à jour avec succès");
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Compte non trouvé"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }
    // -------------------- ELEMENT SERVICES --------------------
    @GetMapping("/elements")
    public List<ElementDTO> getAllElements() {
        return elementRepository.findAll().stream()
                .map(element -> new ElementDTO(
                        element.getId(),
                        element.getNom(),
                        element.getModule().getNom(),
                        element.getCoefficient(),
                        element.getProfesseur().getNom()))
                .collect(Collectors.toList());
    }
    @PutMapping("/elements/update/{id}")
    public ResponseEntity<String> updateElement(@PathVariable Long id, @RequestBody Element elementDetails) {
        return elementRepository.findById(id)
                .map(existingElement -> {
                    // Update name and coefficient
                    existingElement.setNom(elementDetails.getNom());
                    existingElement.setCoefficient(elementDetails.getCoefficient());

                    // Update module if provided
                    if (elementDetails.getModule() != null && elementDetails.getModule().getId() != null) {
                        Module module = moduleRepository.findById(elementDetails.getModule().getId())
                                .orElseThrow(() -> new EntityNotFoundException("Module not found"));
                        existingElement.setModule(module);
                    }

                    // Update professor if provided
                    if (elementDetails.getProfesseur() != null && elementDetails.getProfesseur().getId() != null) {
                        Professeur professeur = professeurRepository.findById(elementDetails.getProfesseur().getId())
                                .orElseThrow(() -> new EntityNotFoundException("Professor not found"));
                        existingElement.setProfesseur(professeur);
                    }

                    elementRepository.save(existingElement);
                    return ResponseEntity.ok("Element mis a jour avec succès");
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/elements/add")
    public ResponseEntity<?> addElement(@RequestBody Element element) {
        try {
            if (element.getModule() == null || element.getModule().getId() == null) {
                return ResponseEntity.badRequest()
                        .body("Module must be specified for the element");
            }

            if (element.getProfesseur() == null || element.getProfesseur().getId() == null) {
                return ResponseEntity.badRequest()
                        .body("Professor must be specified for the element");
            }

            Module module = moduleRepository.findById(element.getModule().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Module not found with id: " + element.getModule().getId()));

            Professeur professeur = professeurRepository.findById(element.getProfesseur().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Professor not found with id: " + element.getProfesseur().getId()));

            element.setModule(module);
            element.setProfesseur(professeur);

            Element savedElement = elementRepository.save(element);

            return ResponseEntity.ok(savedElement);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error creating element: " + e.getMessage());
        }
    }
    @DeleteMapping("/elements/delete")
    public ResponseEntity<Void> deleteElement(@RequestBody Map<String, Long> payload) {
        Long id = payload.get("id");

        if (id == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!elementRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        elementRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}





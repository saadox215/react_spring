package org.example.gherabi_projet.web;

import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.*;
import org.example.gherabi_projet.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/prof")
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerProf {

    private final CompteRepository compteRepository;
    private final ProfesseurRepository professeurRepository;
    private final ModuleRepository moduleRepository;
    private final ElementRepository elementRepository;
    private final EvaluationRepository evaluationRepository;
    private final EmailService emailService;

    @Autowired
    public ControllerProf(CompteRepository compteRepository,
                          ProfesseurRepository professeurRepository,
                          ModuleRepository moduleRepository,
                          ElementRepository elementRepository,
                          EvaluationRepository evaluationRepository,
                          EmailService emailService) {
        this.compteRepository = compteRepository;
        this.professeurRepository = professeurRepository;
        this.moduleRepository = moduleRepository;
        this.elementRepository = elementRepository;
        this.evaluationRepository = evaluationRepository;
        this.emailService = emailService;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Compte compte) {
        try {

            Compte authenticatedUser = compteRepository.findByLogin(compte.getLogin());
            if (authenticatedUser == null ||
                    !authenticatedUser.getPassword().equals(compte.getPassword()) ||
                    !"professeur".equals(authenticatedUser.getRole())) {
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
    @GetMapping("/modules/{profId}")
    public ResponseEntity<?> getProfessorModules(@PathVariable Long profId) {
        try {
            Professeur professeur = professeurRepository.findById(profId).orElse(null);
            if (professeur == null) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> modulesList = new ArrayList<>();

            for (Module module : professeur.getModules()) {
                for (Element element : module.getElements()) {
                    if (element.getProfesseur().getId().equals(professeur.getId())) {
                        Map<String, Object> moduleInfo = new HashMap<>();
                        moduleInfo.put("id", module.getId());
                        moduleInfo.put("name", module.getNom());
                        moduleInfo.put("filiere", module.getFiliere().getNom());
                        moduleInfo.put("semester", module.getSemesterType());
                        moduleInfo.put("element", element.getNom());
                        modulesList.add(moduleInfo);
                    }
                }
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching modules");
        }
        return ResponseEntity.ok("Done");
    }
    // Récupérer les notes d'un module
    @GetMapping("/module/{moduleId}/grades")
    public ResponseEntity<?> getModuleGrades(@PathVariable Long moduleId) {
        try {
            Module module = moduleRepository.findById(moduleId).orElse(null);
            if (module == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            List<Map<String, Object>> studentsList = new ArrayList<>();
            Map<String, Map<String, Object>> gradesMap = new HashMap<>();

            for (Element element : module.getElements()) {
                for (Etudiant etudiant : module.getFiliere().getEtudiants()) {
                    Map<String, Object> studentInfo = new HashMap<>();
                    studentInfo.put("id", etudiant.getId());
                    studentInfo.put("name", etudiant.getNom() + " " + etudiant.getPrenom());
                    studentsList.add(studentInfo);

                    Map<String, Object> studentGrades = gradesMap.computeIfAbsent(
                            etudiant.getId().toString(), k -> new HashMap<>()
                    );

                    List<Evaluation> evaluations = evaluationRepository
                            .findByEtudiant(etudiant);

                    for (Evaluation eval : evaluations) {
                        if (eval.getExam_absence() == 1) {
                            studentGrades.put(eval.getType().toString(), "ABS");
                        } else {
                            studentGrades.put(eval.getType().toString(), eval.getNote());
                        }
                    }
                }
            }

            response.put("students", studentsList);
            response.put("grades", gradesMap);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching grades");
        }
    }

    // Sauvegarder ou valider les notes
    @PostMapping("/grades/{moduleId}")
    public ResponseEntity<?> saveGrades(@PathVariable Long moduleId,
                                        @RequestBody Map<String, Object> request) {
        try {
            Map<String, Map<String, Object>> grades = (Map<String, Map<String, Object>>) request.get("grades");
            boolean isValidated = (boolean) request.get("isValidated");

            Module module = moduleRepository.findById(moduleId).orElse(null);
            if (module == null) {
                return ResponseEntity.notFound().build();
            }

            for (Map.Entry<String, Map<String, Object>> entry : grades.entrySet()) {
                Long studentId = Long.parseLong(entry.getKey());
                Map<String, Object> studentGrades = entry.getValue();

                for (Map.Entry<String, Object> gradeEntry : studentGrades.entrySet()) {
                    String type = gradeEntry.getKey();
                    Object gradeValue = gradeEntry.getValue();

                    Evaluation evaluation = new Evaluation();
                    evaluation.setType(EvaluationType.valueOf(type));

                    if ("ABS".equals(gradeValue)) {
                        evaluation.setExam_absence(1);
                        evaluation.setNote(0.0);
                    } else {
                        evaluation.setExam_absence(0);
                        evaluation.setNote(Double.parseDouble(gradeValue.toString()));
                    }

                    evaluationRepository.save(evaluation);
                }
            }

            return ResponseEntity.ok(Map.of("message",
                    isValidated ? "Grades validated successfully" : "Grades saved as draft"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving grades");
        }
    }


}
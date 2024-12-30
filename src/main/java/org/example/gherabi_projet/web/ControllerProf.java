package org.example.gherabi_projet.web;

import jakarta.transaction.Transactional;
import org.example.gherabi_projet.dto.EvaluationDTO;
import org.example.gherabi_projet.entities.*;
import org.example.gherabi_projet.entities.Module;
import org.example.gherabi_projet.repository.*;
import org.example.gherabi_projet.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    private final EtudiantRepository etudiantRepository;
    private final EmailService emailService;
    private final AbsenceRepository absenceRepository;

    @Autowired
    public ControllerProf(CompteRepository compteRepository,
                          ProfesseurRepository professeurRepository,
                          ModuleRepository moduleRepository,
                          ElementRepository elementRepository,
                          EvaluationRepository evaluationRepository,
                          EtudiantRepository etudiantRepository,
                          EmailService emailService,
                          AbsenceRepository absenceRepository) {
        this.compteRepository = compteRepository;
        this.professeurRepository = professeurRepository;
        this.moduleRepository = moduleRepository;
        this.elementRepository = elementRepository;
        this.evaluationRepository = evaluationRepository;
        this.etudiantRepository = etudiantRepository;
        this.emailService = emailService;
        this.absenceRepository = absenceRepository;
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
                    "message", "Code de validation envoyé par email",
                    "professeur_id", authenticatedUser.getProfesseur().getId()
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

            return ResponseEntity.ok(Map.of(
                    "message", "Code de validation envoyé par email",
                    "professeur_id", user.getProfesseur().getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error during validation"));
        }
    }


        @GetMapping("/modules/{profId}")
        public ResponseEntity<?> getProfessorModules(@PathVariable Long profId) {
            try {
                Optional<Professeur> professeurOpt = professeurRepository.findById(profId);
                if (professeurOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Professor not found"));
                }

                Professeur professeur = professeurOpt.get();
                List<Map<String, Object>> modulesList = new ArrayList<>();

                List<Element> elements = elementRepository.findByProfesseur(professeur);

                for (Element element : elements) {
                    Module module = element.getModule();
                    Map<String, Object> moduleInfo = new HashMap<>();
                    moduleInfo.put("id", module.getId());
                    moduleInfo.put("name", module.getNom());
                    moduleInfo.put("code", module.getCode());
                    moduleInfo.put("filiere", module.getFiliere().getNom());
                    moduleInfo.put("semester", module.getSemesterType());
                    moduleInfo.put("elementId", element.getId());
                    moduleInfo.put("elementName", element.getNom());
                    modulesList.add(moduleInfo);
                }

                return ResponseEntity.ok(modulesList);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Error fetching modules: " + e.getMessage()));
            }
        }

    @GetMapping("/element/{elementId}/grades")
    public ResponseEntity<?> getElementGrades(@PathVariable Long elementId) {
        try {
            Optional<Element> elementOpt = elementRepository.findById(elementId);
            if (elementOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Element not found"));
            }

            Element element = elementOpt.get();
            List<Etudiant> etudiants = element.getModule().getFiliere().getEtudiants();

            List<Map<String, Object>> studentsList = new ArrayList<>();
            Map<String, Map<String, Object>> gradesMap = new HashMap<>();

            for (Etudiant etudiant : etudiants) {
                Map<String, Object> studentInfo = new HashMap<>();
                studentInfo.put("id", etudiant.getId());
                studentInfo.put("code", etudiant.getCode());
                studentInfo.put("name", etudiant.getNom() + " " + etudiant.getPrenom());
                studentsList.add(studentInfo);

                List<Evaluation> evaluations = evaluationRepository.findByEtudiantAndElement(etudiant, element);
                Map<String, Object> studentGrades = new HashMap<>();

                for (EvaluationType type : EvaluationType.values()) {
                    Optional<EvaluationDTO> evalDTO = evaluations.stream()
                            .filter(e -> e.getType() == type)
                            .map(EvaluationDTO::new)
                            .findFirst();

                    if (evalDTO.isPresent()) {
                        EvaluationDTO evaluation = evalDTO.get();
                        studentGrades.put(type.toString(),
                                evaluation.getExam_absence() == 1 ? "ABS" : evaluation.getNote());
                    } else {
                        studentGrades.put(type.toString(), "");
                    }
                }

                gradesMap.put(etudiant.getId().toString(), studentGrades);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("students", studentsList);
            response.put("grades", gradesMap);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching grades: " + e.getMessage()));
        }
    }

    @PostMapping("/element/{elementId}/grades")
    @Transactional
    public ResponseEntity<?> saveGrades(@PathVariable Long elementId, @RequestBody Map<String, Object> request) {
        try {
            Optional<Element> elementOpt = elementRepository.findById(elementId);
            if (elementOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Element not found"));
            }

            Element element = elementOpt.get();
            Map<String, Map<String, Object>> grades = (Map<String, Map<String, Object>>) request.get("grades");
            boolean isValidated = (boolean) request.getOrDefault("isValidated", false);

            if (isValidated) {
                element.setValidated(true);
                elementRepository.save(element);
            }

            List<EvaluationDTO> savedEvaluations = new ArrayList<>();

            for (Map.Entry<String, Map<String, Object>> entry : grades.entrySet()) {
                Long studentId = Long.parseLong(entry.getKey());
                Map<String, Object> studentGrades = entry.getValue();

                Optional<Etudiant> etudiantOpt = etudiantRepository.findById(studentId);
                if (etudiantOpt.isEmpty()) continue;

                Etudiant etudiant = etudiantOpt.get();

                for (Map.Entry<String, Object> gradeEntry : studentGrades.entrySet()) {
                    Evaluation savedEval = saveEvaluation(etudiant, element, gradeEntry.getKey(), gradeEntry.getValue(), isValidated);
                    savedEvaluations.add(new EvaluationDTO(savedEval));
                }
            }

            String message = isValidated ?
                    "Grades validated successfully" :
                    "Grades saved as draft";

            return ResponseEntity.ok(Map.of(
                    "message", message,
                    "status", "success",
                    "evaluations", savedEvaluations,
                    "elementValidated", element.isValidated()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error saving grades: " + e.getMessage()));
        }
    }

    private Evaluation saveEvaluation(Etudiant etudiant, Element element, String typeStr, Object gradeValue, boolean isValidated) {
        EvaluationType type = EvaluationType.valueOf(typeStr);

        Evaluation evaluation = evaluationRepository
                .findByEtudiantAndElementAndType(etudiant, element, type)
                .stream()
                .findFirst()
                .orElse(new Evaluation());

        evaluation.setEtudiant(etudiant);
        evaluation.setElement(element);
        evaluation.setType(type);

        if (gradeValue instanceof String && "ABS".equals(gradeValue)) {
            evaluation.setExam_absence(1);
            evaluation.setNote(0.0);
        } else {
            evaluation.setExam_absence(0);
            double note = gradeValue instanceof Number ?
                    ((Number) gradeValue).doubleValue() :
                    Double.parseDouble(gradeValue.toString());
            evaluation.setNote(Math.min(Math.max(note, 0.0), 20.0));
        }

        return evaluationRepository.save(evaluation);
    }

    @GetMapping("/element/{elementId}/validation-status")
    public ResponseEntity<?> getElementValidationStatus(@PathVariable Long elementId) {
        try {
            Optional<Element> elementOpt = elementRepository.findById(elementId);
            if (elementOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Element not found"));
            }

            Element element = elementOpt.get();
            return ResponseEntity.ok(Map.of(
                    "isValidated", element.isValidated()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error checking validation status: " + e.getMessage()));
        }
    }
    @GetMapping("/element/{elementId}/absences")
    public ResponseEntity<?> getElementAbsences(@PathVariable Long elementId) {
        try {
            Optional<Element> elementOpt = elementRepository.findById(elementId);
            if (elementOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Element not found"));
            }

            Element element = elementOpt.get();
            List<Etudiant> etudiants = element.getModule().getFiliere().getEtudiants();

            List<Map<String, Object>> studentsList = new ArrayList<>();

            for (Etudiant etudiant : etudiants) {
                Map<String, Object> studentInfo = new HashMap<>();
                studentInfo.put("id", etudiant.getId());
                studentInfo.put("code", etudiant.getCode());
                studentInfo.put("name", etudiant.getNom() + " " + etudiant.getPrenom());

                long absencesCount = absenceRepository.countByEtudiantAndElement(etudiant, element);
                studentInfo.put("totalAbsences", absencesCount);

                List<Absence> absences = absenceRepository.findByEtudiantAndElement(etudiant, element);
                List<String> absenceDates = absences.stream()
                        .map(a -> a.getDate().toString())
                        .collect(Collectors.toList());
                studentInfo.put("absenceDates", absenceDates);

                studentsList.add(studentInfo);
            }

            return ResponseEntity.ok(Map.of("students", studentsList));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching absences: " + e.getMessage()));
        }
    }

    @PostMapping("/element/{elementId}/absence")
    public ResponseEntity<?> addAbsence(@PathVariable Long elementId, @RequestBody Map<String, Object> request) {
        try {
            Long studentId = Long.parseLong(request.get("studentId").toString());
            String dateStr = request.get("date").toString();
            String description = request.get("description").toString();

            Optional<Element> elementOpt = elementRepository.findById(elementId);
            Optional<Etudiant> etudiantOpt = etudiantRepository.findById(studentId);

            if (elementOpt.isEmpty() || etudiantOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Element or Student not found"));
            }

            Absence absence = new Absence();
            absence.setElement(elementOpt.get());
            absence.setEtudiant(etudiantOpt.get());
            absence.setDate(LocalDate.parse(dateStr));
            absence.setDescription(description);

            absenceRepository.save(absence);

            return ResponseEntity.ok(Map.of(
                    "message", "Absence added successfully",
                    "totalAbsences", absenceRepository.countByEtudiantAndElement(etudiantOpt.get(), elementOpt.get())
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error adding absence: " + e.getMessage()));
        }
    }
    @GetMapping("/profile/{profId}")
    public ResponseEntity<?> getProfile(@PathVariable Long profId) {
        try {
            return ResponseEntity.ok(professeurRepository.findProfesseurById(profId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
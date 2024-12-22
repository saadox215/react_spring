package org.example.gherabi_projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.example.gherabi_projet.entities.Module;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    Module findByNom(String nom);
}
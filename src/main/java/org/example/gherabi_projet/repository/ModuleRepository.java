package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModuleRepository extends JpaRepository<Module, Long> {
}

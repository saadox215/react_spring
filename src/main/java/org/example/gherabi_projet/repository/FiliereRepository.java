package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Filiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, Long> {

    List<Filiere> findAll();
    void deleteById(Long id);
}
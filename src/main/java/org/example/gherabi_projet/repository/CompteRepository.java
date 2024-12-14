package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompteRepository extends JpaRepository<Compte, Integer> {
        Compte findByLogin(String login);
        }

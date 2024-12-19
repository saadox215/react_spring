package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Element;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElementRepository extends JpaRepository<Element, Long> {
    Element findByCode(String Code);
}

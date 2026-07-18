import { ThemeProvider } from "@/user/context/ThemeProvider";
import { LegalPage, Section, P, List } from "./PolitiqueConfidentialite";

export default function ConditionsUtilisation() {
  return (
    <ThemeProvider>
      <LegalPage title="Conditions d'utilisation" updated="18 juillet 2026">
        <Section title="1. Objet">
          <P>
            Les présentes conditions régissent l'utilisation du site Baobab
            Cinéma, plateforme de réservation de séances de cinéma. En créant
            un compte ou en utilisant le service, vous acceptez ces conditions.
          </P>
        </Section>

        <Section title="2. Création de compte">
          <P>
            La création d'un compte nécessite un nom, un prénom, une adresse
            e-mail valide et un mot de passe. Vous êtes responsable de la
            confidentialité de vos identifiants et de toute activité effectuée
            depuis votre compte.
          </P>
        </Section>

        <Section title="3. Réservations">
          <List
            items={[
              "Une réservation reste au statut « en attente » jusqu'à confirmation.",
              "Les places réservées sont bloquées dès la création de la réservation et ne peuvent pas être réservées par un autre utilisateur.",
              "Une réservation ne peut plus être effectuée moins de 3 heures avant le début de la séance ; passé ce délai, la réservation se fait directement sur place.",
              "Vous pouvez annuler une réservation depuis votre profil tant que la séance n'a pas eu lieu ; les places sont alors immédiatement libérées.",
            ]}
          />
        </Section>

        <Section title="4. Responsabilités">
          <P>
            Baobab Cinéma s'efforce d'assurer la disponibilité et l'exactitude
            des informations présentées (séances, disponibilité des places,
            tarifs). Le site étant un projet pédagogique, aucune garantie de
            disponibilité continue du service n'est apportée.
          </P>
        </Section>

        <Section title="5. Suppression de compte">
          <P>
            Vous pouvez supprimer votre compte à tout moment depuis l'onglet
            « Sécurité » de votre profil. Vos données identifiantes sont alors
            anonymisées définitivement, conformément à notre{" "}
            <a href="/confidentialite" style={{ color: "var(--accent2, #5E94CE)" }}>
              politique de confidentialité
            </a>.
          </P>
        </Section>

        <Section title="6. Propriété intellectuelle">
          <P>
            L'ensemble des éléments du site (textes, mise en page, code) est la
            propriété de Baobab Cinéma ou de ses concepteurs, dans le cadre de
            ce projet de certification, et ne peut être reproduit sans accord.
          </P>
        </Section>

        <Section title="7. Modification des conditions">
          <P>
            Ces conditions peuvent être mises à jour ; la date de dernière
            modification est indiquée en haut de cette page.
          </P>
        </Section>

        <Section title="8. Contact">
          <P>
            Pour toute question relative à ces conditions, vous pouvez nous
            contacter à l'adresse :{" "}
            <a href="mailto:contact@baobab-cinema.example" style={{ color: "var(--accent2, #5E94CE)" }}>
              contact@baobab-cinema.example
            </a>.
          </P>
        </Section>
      </LegalPage>
    </ThemeProvider>
  );
}
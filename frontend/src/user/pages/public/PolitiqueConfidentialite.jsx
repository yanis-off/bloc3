import { ThemeProvider } from "@/user/context/ThemeProvider";
import Navbar from "@/user/components/public/Navbar";
import Footer from "@/user/components/public/Footer";

export default function PolitiqueConfidentialite() {
  return (
    <ThemeProvider>
      <LegalPage title="Politique de confidentialité" updated="18 juillet 2026">
        <Section title="1. Responsable du traitement">
          <P>
            Baobab Cinéma est responsable du traitement des données personnelles
            décrites dans la présente politique. Ce site est un projet pédagogique
            réalisé dans le cadre d'une certification ; aucune donnée n'est vendue
            ni partagée à des fins commerciales avec des tiers.
          </P>
        </Section>

        <Section title="2. Données collectées et finalités">
          <P>
            Nous collectons uniquement les données nécessaires au fonctionnement
            du service de réservation de séances :
          </P>
          <Table
            head={["Donnée", "Finalité", "Base légale"]}
            rows={[
              ["Nom, prénom, e-mail", "Création et gestion de votre compte", "Exécution du contrat"],
              ["Mot de passe (haché)", "Authentification sécurisée", "Exécution du contrat"],
              ["Historique de réservations", "Suivi de vos réservations et de vos billets", "Exécution du contrat"],
              ["Adresse IP, user-agent", "Sécurité de la session, prévention de la fraude", "Intérêt légitime"],
              ["E-mail + jeton temporaire", "Réinitialisation de mot de passe", "Exécution du contrat"],
            ]}
          />
        </Section>

        <Section title="3. Durée de conservation">
          <P>
            Les données de votre compte sont conservées tant que celui-ci est actif.
            Si vous supprimez votre compte, vos informations identifiantes (nom,
            e-mail, mot de passe) sont immédiatement anonymisées. Votre historique
            de réservations est conservé sous forme anonyme, sans lien possible
            avec votre identité, à des fins de statistiques internes.
          </P>
        </Section>

        <Section title="4. Vos droits">
          <P>
            Conformément au Règlement Général sur la Protection des Données (RGPD),
            vous disposez des droits suivants sur vos données personnelles :
          </P>
          <List
            items={[
              <>
                <strong>Droit à l'effacement</strong> - vous pouvez supprimer votre
                compte à tout moment depuis votre profil (onglet « Sécurité »).
                Vos données identifiantes sont alors anonymisées de façon définitive.
              </>,
              <>
                <strong>Droit de rectification</strong> - vous pouvez modifier votre
                nom, prénom et e-mail depuis l'onglet « Informations » de votre profil.
              </>,
              <>
                <strong>Droit d'accès et de portabilité</strong> - vous pouvez demander
                une copie de vos données en nous contactant à l'adresse ci-dessous.
              </>,
              <>
                <strong>Droit d'opposition</strong> - vous pouvez vous opposer au
                traitement de vos données pour des motifs légitimes en nous contactant.
              </>,
            ]}
          />
        </Section>

        <Section title="5. Hébergement et transferts de données">
          <P>
            L'application est hébergée par Railway, dont les serveurs backend sont
            situés aux États-Unis. Ce recours implique un transfert de données hors
            de l'Union européenne. Le service de supervision des erreurs (Sentry)
            est quant à lui hébergé au sein de l'Union européenne. Dans le cadre
            d'une mise en production réelle, un tel transfert devrait être encadré
            par des clauses contractuelles types reconnues par la Commission
            européenne ; ce point est documenté ici par transparence dans le cadre
            de ce projet pédagogique.
          </P>
        </Section>

        <Section title="6. Cookies">
          <P>
            Le site n'utilise que des cookies techniques strictement nécessaires
            au fonctionnement du service (maintien de votre session de connexion).
            Aucun cookie de mesure d'audience ou publicitaire n'est déposé. Ces
            cookies techniques étant exemptés de consentement par la réglementation,
            aucun bandeau de consentement n'est affiché.
          </P>
        </Section>

        <Section title="7. Sécurité">
          <P>
            Vos données sont protégées par des mesures techniques adaptées :
            mots de passe hachés (bcrypt), communications chiffrées (HTTPS),
            et accès à la base de données restreint au seul service applicatif.
          </P>
        </Section>

        <Section title="8. Contact">
          <P>
            Pour toute question relative à vos données personnelles ou pour
            exercer l'un de vos droits, vous pouvez nous contacter à l'adresse :{" "}
            <a href="mailto:contact@baobab-cinema.example" style={{ color: "var(--accent2, #5E94CE)" }}>
              contact@baobab-cinema.example
            </a>.
          </P>
        </Section>
      </LegalPage>
    </ThemeProvider>
  );
}

// ─── shared layout (utilisé aussi par ConditionsUtilisation) ─────────────────

export function LegalPage({ title, updated, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #000)", color: "var(--text, #F9F9F9)" }}>
      <Navbar />
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "140px 24px 96px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontWeight: 700,
            fontSize: 34,
            marginBottom: 8,
            letterSpacing: "-.01em",
          }}
        >
          {title}
        </h1>
        {updated && (
          <p style={{ fontSize: 13, color: "rgba(221,230,240,.5)", marginBottom: 40 }}>
            Dernière mise à jour : {updated}
          </p>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontFamily: "Sora, sans-serif",
          fontWeight: 600,
          fontSize: 19,
          marginBottom: 14,
          color: "var(--text, #F9F9F9)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }) {
  return (
    <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "rgba(221,230,240,.75)", marginBottom: 12 }}>
      {children}
    </p>
  );
}

export function List({ items }) {
  return (
    <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 20, margin: "12px 0" }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(221,230,240,.75)" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Table({ head, rows }) {
  return (
    <div style={{ overflowX: "auto", margin: "16px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  background: "var(--surface2, #121A3C)",
                  color: "var(--text, #F9F9F9)",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--border, rgba(168,192,224,.16))",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "10px 14px",
                    color: "rgba(221,230,240,.75)",
                    borderBottom: "1px solid rgba(168,192,224,.08)",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
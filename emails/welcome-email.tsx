import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

export default function WelcomeEmail({
  name = "there",
  dashboardUrl = "http://localhost:3000/dashboard",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre compte est prêt — direction le tableau de bord.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Bienvenue, {name} 👋</Heading>
          <Text style={paragraph}>
            Votre compte vient d&apos;être créé. Tout est déjà en place :
            authentification, base de données et abonnements sont prêts à
            l&apos;emploi.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Ouvrir le tableau de bord
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Cet e-mail a été envoyé automatiquement à la création de votre
            compte. Vous pouvez modifier ce message dans emails/welcome-email.tsx.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Inline styles on purpose — most email clients strip <style> tags and
// ignore most of Tailwind, so plain style objects are the safest baseline.
const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "480px",
};

const heading = {
  fontSize: "22px",
  fontWeight: 600,
  color: "#18181b",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#3f3f46",
};

const buttonContainer = {
  margin: "28px 0",
};

const button = {
  backgroundColor: "#f59e0b",
  borderRadius: "8px",
  color: "#18181b",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "28px 0 20px",
};

const footer = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#a1a1aa",
};

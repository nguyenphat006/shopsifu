import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import PolicyIndex from "@/components/client/user/account/desktop/policy/policy-Index";

export default function Policy() {
  return (
    <ClientLayoutWrapper
    hideCommit
    hideHero
    >
      <PolicyIndex />
    </ClientLayoutWrapper>
  );
}

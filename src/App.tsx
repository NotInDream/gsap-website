import { ProposalSection } from "./components/organisms/ProposalSection";
import { ReasoningSection } from "./components/organisms/ReasoningSection";
import { TitleSection } from "./components/organisms/TitleSection";

function App() {
  return (
    <main className="w-full">
      <TitleSection />
      <ReasoningSection />
      <ProposalSection />
    </main>
  );
}

export default App;

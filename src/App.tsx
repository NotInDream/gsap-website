import { ReasoningSection } from "./components/organisms/ReasoningSection";
import { TitleSection } from "./components/organisms/TitleSection";

function App() {
  return (
    <>
      <div className="w-full h-screen rounded-full">
        <TitleSection />
        <ReasoningSection />
      </div>
    </>
  );
}

export default App;

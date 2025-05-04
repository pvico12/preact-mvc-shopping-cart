import "./App.css";

import * as State from "../state";
import SettingsSection from "./SettingsSection";
import AddSection from "./AddSection";
import ListSection from "./ListSection";
import StatusSection from "./StatusSection";
import EditCategoriesOverlay from "./EditCategoriesOverlay";
import ShowExpensesOverlay from "./ShowExpensesOverlay";

export default function App() {

  const mode = State.getMode();

  return (
    <div id="main-container">
      {(mode === State.Mode.EditCategories || mode === State.Mode.ShowExpenses) && (<div class="overlay"></div>)}
      <div id="main-section-container">
        {mode === State.Mode.EditCategories && ( <EditCategoriesOverlay />)}
        {mode === State.Mode.ShowExpenses && ( <ShowExpensesOverlay />)}
        <SettingsSection />
        <AddSection />
        <ListSection />
        <StatusSection />
      </div>
    </div>
  );
}

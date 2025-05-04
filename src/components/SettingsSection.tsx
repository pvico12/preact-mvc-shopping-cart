import "./SettingsSection.css";
import * as State from "../state";

export default function SettingsSection() {
  function setMode(mode: State.Mode) {
    State.setMode(mode);
  }

  return (
    <div id="settings-section">
        <button class="settings-button" onClick={() => setMode(State.Mode.EditCategories)}>✍🏻 Edit Categories</button>
        <button class="settings-button" onClick={() => setMode(State.Mode.ShowExpenses)}>💵 Show Expenses</button>
    </div>
  );
}

import "./StatusSection.css";
import { numItems } from "../state";

export default function StatusSection() {
    return (
        <div id="status-section">
            <div class="sparkly-text">
                There are a total of {numItems} items on the shopping list!
            </div>
        </div>
    );
}

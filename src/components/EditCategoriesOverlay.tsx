import "./EditCategoriesOverlay.css";
import { useState } from 'preact/hooks';

import * as State from "../state";

export default function EditCategoriesOverlay() {
    const handleCategoryChange = (itemName: string, category: string) => {
        State.updateItemCategory(itemName, category);
    };

    return (
        <div class="mappings-overlay-container">
            <button onClick={() => State.setMode(State.Mode.Normal)} class="close-edit-categories-button">
                🗙
            </button>
            <div class="mappings-list">
                {Object.keys(State.getItemCategoryMap()).sort().map(itemName => (
                    <div key={itemName} class="mapping-container">
                        <label class="mapping-item-label" title={itemName}>
                            {itemName.length > 10 ? itemName.substring(0, 10) + "..." : itemName}
                        </label>
                        <select
                            value={State.getItemCategoryMap()[itemName]}
                            onChange={(e) => handleCategoryChange(itemName, (e.target as HTMLSelectElement).value)}
                            class="mapping-category-select"
                        >
                            {State.getCategories().map(category => (
                                <option key={category.name} value={category.name}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

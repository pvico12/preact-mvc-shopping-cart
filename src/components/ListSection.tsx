import "./ListSection.css";

import * as State from "../state";
import ShoppingListItem from "./ShoppingListItem";

export default function ListSection() {

    if (!State.itemsRetrieved.value) {
        return (
            // from https://loading.io/
            <img src="/loader-io.gif" alt="Loading..." style={{width: 50}} />
        );
    }

    return (
        <div id="list-section">
            {State.getCategories().map(category => {
                let targetItems = State.getShoppingList().filter((item) => item.category == category.name);
                return (
                    <div key={category.name} class="category" style={{ backgroundColor: category.colour }}>
                        <div class="category-header">
                            <span>{category.icon} {category.name} (
                                {targetItems.filter(item => item.bought).length}
                                /
                                {targetItems.length}
                            )
                            </span>
                        </div>
                        <div class="item-list">
                            {targetItems.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                                <ShoppingListItem key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
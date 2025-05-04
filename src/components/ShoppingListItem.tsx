import "./ShoppingListItem.css";

import * as State from "../state";

type ShoppingListItemProps = {
  item: State.ShoppingItem;
};

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
    return (
        <div key={item.name} class="shopping-list-item">
            <input
                type="checkbox"
                checked={item.bought}
                onChange={() => State.updateItem(item.name, { bought: !item.bought })}
            />
            <span class={item.bought ? "bought" : ""}>{item.name}</span>
            {!item.bought && (
                <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    max="24"
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement | null;
                        if (target) {
                            let value = parseInt(target.value);
                            if (isNaN(value)) return;
                            if (value > 24) value = 24;
                            if (value < 1) value = 1;
                            State.updateItem(item.name, { quantity: value });
                        }
                    }}
                />
            )}
            <button onClick={() => State.deleteItem(item.name)}>❌</button>
        </div>
    );
}

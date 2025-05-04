import { computed, signal } from "@preact/signals";

export enum Mode {
    Normal,
    EditCategories,
    ShowExpenses
}

export type ShoppingItem = {
    name: string;
    quantity: number;
    category: string;
    bought: boolean;
};

export type Category = {
    // id: number;
    icon: string;
    name: string;
    colour: string;
};

export type Todo = {
    id: number;
    task: string;
    done: boolean;
};

const OTHER_CATEGORY_NAME = "Other";

const categories : Category[] = [
    { icon: '🥛', name: "Dairy", colour: `hsl(220, 75%, 75%)` },
    { icon: '🧊', name: "Frozen", colour: `hsl(220, 90%, 95%)` },
    { icon: '🍌', name: "Fruit", colour: `hsl(140, 75%, 75%)` },
    { icon: '🛒', name: OTHER_CATEGORY_NAME, colour: `hsl(0, 0%, 90%)` }
];

const itemCategoryMap: { [key: string]: string } = {};

//#region state

export var mode = signal(Mode.Normal);

export const itemsRetrieved = signal(false);

export const shoppingItems = signal<ShoppingItem[]>([]);

export const numItems = computed(() => 
    shoppingItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

export const totalPrices = signal<number[]>([]);

//#endregion

//#region Getters

export function getMode(): Mode {
    return mode.value;
}

export function getShoppingList(): ShoppingItem[] {
    // return copy to avoid mutation
    return shoppingItems.value.map((i) => ({ ...i }));
}

export function getCategories(): Category[] {
    // return copy to avoid mutation
    return categories.map((c) => ({ ...c }));
}

export function getItemCategoryMap(): { [key: string]: string } {
    // return copy to avoid mutation
    return { ...itemCategoryMap };
}

export function getTotalPrices(): number[] {
    // return copy to avoid mutation
    return totalPrices.value.map((p) => p);
}

//#endregion

//#region Business Logic (CRUD)

export function setMode(newMode: Mode) {
    mode.value = newMode;
}

export function addItem(itemName: string, quantity: number, category: string) {
    // check if item already exists, and increment quantity
    const existingItem = shoppingItems.value.find((i) => i.name === itemName);
    // check if quantity will be greater than 24
    if (existingItem && existingItem.quantity + quantity > 24) {
        shoppingItems.value = shoppingItems.value.map((i) =>
            i.name === itemName ? { ...i, quantity: 24 } : i
        );
        return;
    }
    if (existingItem) {
        shoppingItems.value = shoppingItems.value.map((i) =>
            i.name === itemName ? { ...i, quantity: i.quantity + quantity } : i
        );
        return;
    }

    // otherwise add item
    const newItem: ShoppingItem = {
        name: itemName,
        quantity: quantity,
        category: category,
        bought: false
    };
    shoppingItems.value = [...shoppingItems.value, newItem];

    // add mapping
    itemCategoryMap[itemName] = category;
}

export function updateItem(name: string, item: { quantity?: number; bought?: boolean }) {
    const targetItem = shoppingItems.value.find((i) => i.name === name);
    if (targetItem) {
        const updatedItem = { ...targetItem, ...item };
        if (updatedItem.quantity > 24) {
            updatedItem.quantity = 24;
        } else if (updatedItem.quantity < 1) {
            updatedItem.quantity = 1;
        }
        shoppingItems.value = shoppingItems.value.map((i) =>
            i.name === name ? updatedItem : i
        );
    }
}
  
export function deleteItem(name: string) {
    shoppingItems.value = shoppingItems.value.filter((i) => i.name !== name);
}

export function updateItemCategory(itemName: string, category: string) {
    // update item category mapping
    itemCategoryMap[itemName] = category;

    // update item category
    shoppingItems.value = shoppingItems.value.map((i) =>
        i.name === itemName ? { ...i, category } : i
    );
}

//#endregion


// #region Fetch Items

export async function fetchShoppingItems() {
    try {
        const response = await fetch('https://student.cs.uwaterloo.ca/~cs349/resources/items.php');
        const data: ShoppingItem[] = await response.json();

        // create item-category map
        data.forEach(item => {
            itemCategoryMap[item.name] = item.category;
        })

        // merge duplicates and add their quantities
        var mergedItems: ShoppingItem[] = [];
        data.forEach(item => {
            const existingItem = mergedItems.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                mergedItems.push({ ...item });
            }
        });

        // remove items with quantity 0
        mergedItems = mergedItems.filter(i => i.quantity > 0);

        shoppingItems.value = mergedItems;
        itemsRetrieved.value = true;
    } catch (error) {
        console.error('Failed to fetch shopping items:', error);
        itemsRetrieved.value = false;
    }
}

fetchShoppingItems();

//#endregion

// #region Item Prices

export function resetPrices() {
    totalPrices.value = [];
}

export function addItemPrice(itemPrice: number) {
    totalPrices.value = [...totalPrices.value, itemPrice];
}

// #endregion
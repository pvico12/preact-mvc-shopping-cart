import {
  useEffect,
  useState,
} from "preact/hooks";

import "./AddSection.css";

import * as State from "../state";
import {Category} from "../state";

export default function AddSection() {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState("Other");
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryDropdownDisabled, setCategoryDropdownDisabled] = useState(false);
  
    useEffect(() => {
      setCategories(State.getCategories());
    }, [State]);
  
    function handleItemNameChange(e: Event) {
      const newValue = (e.target as HTMLInputElement).value;
      const value = newValue.replace(/^\s+/, "").replace(/[^a-zA-Z\s]/g, "");
      setItemName(value);
      
      const matchedCategory = State.getItemCategoryMap()[value];
      if (matchedCategory) {
        setCategory(matchedCategory);
        setCategoryDropdownDisabled(true);
      } else {
        setCategory("Other");
        setCategoryDropdownDisabled(false);
      }
    };
  
    const handleAddItem = () => {
      if (itemName === "" || quantity <= 0) {
        setItemName("");
        setQuantity(1);
        setCategory("Other");
        setCategoryDropdownDisabled(false);
        return;
      }

      State.addItem(itemName.trim(), quantity, category);
      setItemName("");
      setQuantity(1);
      setCategory("Other");
      setCategoryDropdownDisabled(false);
    };
  
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        handleAddItem();
      }
    };
  
    return (
      <div id="add-section">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onInput={handleItemNameChange}
          onKeyDown={(e) => {
            if (e.key === " " && itemName === "") {
              e.preventDefault();
            } else if (e.key >= "0" && e.key <= "9") {
              e.preventDefault();
            } else {
              handleKeyDown(e);
            }
          }}
          class="add-input"
        />
        <input
          type="number"
          value={quantity}
          min="1"
          max="24"
          step="1"
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            const target = e.target as HTMLInputElement | null;
            if (target) {
              let value = parseInt(target.value);
              if (value > 24) value = 24;
              if (value < 1) value = 1;
              setQuantity(value);
            }
          }}
          class="add-stepper"
        />
        <select
          value={category}
          onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
          disabled={categoryDropdownDisabled}
          class="add-selector"
        >
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>
              {cat.icon}
            </option>
          ))}
        </select>
        <button onClick={handleAddItem} class="add-button">➕</button>
      </div>
    );
  }
import "./ShowExpensesOverlay.css";
import { useEffect } from 'preact/hooks';
import * as State from "../state";
import ExpenseTableItem from "./ExpenseTableItem";

export default function ShowExpensesOverlay() {
    useEffect(() => {
        State.resetPrices();
    }, []);

    return (
        <div class="expenses-overlay-container">
            <button onClick={() => State.setMode(State.Mode.Normal)} class="close-expenses-button">
                🗙
            </button>
            <div>
                {State.getShoppingList().map((item) => (
                    <ExpenseTableItem name={item.name} quantity={item.quantity} />
                ))}
                <ExpenseTableItem isTotal={true} />
            </div>
        </div>
    );
};

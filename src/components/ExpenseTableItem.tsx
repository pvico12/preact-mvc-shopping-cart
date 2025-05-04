import { useEffect, useState } from "preact/hooks";
import "./ExpenseTableItem.css";
import * as State from "../state";

type ExpenseTableItemProps = {
    name?: string;
    quantity?: number;
    isTotal?: boolean;
};

export default function ExpenseTableItem({ name, quantity = 0, isTotal = false }: ExpenseTableItemProps) {
    const [price, setPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isTotal) {
            return;
        }

        const fetchPrice = async () => {
            try {
                const response = await fetch(`https://student.cs.uwaterloo.ca/~cs349/resources/prices.php?item=${name}`);
                const data = await response.json();
                setPrice(data.price);
                State.addItemPrice(data.price * quantity);
            } catch (error) {
                console.error("Error fetching price:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrice();
    }, [name, quantity, isTotal]);

    const itemCost = price !== null ? price * quantity : 0;

    return (
        <>
            {isTotal ? (
                <div class="expense-line-item-total">
                    <span class="expense-total-label">Total</span>
                    <span class="expense-total-price">{"$" + State.getTotalPrices().reduce((sum, price) => sum + price, 0).toFixed(2)}</span>
                </div>
            ) : (
                <div class="expense-line-item">
                    <span class="expense-name">{name}</span>
                    <span class="expense-quantity">{quantity}x</span>
                    <span class="expense-price">{loading ? <span class="loading-dots"></span> : "$" + price?.toFixed(2)}</span>
                    <span>=</span>
                    <span class="expense-cost">{loading ? <span class="loading-dots"></span> : "$" + itemCost.toFixed(2)}</span>
                </div>
            )}
        </>
    );
}

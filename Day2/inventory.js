/**
 * Inventory Management System for a Shop
 *
 * Commands:
 * insert  - Add a new inventory item
 * update  - Update an item's quantity or price
 * delete  - Delete an item
 * select  - Select and display one item
 * getall  - Display all inventory items
 * find    - Find one item by name
 * stats   - Calculate mean and median prices
 * sell    - Sell an item and update stock
 * sales   - Display sales history and revenue
 * help    - Display available commands
 * exit    - Exit the program
 */

// REPL: Read, Evaluate, Print, Loop

import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

// Get input from the terminal
async function getInput(params) {
    const answer = await rl.question(
        params ?? 'What is your task? '
    );

    return answer.trim();
}

// Arrays to store inventory and sales
const inventory = [];
const shell_items = [];

// Find an item by name
function findItem(name) {
    return inventory.find(
        item => item.name.toLowerCase() === name.toLowerCase()
    );
}

// Get a valid number from the user
async function getNumber(question, allowZero = false) {
    while (true) {
        const input = await getInput(question);
        const number = Number(input);

        if (
            input !== '' &&
            Number.isFinite(number) &&
            (allowZero ? number >= 0 : number > 0)
        ) {
            return number;
        }

        console.log(
            allowZero
                ? 'Enter a valid number (0 or greater).'
                : 'Enter a valid number greater than 0.'
        );
    }
}

// Display available commands
function showHelp() {
    console.log(`
Available Commands:
insert  - Add a new item
update  - Update quantity or price
delete  - Delete an item
select  - Select and display one item
getall  - Display all items
find    - Find one item by name
stats   - Show mean and median prices
sell    - Sell an item
sales   - Show sales history and revenue
help    - Show available commands
exit    - Exit the program
`);
}

// Insert a new item
async function insertItem() {
    const name = await getInput('Enter Name: ');

    if (name === '') {
        console.log('Name cannot be empty.');
        return;
    }

    if (findItem(name)) {
        console.log('This item already exists. Use update instead.');
        return;
    }

    const qty = await getNumber('Enter QTY: ');
    const price = await getNumber('Enter Price: ');

    const payload = {
        name,
        quantity: qty,
        price
    };

    inventory.push(payload);

    console.log(`✓ Added "${name}".`);
}

// Update an item's quantity or price
async function updateItem() {
    const name = await getInput('Enter Name to update: ');
    const item = findItem(name);

    if (!item) {
        console.log('Item not found.');
        return;
    }

    const field = (
        await getInput('Update quantity or price? ')
    ).toLowerCase();

    if (field === 'quantity' || field === 'qty') {
        item.quantity = await getNumber('Enter new QTY: ', true);
        console.log(`✓ Updated quantity of "${item.name}".`);
    } else if (field === 'price') {
        item.price = await getNumber('Enter new Price: ');
        console.log(`✓ Updated price of "${item.name}".`);
    } else {
        console.log('Please enter quantity or price.');
    }
}

// Delete an item
async function deleteItem() {
    const name = await getInput('Enter Name to delete: ');

    const index = inventory.findIndex(
        item => item.name.toLowerCase() === name.toLowerCase()
    );

    if (index === -1) {
        console.log('Item not found.');
        return;
    }

    const deletedItem = inventory.splice(index, 1)[0];

    console.log(`✓ Deleted "${deletedItem.name}".`);
}

// Select and display one item
async function selectItem() {
    const name = await getInput('Enter Name to select: ');
    const item = findItem(name);

    if (!item) {
        console.log('Item not found.');
        return;
    }

    console.table([item]);
}

// Find one item by name
async function findOneItem() {
    const name = await getInput('Enter Name to find: ');
    const item = findItem(name);

    if (!item) {
        console.log('Item not found.');
        return;
    }

    console.table([item]);
}

// Display all inventory items
function getAllItems() {
    if (inventory.length === 0) {
        console.log('Inventory is empty.');
        return;
    }

    console.table(inventory);
}

// Calculate mean and median prices
function showStats() {
    if (inventory.length === 0) {
        console.log('No inventory items available.');
        return;
    }

    const prices = inventory.map(item => item.price);

    // Calculate mean price
    const totalPrice = prices.reduce(
        (total, price) => total + price,
        0
    );

    const mean = totalPrice / prices.length;

    // Sort prices to calculate median
    const sortedPrices = [...prices].sort((a, b) => a - b);

    const middle = Math.floor(sortedPrices.length / 2);

    let median;

    if (sortedPrices.length % 2 === 0) {
        median =
            (sortedPrices[middle - 1] + sortedPrices[middle]) / 2;
    } else {
        median = sortedPrices[middle];
    }

    console.log(`Items: ${inventory.length}`);
    console.log(`Mean price: ${mean.toFixed(2)}`);
    console.log(`Median price: ${median.toFixed(2)}`);
}

// Sell an item and update stock
async function sellItem() {
    const name = await getInput('Enter Name to sell: ');
    const item = findItem(name);

    if (!item) {
        console.log('Item not found.');
        return;
    }

    const qty = await getNumber('Enter QTY to sell: ');

    if (qty > item.quantity) {
        console.log(`Not enough stock. Available: ${item.quantity}`);
        return;
    }

    // Reduce inventory quantity
    item.quantity -= qty;

    const total = qty * item.price;

    // Store the sale record
    const sale = {
        name: item.name,
        quantity: qty,
        price: item.price,
        total,
        date: new Date().toLocaleString()
    };

    shell_items.push(sale);

    console.log(
        `✓ Sold ${qty} "${item.name}" for ${total.toFixed(2)}.`
    );

    console.log(`Remaining stock: ${item.quantity}`);
}

// Display sales history and total revenue
function showSales() {
    if (shell_items.length === 0) {
        console.log('No sales recorded yet.');
        return;
    }

    console.table(shell_items);

    const revenue = shell_items.reduce(
        (total, sale) => total + sale.total,
        0
    );

    console.log(`Total revenue: ${revenue.toFixed(2)}`);
}

// Main program loop
async function main() {
    console.log('===== INVENTORY MANAGEMENT SYSTEM =====');

    showHelp();

    let exit = false;

    while (exit !== true) {
        const button = (await getInput()).toLowerCase();

        switch (button) {
            case 'insert':
                await insertItem();
                break;

            case 'update':
                await updateItem();
                break;

            case 'delete':
                await deleteItem();
                break;

            case 'select':
                await selectItem();
                break;

            case 'find':
                await findOneItem();
                break;

            case 'getall':
                getAllItems();
                break;

            case 'stats':
                showStats();
                break;

            case 'sell':
                await sellItem();
                break;

            case 'sales':
                showSales();
                break;

            case 'help':
                showHelp();
                break;

            case 'exit':
                exit = true;
                console.log('Thank you for using the system!');
                break;

            default:
                console.log('Invalid command. Type help to see commands.');
        }
    }

    rl.close();
}

main();
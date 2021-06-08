const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    "962452202619-04fchtj94o12h1tfd0h1kr07c7drfuec.apps.googleusercontent.com",
    "YhwPjvlHTq79DkbK9mwodF-z",
    "urn:ietf:wg:oauth:2.0:oob"
);

oAuth2Client.setCredentials({
    access_token:
        "ya29.a0AfH6SMBrLXUlMfNxJRgO0Zw7HFLLUJauxgJWKj18K5bf4ta5hjG2m8B7EZjC8iV03_n3_VG7tajZHCOzyavrb0rWAmM_c9npxUmj66U7c8yhT4iTPujVwB1yRmzUafl3pDF53wIsNeoE6MUBv6fK2cYeP0rl",
    refresh_token:
        "1//05qbWACAPDa3nCgYIARAAGAUSNwF-L9IrcYlwNUS24ucaCuoOXxEKGcZMVAa6m6xL337k4IPUmqWL6Umwo80uS5zEQaPVVMfM8xE",
    scope: "https://www.googleapis.com/auth/spreadsheets",
    token_type: "Bearer",
    expiry_date: 1620077344373,
});

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

async function read() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '1RESq_F4GQ1sHrBYXmqgIj9XMdbxv3augYBCXwZUSP6o',
        range: 'Products!A2:E',
    });

    const rows = response.data.values;
    const products = rows.map((row) => ({
        id: +row[0],
        name: row[1],
        price: +row[2],
        image: row[3],
        stock: +row[4],
    }));

    return products;
}

async function write(products) {
    let values = products.map(p => [p.id, p.name, p.price, p.image, p.stock]);

    const resource = {
        values,
    };
    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: '1RESq_F4GQ1sHrBYXmqgIj9XMdbxv3augYBCXwZUSP6o',
        range: 'Products!A2:E',
        valueInputOption: "RAW", /* Significa que los valores agregados serán colocados tal cual sin interpretarlos */
        resource,
    });
}

async function writeOrders(orders) {
    let values = orders.map(order => [
        order.date, 
        order.shipping.nombre, 
        order.shipping.dni,
        order.shipping.phone,
        JSON.stringify(order.items.map(i => i.name)),
        order.shipping.email,
        order.shipping.banco,
        order.shipping.referencia,
        order.shipping.total
    ]);

    const resource = {
        values,
    };

    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: '1RESq_F4GQ1sHrBYXmqgIj9XMdbxv3augYBCXwZUSP6o',
        range: 'Orders!A2:I',
        valueInputOption: "RAW",
        resource,
    });
}

async function readOrders() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '1RESq_F4GQ1sHrBYXmqgIj9XMdbxv3augYBCXwZUSP6o',
        range: 'Orders!A2:I',
    });

    const rows = response.data.values;
    const orders = rows.map((row) => ({
        date: row[0],
        nombre: row[1],
        dni: row[2],
        phone: row[3],
        items: JSON.parse(row[4]),
        email: row[5],
        banco: row[6],
        referencia: +row[7],
        total: row[8],
    }));

    return orders;
}


module.exports = { /* Utilizamos esto para exportar las funciones y utilizarlas en otro archivo */
    read,
    write,
    writeOrders,
    readOrders,
};
